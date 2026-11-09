# Tech & Code Summit 2027 - Portal oficial
Backend Node.js (módulo `http`, sem dependências) + Frontend HTML/CSS/JS consumindo a API REST.

## Executar
    node server.js      # ou npm start
Acesse http://localhost:2000 (porta fixa 2000). Requer Node 16+.

## Estrutura
- server.js: servidor estático + API REST (porta 2000)
- data.js: conteúdo (evento, lotes, trilhas, programação, equipe)
- data/inscricoes.json: inscrições gravadas pelo backend
- public/: páginas HTML, css/style.css e js/app.js

## API
GET /api/evento, /api/lotes, /api/trilhas, /api/trilhas/:id, /api/programacao?dia=&tipo=&trilha=, /api/equipe
POST /api/inscricoes, GET /api/inscricoes/:id, POST /api/pagamento/:id (simulado)

## Personalizar
Edite `equipe` em data.js (nome, RA, tecnologias) e coloque as fotos em public/img/ (campo `foto`).
