#  Tech & Code Summit 2027 - Portal Oficial

Plataforma web simulada para gestão de inscrições e programação do evento **Tech & Code Summit 2027**. Desenvolvido como projeto da disciplina de **Desenvolvimento Web III**. 

O sistema conta com uma arquitetura simples e robusta, utilizando um servidor construído totalmente em **Node.js**, sem dependências ou frameworks externos, responsável por servir arquivos estáticos (HTML, CSS, JS e imagens) e fornecer uma API REST para consumo do frontend.

---

## Pré-requisitos

Antes de iniciar, você precisará ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) na versão **16.x** ou superior.
* Um navegador web atualizado.

---

## 👥 Equipe Codelab

- **Gabriela Cardoso** — [XhScarlet](https://github.com/XhScarlet)
- **João Paulo Vitalino** — [JuaumPz](https://github.com/JuaumPz)
- **Julia Milagres** — [jmilagresdev](https://github.com/jmilagresdev)
- **Murilo Marcolino** — [murilosilvsilva-jpg](https://github.com/murilosilvsilva-jpg)
- **Yasmin Maria Etevilna** — [Yasmin1Silva](https://github.com/Yasmin1Silva)

---

## 🚀 Como Rodar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/murilosilvsilva-jpg/Tech-Code-Summit.git
   ```

2. **Navegue até o diretório do projeto:**
   ```bash
   cd Tech-Code-Summit
   ```

3. **Inicie o servidor:**
   ```bash
   node server.js
   # ou
   npm start
   ```

4. **Acesse no navegador:**
   Abra a URL [http://localhost:2000](http://localhost:2000) (o servidor roda em porta fixa `2000`).

---

## 🛠️ Tecnologias Utilizadas

### **Backend**
* **Node.js** (módulo nativo `http` — sem frameworks ou dependências externas)
* **JSON** (para armazenamento persistente de dados de inscrições)

### **Frontend**
* **HTML**
* **CSS**
* **JavaScript**

---

## Estrutura de Pastas e Arquivos

```text
Tech-Code-Summit/
├── server.js              # Servidor HTTP estático e endpoints da API REST (Porta 2000)
├── data.js                # Base de dados em memória (evento, lotes, trilhas, programação e equipe)
├── package.json           # Configurações e scripts de execução do projeto
├── data/
│   └── inscricoes.json    # Armazenamento JSON persistente das inscrições realizadas
└── public/                # Arquivos estáticos servidos pelo backend
    ├── index.html         # Página inicial do evento
    ├── inscricoes.html    # Formulário de inscrição
    ├── local.html         # Informações sobre o local
    ├── pagamento.html     # Tela de simulação de pagamento
    ├── programacao.html   # Grade e filtros de programação
    ├── quem-somos.html    # Informações sobre a equipe/projeto
    ├── trilha.html        # Detalhes de uma trilha específica
    ├── trilhas.html       # Lista de trilhas disponíveis
    ├── css/
    │   └── style.css      # Estilização global da aplicação
    └── js/
        └── app.js         # Lógica client-side e integração com a API REST
```

---

## Endpoints da API REST

O backend expõe a seguinte API para consumo do frontend:

### **Consultas (GET)**
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/evento` | Retorna as informações gerais do evento |
| `GET` | `/api/lotes` | Retorna os lotes de ingressos disponíveis |
| `GET` | `/api/trilhas` | Retorna a lista completa de trilhas |
| `GET` | `/api/trilhas/:id` | Retorna detalhes de uma trilha específica pelo ID |
| `GET` | `/api/programacao` | Retorna a programação (aceita filtros: `?dia=&tipo=&trilha=`) |
| `GET` | `/api/equipe` | Retorna a lista de integrantes da equipe |
| `GET` | `/api/inscricoes/:id` | Retorna os dados de uma inscrição específica |

### **Ações (POST)**
| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `POST` | `/api/inscricoes` | Realiza o cadastro de uma nova inscrição |
| `POST` | `/api/pagamento/:id` | Simula o processamento do pagamento da inscrição |

---

## ⚠️ Problemas Comuns

* **Porta `2000` já em uso:**
  * Se o servidor não iniciar informando que a porta `2000` está ocupada (`EADDRINUSE`), encerre o processo que está utilizando a porta ou altere o valor da variável de porta no arquivo `server.js`.
* **Erro de versão do Node.js:**
  * Certifique-se de que está usando o Node.js v16 ou superior. Você pode checar sua versão executando `node -v` no terminal.
* **Inscrições não salvando:**
  * Verifique se a pasta `data/` possui permissões de escrita para a gravação no arquivo `inscricoes.json`.
