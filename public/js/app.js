// Camada de frontend: layout compartilhado + consumo da API do backend.
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dataBR = (iso) => new Date(iso + "T12:00:00").toLocaleDateString("pt-BR");
const api = async (url, opts) => {
  const r = await fetch(url, opts && { ...opts, headers: { "Content-Type": "application/json" }, body: JSON.stringify(opts.body) });
  const d = await r.json();
  if (!r.ok) throw d;
  return d;
};

const MENU = [["index", "/", "Início"], ["inscricoes", "/inscricoes.html", "Inscrições"], ["trilhas", "/trilhas.html", "Trilhas"],
  ["local", "/local.html", "Local"], ["programacao", "/programacao.html", "Programação"], ["quem-somos", "/quem-somos.html", "Quem Somos"]];

function layout() {
  const page = document.body.dataset.page;
  document.body.insertAdjacentHTML("afterbegin", `<a class="skip" href="#main">Ir para o conteúdo</a>
  <header class="top"><div class="wrap"><a class="brand" href="/"><b>&lt;/&gt;</b>Tech &amp; Code Summit</a>
  <nav aria-label="Principal"><ul>${MENU.map(([id, href, t]) => `<li><a href="${href}" ${id === page || (page === "trilha" && id === "trilhas") ? 'aria-current="page"' : ""}>${t}</a></li>`).join("")}</ul></nav></div></header>`);
  document.body.insertAdjacentHTML("beforeend", `<footer><div class="wrap">Tech &amp; Code Summit 2027 · 18 e 19 de março · São Paulo. Projeto acadêmico de Desenvolvimento Web; pagamento simulado.</div></footer>`);
}

const paginas = {
  async index() {
    const ev = await api("/api/evento");
    $("#datas").textContent = ev.datas;
    $("#impacto").innerHTML = ev.impacto.map((i) => `<div class="stat"><strong>${i.valor}</strong>${i.rotulo}</div>`).join("");
    const alvo = new Date(ev.inicio).getTime();
    const tick = () => {
      const s = Math.max(0, Math.floor((alvo - Date.now()) / 1000));
      const v = [[Math.floor(s / 86400), "dias"], [Math.floor(s % 86400 / 3600), "horas"], [Math.floor(s % 3600 / 60), "min"], [s % 60, "seg"]];
      $("#contagem").innerHTML = v.map(([n, l]) => `<div><strong>${String(n).padStart(2, "0")}</strong><span>${l}</span></div>`).join("");
    };
    tick(); setInterval(tick, 1000);
    const tr = await api("/api/trilhas");
    $("#trilhas-home").innerHTML = tr.map(cardTrilha).join("");
  },

  async inscricoes() {
    const [lotes, trilhas] = await Promise.all([api("/api/lotes"), api("/api/trilhas")]);
    const hoje = new Date().toISOString().slice(0, 10);
    $("#lotes").innerHTML = lotes.map((l) => {
      const encerrado = l.ate < hoje || l.vagasRestantes <= 0;
      return `<article class="card"><h3>${esc(l.nome)}</h3><div class="price">${brl(l.preco)}</div><p>${esc(l.obs)}<br>Até ${dataBR(l.ate)} · ${l.vagasRestantes} vagas restantes</p>${encerrado ? '<span class="tag">Encerrado</span>' : ""}</article>`;
    }).join("");
    $("#loteId").innerHTML = lotes.filter((l) => l.ate >= hoje && l.vagasRestantes > 0).map((l) => `<option value="${l.id}">${esc(l.nome)} - ${brl(l.preco)}</option>`).join("");
    $("#trilhaInteresse").innerHTML = trilhas.map((t) => `<option value="${t.id}">${esc(t.nome)}</option>`).join("");
    $("#form-insc").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      const msg = $("#msg"); msg.hidden = true;
      try {
        const insc = await api("/api/inscricoes", { method: "POST", body: f });
        location.href = `/pagamento.html?id=${insc.id}`; // redireciona para a plataforma de pagamento simulada
      } catch (err) { msg.hidden = false; msg.textContent = (err.erros || [err.erro || "Erro inesperado"]).join(" "); }
    });
  },

  async pagamento() {
    const id = new URLSearchParams(location.search).get("id");
    const box = $("#resumo");
    try {
      const i = await api(`/api/inscricoes/${encodeURIComponent(id)}`);
      const render = (i) => {
        box.innerHTML = `<p><strong>${esc(i.nome)}</strong> · ${esc(i.email)}<br>${esc(i.lote)} · <span class="price">${brl(i.valor)}</span></p>` +
          (i.status === "pago" ? `<p class="msg ok">Pagamento confirmado. Seu código de credencial: <strong>${esc(i.codigo)}</strong></p>` : "");
        $("#form-pag").hidden = i.status === "pago";
      };
      render(i);
      $("#form-pag").addEventListener("submit", async (e) => {
        e.preventDefault();
        try { render({ ...i, ...(await api(`/api/pagamento/${i.id}`, { method: "POST", body: Object.fromEntries(new FormData(e.target)) })) }); }
        catch (err) { box.insertAdjacentHTML("beforeend", `<p class="msg">${esc(err.erro)}</p>`); }
      });
    } catch { box.innerHTML = '<p class="msg">Inscrição não encontrada. <a href="/inscricoes.html">Faça sua inscrição</a>.</p>'; $("#form-pag").hidden = true; }
  },

  async trilhas() { $("#lista").innerHTML = (await api("/api/trilhas")).map(cardTrilha).join(""); },

  async trilha() {
    const id = new URLSearchParams(location.search).get("id");
    try {
      const [t, prog] = await Promise.all([api(`/api/trilhas/${encodeURIComponent(id)}`), api(`/api/programacao?trilha=${encodeURIComponent(id)}`)]);
      document.title = `${t.nome} · Tech & Code Summit`;
      $("#conteudo").innerHTML = `<div class="page-head" style="--c:${t.cor}"><div class="wrap"><span class="ico">${t.icone}</span><h1 style="font-size:clamp(2rem,5vw,3.5rem)">${esc(t.nome)}</h1><p>${esc(t.descricao)}</p></div></div>
        <div class="wrap sec"><h2>O que vamos abordar</h2><p>${t.topicos.map((x) => `<span class="tag">${esc(x)}</span>`).join("")}</p>
        <h2>Palestrantes</h2><div class="grid">${t.palestrantes.map((p) => `<article class="card" style="--c:${t.cor}"><div class="avatar" aria-hidden="true">${esc(p.nome.replace(/^(Dra?\.|Prof\.)\s/, "")[0])}</div><h3>${esc(p.nome)}</h3><strong>${esc(p.cargo)}</strong><p>${esc(p.bio)}</p><p><em>Palestra: ${esc(p.tema)}</em></p></article>`).join("")}</div>
        <h2 style="margin-top:2.5rem">Na programação</h2>${prog.map(slot).join("") || "<p>Em breve.</p>"}
        <p style="margin-top:2rem"><a class="btn" href="/inscricoes.html">Garantir meu ingresso</a> <a class="btn alt" href="/trilhas.html">Todas as trilhas</a></p></div>`;
    } catch { $("#conteudo").innerHTML = '<div class="wrap sec"><h1>Trilha não encontrada</h1><a href="/trilhas.html">Ver todas as trilhas</a></div>'; }
  },

  local() {
    const info = {
      principal: ["Palco Principal", "Abertura, encerramento e keynotes. 1.500 lugares."],
      a: ["Palco A", "Palestras técnicas. 400 lugares."], b: ["Palco B", "Palestras técnicas. 400 lugares."],
      estandes: ["Área de Estandes", "40 estandes de empresas, startups e comunidades."],
      food: ["Praça de Alimentação", "Food trucks, cafés e área de descanso com tomadas."],
      oficinas: ["Salas de Workshops e Laboratório Maker", "Workshops e minicursos com 40 vagas por turma."]
    };
    const mostrar = (k) => {
      $("#info-zona").innerHTML = `<h3>${info[k][0]}</h3><p>${info[k][1]}</p>`;
      document.querySelectorAll(".legend button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.k === k));
    };
    document.querySelectorAll("[data-k]").forEach((el) => {
      el.addEventListener("click", () => mostrar(el.dataset.k));
      el.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), mostrar(el.dataset.k)));
    });
    mostrar("principal");
  },

  async programacao() {
    const trilhas = await api("/api/trilhas");
    $("#f-trilha").insertAdjacentHTML("beforeend", trilhas.map((t) => `<option value="${t.id}">${esc(t.nome)}</option>`).join(""));
    const nomes = Object.fromEntries(trilhas.map((t) => [t.id, t.nome])); nomes.geral = "Geral";
    const carregar = async () => {
      const q = new URLSearchParams(Object.fromEntries(["dia", "tipo", "trilha"].map((k) => [k, $("#f-" + k).value]).filter(([, v]) => v)));
      const lista = await api("/api/programacao?" + q);
      $("#agenda").innerHTML = lista.length ? [1, 2].map((d) => {
        const doDia = lista.filter((p) => p.dia === d);
        return doDia.length ? `<h2 style="margin-top:2rem">Dia ${d} · ${d === 1 ? "18" : "19"} de março</h2>${doDia.map((p) => slot(p, nomes)).join("")}` : "";
      }).join("") : '<p class="msg">Nenhuma atividade com esses filtros. Limpe um filtro para ver mais.</p>';
    };
    document.querySelectorAll(".filters select").forEach((s) => s.addEventListener("change", carregar));
    carregar();
  },

  async "quem-somos"() {
    $("#equipe").innerHTML = (await api("/api/equipe")).map((m) => `<article class="card"><${m.foto ? `img class="avatar" src="${esc(m.foto)}" alt="Foto de ${esc(m.nome)}"` : `div class="avatar" aria-hidden="true"`}>${m.foto ? "" : esc(m.nome[0])}${m.foto ? "" : "</div>"}
      <h3>${esc(m.nome)}</h3><strong>${esc(m.papel)}</strong><p>RA: ${esc(m.ra)}</p><p>${m.techs.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</p></article>`).join("");
  }
};

function cardTrilha(t) {
  return `<article class="card" style="--c:${t.cor}"><span class="ico">${t.icone}</span><h3>${esc(t.nome)}</h3><p>${esc(t.resumo)}</p><a class="btn alt" href="/trilha.html?id=${t.id}">Ver trilha e palestrantes</a></article>`;
}
function slot(p, nomes = {}) {
  return `<div class="slot"><time>${p.inicio}–${p.fim}</time><div><strong>${esc(p.titulo)}</strong><br><small>${esc(p.tipo)} · ${esc(p.sala)}${nomes[p.trilha] ? " · " + esc(nomes[p.trilha]) : ""}</small></div></div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  layout();
  paginas[document.body.dataset.page]?.().catch((e) => { console.error(e); $("#main").insertAdjacentHTML("afterbegin", '<p class="msg wrap">Não foi possível carregar os dados. Verifique se o servidor está rodando na porta 2000.</p>'); });
});
