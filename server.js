// Servidor HTTP em Node.js puro (sem dependências). Porta fixa: 2000.
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const db = require("./data");

const PORT = 2000;
const PUBLIC = path.join(__dirname, "public");
const FILE_INSCRICOES = path.join(__dirname, "data", "inscricoes.json");
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon" };

const lerInscricoes = () => { try { return JSON.parse(fs.readFileSync(FILE_INSCRICOES, "utf8")); } catch { return []; } };
const gravarInscricoes = (l) => fs.writeFileSync(FILE_INSCRICOES, JSON.stringify(l, null, 2));

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": MIME[".json"] });
  res.end(JSON.stringify(body));
}
function lerCorpo(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => { raw += c; if (raw.length > 1e5) { req.destroy(); reject(new Error("Corpo muito grande")); } });
    req.on("end", () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error("JSON inválido")); } });
  });
}
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const vagasRestantes = (lote, insc) => lote.vagas - insc.filter((i) => i.loteId === lote.id).length;

async function api(req, res, url) {
  const { pathname } = url;
  const m = req.method;

  if (m === "GET" && pathname === "/api/evento") return json(res, 200, db.evento);
  if (m === "GET" && pathname === "/api/lotes") {
    const insc = lerInscricoes();
    return json(res, 200, db.lotes.map((l) => ({ ...l, vagasRestantes: vagasRestantes(l, insc) })));
  }
  if (m === "GET" && pathname === "/api/trilhas") return json(res, 200, db.trilhas.map(({ palestrantes, ...t }) => t));
  const t = pathname.match(/^\/api\/trilhas\/([\w-]+)$/);
  if (m === "GET" && t) {
    const trilha = db.trilhas.find((x) => x.id === t[1]);
    return trilha ? json(res, 200, trilha) : json(res, 404, { erro: "Trilha não encontrada" });
  }
  if (m === "GET" && pathname === "/api/programacao") {
    let lista = db.programacao;
    const dia = url.searchParams.get("dia"), tipo = url.searchParams.get("tipo"), trilha = url.searchParams.get("trilha");
    if (dia) lista = lista.filter((p) => String(p.dia) === dia);
    if (tipo) lista = lista.filter((p) => p.tipo === tipo);
    if (trilha) lista = lista.filter((p) => p.trilha === trilha);
    return json(res, 200, lista);
  }
  if (m === "GET" && pathname === "/api/equipe") return json(res, 200, db.equipe);

  if (m === "POST" && pathname === "/api/inscricoes") {
    const d = await lerCorpo(req);
    const nome = String(d.nome || "").trim(), email = String(d.email || "").trim().toLowerCase();
    const lote = db.lotes.find((l) => l.id === Number(d.loteId));
    const erros = [];
    if (nome.length < 3) erros.push("Informe o nome completo.");
    if (!emailOk(email)) erros.push("Informe um e-mail válido.");
    if (!lote) erros.push("Escolha um lote de ingresso.");
    if (!db.trilhas.some((x) => x.id === d.trilhaInteresse)) erros.push("Escolha uma trilha de interesse.");
    if (erros.length) return json(res, 400, { erros });
    const lista = lerInscricoes();
    if (lista.some((i) => i.email === email)) return json(res, 409, { erros: ["Este e-mail já possui inscrição."] });
    if (vagasRestantes(lote, lista) <= 0) return json(res, 409, { erros: ["Lote esgotado. Escolha outro lote."] });
    const insc = { id: crypto.randomUUID(), nome, email, loteId: lote.id, trilhaInteresse: d.trilhaInteresse,
      valor: lote.preco, status: "pendente", criadoEm: new Date().toISOString() };
    lista.push(insc); gravarInscricoes(lista);
    return json(res, 201, insc);
  }
  const i = pathname.match(/^\/api\/inscricoes\/([\w-]+)$/);
  if (m === "GET" && i) {
    const insc = lerInscricoes().find((x) => x.id === i[1]);
    return insc ? json(res, 200, { ...insc, lote: db.lotes.find((l) => l.id === insc.loteId).nome }) : json(res, 404, { erro: "Inscrição não encontrada" });
  }
  // Plataforma de pagamento SIMULADA
  const p = pathname.match(/^\/api\/pagamento\/([\w-]+)$/);
  if (m === "POST" && p) {
    const d = await lerCorpo(req);
    const lista = lerInscricoes();
    const insc = lista.find((x) => x.id === p[1]);
    if (!insc) return json(res, 404, { erro: "Inscrição não encontrada" });
    if (!["pix", "cartao", "boleto"].includes(d.metodo)) return json(res, 400, { erro: "Método inválido" });
    insc.status = "pago"; insc.metodo = d.metodo; insc.pagoEm = new Date().toISOString();
    insc.codigo = "TCS-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    gravarInscricoes(lista);
    return json(res, 200, insc);
  }
  return json(res, 404, { erro: "Rota da API não encontrada" });
}

function estatico(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/") rel = "/index.html";
  const arquivo = path.normalize(path.join(PUBLIC, rel));
  if (!arquivo.startsWith(PUBLIC)) { res.writeHead(403); return res.end("Acesso negado"); }
  fs.readFile(arquivo, (err, buf) => {
    if (err) { res.writeHead(404, { "Content-Type": MIME[".html"] }); return res.end("<h1>404 - Página não encontrada</h1><a href='/'>Voltar ao início</a>"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(arquivo)] || "application/octet-stream" });
    res.end(buf);
  });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname.startsWith("/api/")) await api(req, res, url);
    else if (req.method === "GET") estatico(req, res, url);
    else { res.writeHead(405); res.end(); }
  } catch (e) { json(res, 500, { erro: e.message }); }
}).listen(PORT, () => console.log(`Tech & Code Summit rodando em http://localhost:${PORT}`));
