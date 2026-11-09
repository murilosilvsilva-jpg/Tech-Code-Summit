// Base de dados em memória (conteúdo do evento). Inscrições são gravadas em data/inscricoes.json
const evento = {
  nome: "Tech & Code Summit 2027",
  inicio: "2027-03-18T09:00:00-03:00",
  datas: "18 e 19 de março de 2027",
  local: "Centro de Inovação Paulista, São Paulo - SP",
  lema: "Código que muda cidades",
  descricao: "Dois dias de palestras, workshops e minicursos que reúnem estudantes, profissionais e empresas para discutir o futuro da tecnologia no Brasil.",
  impacto: [
    { valor: "5.000", rotulo: "participantes esperados" },
    { valor: "60", rotulo: "palestrantes convidados" },
    { valor: "40", rotulo: "estandes de empresas e startups" },
    { valor: "5", rotulo: "trilhas de conteúdo" }
  ]
};

const lotes = [
  { id: 1, nome: "Lote Pioneiro", preco: 79.9, ate: "2026-12-31", vagas: 500, obs: "Estudantes com comprovante" },
  { id: 2, nome: "Lote Regular", preco: 129.9, ate: "2027-02-15", vagas: 2500, obs: "Acesso aos 2 dias" },
  { id: 3, nome: "Lote Final", preco: 189.9, ate: "2027-03-15", vagas: 2000, obs: "Acesso aos 2 dias + kit" }
];

const trilhas = [
  { id: "engenharia-software", nome: "Engenharia de Software", cor: "#0B6E6E", icone: "{ }",
    resumo: "Arquitetura, qualidade, DevOps e boas práticas para times que entregam software de verdade.",
    descricao: "Da modelagem de sistemas distribuídos à cultura DevOps, esta trilha mostra como equipes brasileiras constroem produtos escaláveis, testáveis e fáceis de manter.",
    topicos: ["Microsserviços e arquitetura limpa", "CI/CD e observabilidade", "Testes automatizados", "Engenharia de plataforma"],
    palestrantes: [
      { nome: "Marina Albuquerque", cargo: "Principal Engineer, fintech", bio: "15 anos desenhando sistemas de pagamento de alta disponibilidade. Mentora de mulheres em tecnologia.", tema: "Monolito ou microsserviços? Decisões que custam caro" },
      { nome: "Rafael Tozzi", cargo: "SRE Lead, e-commerce", bio: "Especialista em confiabilidade e resposta a incidentes. Autor de artigos sobre SLOs.", tema: "Observabilidade sem ruído" }
    ] },
  { id: "inteligencia-artificial", nome: "Inteligência Artificial", cor: "#E4572E", icone: "AI",
    resumo: "Aprendizado de máquina, IA generativa e ética aplicada a produtos reais.",
    descricao: "Casos práticos de modelos de linguagem, visão computacional e MLOps, com discussão sobre uso responsável e impacto social.",
    topicos: ["IA generativa em produtos", "MLOps", "Visão computacional", "Ética e governança de dados"],
    palestrantes: [
      { nome: "Dra. Helena Prado", cargo: "Pesquisadora, USP", bio: "Doutora em Ciência da Computação, pesquisa modelos de linguagem em português.", tema: "Modelos de linguagem para o português brasileiro" },
      { nome: "Caio Nogueira", cargo: "ML Engineer, healthtech", bio: "Leva modelos de diagnóstico por imagem da pesquisa à produção.", tema: "Do notebook à produção: MLOps na saúde" }
    ] },
  { id: "mobile", nome: "Mobile", cor: "#3A5BA0", icone: "📱",
    resumo: "Apps nativos e multiplataforma com foco em desempenho e experiência.",
    descricao: "Panorama de Kotlin, Swift, Flutter e React Native, além de acessibilidade, performance e publicação nas lojas.",
    topicos: ["Kotlin Multiplatform", "Flutter vs React Native", "Acessibilidade móvel", "Performance e consumo de bateria"],
    palestrantes: [
      { nome: "Beatriz Quintela", cargo: "Android GDE", bio: "Desenvolvedora Android há 10 anos e organizadora de comunidades locais.", tema: "Jetpack Compose em apps grandes" },
      { nome: "Diego Fontes", cargo: "Tech Lead Mobile, varejo", bio: "Conduziu a migração de um app com 8 milhões de usuários para Flutter.", tema: "Lições de uma migração para Flutter" }
    ] },
  { id: "embarcados-iot", nome: "Embarcados e IoT", cor: "#B8860B", icone: "◉",
    resumo: "Hardware, sensores, conectividade e automação conectada.",
    descricao: "Da placa ao dashboard: firmware, protocolos como MQTT e LoRaWAN, e aplicações em agro, indústria e cidades inteligentes.",
    topicos: ["ESP32 e microcontroladores", "MQTT e LoRaWAN", "Edge AI", "IoT no agronegócio"],
    palestrantes: [
      { nome: "Prof. Lucas Matsuda", cargo: "Professor, Engenharia de Computação", bio: "Pesquisa sistemas embarcados de baixo consumo e coordena laboratório de prototipagem.", tema: "Firmware que dura anos com bateria" },
      { nome: "Aline Cardoso", cargo: "Engenheira IoT, agrotech", bio: "Projeta redes de sensores para monitoramento de lavouras.", tema: "Sensores no campo: lições de LoRaWAN" }
    ] },
  { id: "seguranca-cloud", nome: "Segurança e Cloud", cor: "#6B3FA0", icone: "🔒",
    resumo: "Infraestrutura em nuvem, segurança ofensiva e defensiva, e LGPD.",
    descricao: "Como proteger aplicações modernas: threat modeling, DevSecOps, gestão de identidades e conformidade com a LGPD.",
    topicos: ["DevSecOps", "Zero Trust", "Kubernetes seguro", "LGPD na prática"],
    palestrantes: [
      { nome: "Thiago Rezende", cargo: "Pentester sênior", bio: "Participa de programas de bug bounty e treina equipes de desenvolvimento.", tema: "Como invadimos sua API (e como evitar)" },
      { nome: "Priscila Amaral", cargo: "Arquiteta Cloud", bio: "Certificada em múltiplas nuvens, especialista em governança e custos.", tema: "FinOps e segurança andam juntos" }
    ] }
];

const programacao = [
  { id: 1, dia: 1, inicio: "09:00", fim: "10:00", tipo: "Palestra", titulo: "Abertura: Código que muda cidades", trilha: "geral", sala: "Palco Principal" },
  { id: 2, dia: 1, inicio: "10:30", fim: "11:30", tipo: "Palestra", titulo: "Monolito ou microsserviços? Decisões que custam caro", trilha: "engenharia-software", sala: "Palco A" },
  { id: 3, dia: 1, inicio: "10:30", fim: "11:30", tipo: "Palestra", titulo: "Modelos de linguagem para o português brasileiro", trilha: "inteligencia-artificial", sala: "Palco B" },
  { id: 4, dia: 1, inicio: "14:00", fim: "17:00", tipo: "Workshop", titulo: "Construindo uma API REST com Node.js", trilha: "engenharia-software", sala: "Sala de Workshops 1" },
  { id: 5, dia: 1, inicio: "14:00", fim: "16:00", tipo: "Minicurso", titulo: "Primeiros passos com ESP32 e MQTT", trilha: "embarcados-iot", sala: "Laboratório Maker" },
  { id: 6, dia: 1, inicio: "16:30", fim: "17:30", tipo: "Palestra", titulo: "Jetpack Compose em apps grandes", trilha: "mobile", sala: "Palco B" },
  { id: 7, dia: 2, inicio: "09:30", fim: "10:30", tipo: "Palestra", titulo: "Como invadimos sua API (e como evitar)", trilha: "seguranca-cloud", sala: "Palco A" },
  { id: 8, dia: 2, inicio: "10:30", fim: "12:30", tipo: "Minicurso", titulo: "Flutter do zero ao app publicado", trilha: "mobile", sala: "Sala de Workshops 2" },
  { id: 9, dia: 2, inicio: "11:00", fim: "12:00", tipo: "Palestra", titulo: "Do notebook à produção: MLOps na saúde", trilha: "inteligencia-artificial", sala: "Palco B" },
  { id: 10, dia: 2, inicio: "14:00", fim: "17:00", tipo: "Workshop", titulo: "Ajustando um modelo de IA com seus dados", trilha: "inteligencia-artificial", sala: "Sala de Workshops 1" },
  { id: 11, dia: 2, inicio: "15:00", fim: "16:00", tipo: "Palestra", titulo: "Sensores no campo: lições de LoRaWAN", trilha: "embarcados-iot", sala: "Palco A" },
  { id: 12, dia: 2, inicio: "17:30", fim: "18:30", tipo: "Palestra", titulo: "Encerramento e sorteios", trilha: "geral", sala: "Palco Principal" }
];

const equipe = [
  // TODO: substitua pelos dados reais do grupo (foto em public/img/ e campo "foto")
  { nome: "Gabriela Cardoso", ra: "00000001", papel: "Backend", foto: "", techs: ["Node.js", "REST APIs", "JSON", "Git", "Java", "Markdown"] },
  { nome: "João Paulo", ra: "00000002", papel: "Backend", foto: "", techs: ["Node.js", "REST APIs", "JSON", "Git", "Java"] },
  { nome: "Julia Milagres", ra: "00000003", papel: "Frontend e UI/UX", foto: "", techs: ["Figma", "Design responsivo", "CSS Grid", "HTML"s] },
  { nome: "Murilo Marcolino", ra: "00000004", papel: "Frontend", foto: "", techs: ["HTML", "CSS", "JavaScript", "Figma"] },
  { nome: "Yasmin Maria", ra: "00000005", papel: "Banco de dados", foto: "", techs: ["SQL", "Power BI", "Análise de dados"] }
];

module.exports = { evento, lotes, trilhas, programacao, equipe };
