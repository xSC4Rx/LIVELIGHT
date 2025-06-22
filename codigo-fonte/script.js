// Variáveis globais
let usuarioAtual = null
let historicoIMC = []
let historicoCalorias = []
let metaPeso = null
let mensagens = []

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Carregar dados do localStorage
  carregarDados()

  // Inicializar eventos
  inicializarEventos()

  // Inicializar gráficos
  inicializarGraficos()

  // Atualizar interface com base nos dados carregados
  atualizarInterface()
})

// Funções de inicialização
function carregarDados() {
  // Carregar usuário atual
  const usuarioSalvo = localStorage.getItem("usuarioAtual")
  if (usuarioSalvo) {
    usuarioAtual = JSON.parse(usuarioSalvo)
  }

  // Carregar histórico de IMC
  const historicoIMCSalvo = localStorage.getItem("historicoIMC")
  if (historicoIMCSalvo) {
    historicoIMC = JSON.parse(historicoIMCSalvo)
  }

  // Carregar histórico de calorias
  const historicoCaloriasSalvo = localStorage.getItem("historicoCalorias")
  if (historicoCaloriasSalvo) {
    historicoCalorias = JSON.parse(historicoCaloriasSalvo)
  }

  // Carregar meta de peso
  const metaPesoSalva = localStorage.getItem("metaPeso")
  if (metaPesoSalva) {
    metaPeso = JSON.parse(metaPesoSalva)
  }

  // Carregar mensagens
  const mensagensSalvas = localStorage.getItem("mensagens")
  if (mensagensSalvas) {
    mensagens = JSON.parse(mensagensSalvas)
  }
}

function inicializarEventos() {
  // Eventos de formulários
  document.getElementById("imc-form").addEventListener("submit", calcularIMC)
  document.getElementById("calorias-form").addEventListener("submit", calcularCalorias)
  document.getElementById("meta-peso-form").addEventListener("submit", definirMetaPeso)
  document.getElementById("contato-form").addEventListener("submit", enviarMensagem)

  // Eventos de botões de salvar
  document.getElementById("salvar-imc").addEventListener("click", salvarIMC)
  document.getElementById("salvar-calorias").addEventListener("click", salvarCalorias)

  // Eventos de tabs
  const tabBtns = document.querySelectorAll(".tab-btn")
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")
      alternarTab(tabId)
    })
  })

  // Eventos de modais
  document.getElementById("login-btn").addEventListener("click", abrirModal("login-modal"))
  document.getElementById("register-btn").addEventListener("click", abrirModal("register-modal"))

  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", fecharModais)
  })

  document.getElementById("switch-to-register").addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("login-modal").style.display = "none"
    document.getElementById("register-modal").style.display = "block"
  })

  document.getElementById("switch-to-login").addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("register-modal").style.display = "none"
    document.getElementById("login-modal").style.display = "block"
  })

  // Eventos de formulários de autenticação
  document.getElementById("login-form").addEventListener("submit", fazerLogin)
  document.getElementById("register-form").addEventListener("submit", fazerCadastro)

  // Eventos de recuperação de senha
  document.getElementById("forgot-password").addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("login-modal").style.display = "none"
    document.getElementById("password-recovery-modal").style.display = "block"
  })

  document.getElementById("back-to-login").addEventListener("click", (e) => {
    e.preventDefault()
    document.getElementById("password-recovery-modal").style.display = "none"
    document.getElementById("login-modal").style.display = "block"
  })

  document.getElementById("verify-email-btn").addEventListener("click", verificarEmail)
  document.getElementById("verify-keywords-btn").addEventListener("click", verificarPalavrasChave)
  document.getElementById("password-recovery-form").addEventListener("submit", alterarSenha)

  // Eventos de filtros de mensagens
  document.getElementById("filtro-tipo").addEventListener("change", filtrarMensagens)
  document.getElementById("filtro-status").addEventListener("change", filtrarMensagens)

  // Eventos de ações de mensagens
  document.getElementById("marcar-lida-btn").addEventListener("click", marcarComoLida)
  document.getElementById("marcar-respondida-btn").addEventListener("click", marcarComoRespondida)

  // Evento de scroll suave
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: "smooth",
        })
      }
    })
  })

  // Botão de começar
  document.getElementById("start-btn").addEventListener("click", () => {
    window.scrollTo({
      top: document.getElementById("calculadoras").offsetTop - 100,
      behavior: "smooth",
    })
  })
}

function inicializarGraficos() {
  // Inicializar gráfico de IMC
  const ctxIMC = document.getElementById("imc-grafico").getContext("2d")
  criarGraficoIMC(ctxIMC)

  // Inicializar gráfico de calorias
  const ctxCalorias = document.getElementById("calorias-grafico").getContext("2d")
  criarGraficoCalorias(ctxCalorias)
}

function atualizarInterface() {
  // Atualizar tabelas de histórico
  atualizarTabelaIMC()
  atualizarTabelaCalorias()

  // Atualizar progresso da meta
  atualizarProgressoMeta()

  // Atualizar interface de usuário (logado/não logado)
  atualizarInterfaceUsuario()

  // Atualizar tabela de mensagens se for profissional
  if (usuarioAtual && usuarioAtual.tipo === 'profissional') {
    atualizarTabelaMensagens()
  }
}

// Funções de recuperação de senha
function verificarEmail() {
  const email = document.getElementById("recovery-email").value
  
  if (!email) {
    alert("Por favor, digite seu email.")
    return
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
  const usuario = usuarios.find(u => u.email === email)

  if (!usuario) {
    alert("Email não encontrado.")
    return
  }

  if (!usuario.palavrasChave) {
    alert("Este usuário não possui palavras-chave de segurança cadastradas.")
    return
  }

  // Mostrar seção de perguntas de segurança
  document.getElementById("security-questions-section").classList.remove("hidden")
  document.getElementById("verify-email-btn").style.display = "none"
}

function verificarPalavrasChave() {
  const email = document.getElementById("recovery-email").value
  const palavra1 = document.getElementById("recovery-palavra-1").value.toLowerCase().trim()
  const palavra2 = document.getElementById("recovery-palavra-2").value.toLowerCase().trim()
  const palavra3 = document.getElementById("recovery-palavra-3").value.toLowerCase().trim()

  if (!palavra1 || !palavra2 || !palavra3) {
    alert("Por favor, preencha todas as palavras-chave.")
    return
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
  const usuario = usuarios.find(u => u.email === email)

  if (!usuario) {
    alert("Erro interno. Tente novamente.")
    return
  }

  const palavrasCorretas = usuario.palavrasChave
  if (palavra1 === palavrasCorretas[0].toLowerCase() && 
      palavra2 === palavrasCorretas[1].toLowerCase() && 
      palavra3 === palavrasCorretas[2].toLowerCase()) {
    
    // Mostrar seção de nova senha
    document.getElementById("new-password-section").classList.remove("hidden")
    document.getElementById("verify-keywords-btn").style.display = "none"
  } else {
    alert("Uma ou mais palavras-chave estão incorretas.")
  }
}

function alterarSenha(e) {
  e.preventDefault()

  const email = document.getElementById("recovery-email").value
  const novaSenha = document.getElementById("new-password").value
  const confirmarSenha = document.getElementById("confirm-new-password").value

  if (!novaSenha || !confirmarSenha) {
    alert("Por favor, preencha todos os campos.")
    return
  }

  if (novaSenha !== confirmarSenha) {
    alert("As senhas não coincidem.")
    return
  }

  if (novaSenha.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.")
    return
  }

  // Atualizar senha no localStorage
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
  const usuarioIndex = usuarios.findIndex(u => u.email === email)

  if (usuarioIndex !== -1) {
    usuarios[usuarioIndex].senha = novaSenha
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
    
    alert("Senha alterada com sucesso!")
    
    // Resetar formulário e fechar modal
    document.getElementById("password-recovery-form").reset()
    document.getElementById("security-questions-section").classList.add("hidden")
    document.getElementById("new-password-section").classList.add("hidden")
    document.getElementById("verify-email-btn").style.display = "block"
    fecharModais()
  } else {
    alert("Erro ao alterar senha. Tente novamente.")
  }
}

// Funções de cálculo (mantidas do código original)
function calcularIMC(e) {
  e.preventDefault()

  const peso = Number.parseFloat(document.getElementById("peso").value)
  const altura = Number.parseFloat(document.getElementById("altura").value) / 100 // Converter cm para m

  if (isNaN(peso) || isNaN(altura) || altura <= 0 || peso <= 0) {
    alert("Por favor, insira valores válidos para peso e altura.")
    return
  }

  const imc = peso / (altura * altura)
  const imcArredondado = imc.toFixed(1)

  // Determinar categoria
  let categoria = ""
  let descricao = ""
  let dicas = []

  if (imc < 18.5) {
    categoria = "Abaixo do peso"
    descricao =
      "Você está abaixo do peso ideal. Considere consultar um nutricionista para orientações sobre como ganhar peso de forma saudável."
    dicas = [
      "Aumente o consumo de proteínas magras como frango, peixe e ovos",
      "Adicione alimentos calóricos saudáveis como abacate, nozes e azeite de oliva",
      "Faça refeições menores, mas com maior frequência ao longo do dia",
      "Considere exercícios de resistência para ganhar massa muscular",
      "Mantenha-se hidratado e evite pular refeições",
    ]
  } else if (imc < 25) {
    categoria = "Peso normal"
    descricao = "Parabéns! Seu peso está dentro da faixa considerada saudável. Continue mantendo hábitos saudáveis."
    dicas = [
      "Mantenha uma dieta equilibrada com frutas, vegetais e proteínas magras",
      "Pratique atividade física regularmente, pelo menos 150 minutos por semana",
      "Mantenha-se hidratado bebendo pelo menos 2 litros de água por dia",
      "Priorize o sono de qualidade, dormindo de 7 a 8 horas por noite",
      "Faça check-ups médicos regulares para monitorar sua saúde geral",
    ]
  } else if (imc < 30) {
    categoria = "Sobrepeso"
    descricao =
      "Você está com sobrepeso. Considere adotar uma alimentação mais equilibrada e aumentar a prática de atividades físicas."
    dicas = [
      "Reduza o consumo de alimentos processados e ricos em açúcar",
      "Aumente a ingestão de fibras através de frutas, vegetais e grãos integrais",
      "Pratique atividades aeróbicas como caminhada, natação ou ciclismo",
      "Controle o tamanho das porções nas refeições",
      "Estabeleça metas realistas de perda de peso (0,5 a 1kg por semana)",
    ]
  } else if (imc < 35) {
    categoria = "Obesidade Grau I"
    descricao =
      "Você está com obesidade grau I. Recomenda-se consultar um médico e um nutricionista para orientações específicas."
    dicas = [
      "Consulte um médico antes de iniciar qualquer programa de exercícios",
      "Trabalhe com um nutricionista para criar um plano alimentar personalizado",
      "Comece com exercícios de baixo impacto como caminhada ou natação",
      "Monitore seu progresso mantendo um diário alimentar",
      "Busque apoio de amigos, familiares ou grupos de apoio",
    ]
  } else if (imc < 40) {
    categoria = "Obesidade Grau II"
    descricao =
      "Você está com obesidade grau II. É importante buscar acompanhamento médico e nutricional para melhorar sua saúde."
    dicas = [
      "Busque acompanhamento médico regular para monitorar sua saúde",
      "Trabalhe com uma equipe multidisciplinar (médico, nutricionista, psicólogo)",
      "Estabeleça metas pequenas e alcançáveis para mudanças de hábitos",
      "Considere atividades físicas adaptadas como exercícios na água",
      "Priorize alimentos integrais e evite dietas restritivas extremas",
    ]
  } else {
    categoria = "Obesidade Grau III"
    descricao =
      "Você está com obesidade grau III. Busque ajuda médica imediatamente para orientações sobre como melhorar sua saúde."
    dicas = [
      "Busque atendimento médico especializado imediatamente",
      "Siga rigorosamente as orientações da sua equipe médica",
      "Considere todas as opções de tratamento discutidas com seu médico",
      "Faça mudanças graduais e sustentáveis em seu estilo de vida",
      "Mantenha-se motivado celebrando pequenas conquistas",
    ]
  }

  // Exibir resultado
  document.getElementById("imc-valor").textContent = imcArredondado
  document.getElementById("imc-categoria").textContent = categoria
  document.getElementById("imc-descricao").textContent = descricao

  // Adicionar dicas
  const dicasLista = document.getElementById("imc-dicas")
  dicasLista.innerHTML = ""
  dicas.forEach((dica) => {
    const li = document.createElement("li")
    li.textContent = dica
    dicasLista.appendChild(li)
  })

  document.getElementById("imc-resultado").classList.remove("hidden")

  // Salvar resultado temporariamente
  document.getElementById("imc-form").dataset.imc = imcArredondado
  document.getElementById("imc-form").dataset.categoria = categoria
}

function calcularCalorias(e) {
  e.preventDefault()

  const idade = Number.parseInt(document.getElementById("idade").value)
  const genero = document.getElementById("genero").value
  const peso = Number.parseFloat(document.getElementById("peso-cal").value)
  const altura = Number.parseFloat(document.getElementById("altura-cal").value)
  const atividade = document.getElementById("atividade").value
  const objetivo = document.getElementById("objetivo").value

  if (isNaN(idade) || isNaN(peso) || isNaN(altura) || !genero || !atividade || !objetivo) {
    alert("Por favor, preencha todos os campos corretamente.")
    return
  }

  // Calcular TMB (Taxa Metabólica Basal) usando a fórmula de Harris-Benedict
  let tmb = 0
  if (genero === "masculino") {
    tmb = 88.362 + 13.397 * peso + 4.799 * altura - 5.677 * idade
  } else {
    tmb = 447.593 + 9.247 * peso + 3.098 * altura - 4.33 * idade
  }

  // Fator de atividade
  let fatorAtividade = 1.2 // Sedentário
  switch (atividade) {
    case "sedentario":
      fatorAtividade = 1.2
      break
    case "leve":
      fatorAtividade = 1.375
      break
    case "moderado":
      fatorAtividade = 1.55
      break
    case "ativo":
      fatorAtividade = 1.725
      break
    case "extremo":
      fatorAtividade = 1.9
      break
  }

  // Calcular necessidade calórica diária
  let calorias = tmb * fatorAtividade

  // Ajustar com base no objetivo
  switch (objetivo) {
    case "perder":
      calorias = calorias - 500 // Déficit de 500 calorias para perder peso
      break
    case "ganhar":
      calorias = calorias + 500 // Superávit de 500 calorias para ganhar peso
      break
    // Caso seja 'manter', não é necessário ajuste
  }

  const caloriasArredondadas = Math.round(calorias)

  // Gerar descrição
  let descricao = ""
  let dicas = []

  switch (objetivo) {
    case "perder":
      descricao = `Para perder peso de forma saudável, você deve consumir aproximadamente ${caloriasArredondadas} calorias por dia. Isso representa um déficit de 500 calorias em relação à sua necessidade de manutenção.`
      dicas = [
        "Priorize alimentos ricos em proteínas para preservar a massa muscular",
        "Consuma alimentos ricos em fibras para aumentar a saciedade",
        "Evite bebidas açucaradas e álcool, que contêm calorias vazias",
        "Pratique exercícios aeróbicos e de resistência para maximizar a queima calórica",
        "Mantenha um diário alimentar para controlar sua ingestão calórica",
      ]
      break
    case "manter":
      descricao = `Para manter seu peso atual, você deve consumir aproximadamente ${caloriasArredondadas} calorias por dia.`
      dicas = [
        "Mantenha uma dieta equilibrada com todos os grupos alimentares",
        "Pratique atividade física regularmente para manter seu metabolismo ativo",
        "Monitore seu peso semanalmente para fazer ajustes se necessário",
        "Preste atenção aos sinais de fome e saciedade do seu corpo",
        "Permita-se pequenos prazeres com moderação",
      ]
      break
    case "ganhar":
      descricao = `Para ganhar peso de forma saudável, você deve consumir aproximadamente ${caloriasArredondadas} calorias por dia. Isso representa um superávit de 500 calorias em relação à sua necessidade de manutenção.`
      dicas = [
        "Aumente o consumo de proteínas para auxiliar no ganho de massa muscular",
        "Adicione gorduras saudáveis como azeite, abacate e oleaginosas às refeições",
        "Consuma lanches calóricos entre as refeições principais",
        "Pratique exercícios de resistência para estimular o ganho de massa muscular",
        "Priorize alimentos densos em nutrientes em vez de fast food",
      ]
      break
  }

  // Adicionar dicas específicas com base no nível de atividade
  if (atividade === "sedentario") {
    dicas.push("Tente aumentar sua atividade diária com caminhadas curtas ou subindo escadas")
  } else if (atividade === "extremo") {
    dicas.push("Certifique-se de consumir proteínas suficientes para recuperação muscular")
  }

  // Exibir resultado
  document.getElementById("calorias-valor").textContent = caloriasArredondadas
  document.getElementById("calorias-descricao").textContent = descricao

  // Adicionar dicas
  const dicasLista = document.getElementById("calorias-dicas")
  dicasLista.innerHTML = ""
  dicas.forEach((dica) => {
    const li = document.createElement("li")
    li.textContent = dica
    dicasLista.appendChild(li)
  })

  document.getElementById("calorias-resultado").classList.remove("hidden")

  // Salvar resultado temporariamente
  document.getElementById("calorias-form").dataset.calorias = caloriasArredondadas
  document.getElementById("calorias-form").dataset.objetivo = objetivo
}

// Funções de salvamento
function salvarIMC() {
  if (!usuarioAtual) {
    alert("Você precisa estar logado para salvar seu histórico.")
    abrirModal("login-modal")()
    return
  }

  const imcForm = document.getElementById("imc-form")
  const imc = Number.parseFloat(imcForm.dataset.imc)
  const categoria = imcForm.dataset.categoria

  if (!imc || !categoria) {
    alert("Erro ao salvar. Por favor, calcule seu IMC novamente.")
    return
  }

  const novoRegistro = {
    id: Date.now(),
    data: new Date().toISOString(),
    imc: imc,
    categoria: categoria,
    usuario: usuarioAtual.id,
  }

  historicoIMC.push(novoRegistro)
  localStorage.setItem("historicoIMC", JSON.stringify(historicoIMC))

  alert("IMC salvo com sucesso!")

  // Atualizar interface
  atualizarTabelaIMC()
  atualizarGraficoIMC()
}

function salvarCalorias() {
  if (!usuarioAtual) {
    alert("Você precisa estar logado para salvar seu histórico.")
    abrirModal("login-modal")()
    return
  }

  const caloriasForm = document.getElementById("calorias-form")
  const calorias = Number.parseInt(caloriasForm.dataset.calorias)
  const objetivo = caloriasForm.dataset.objetivo

  if (!calorias || !objetivo) {
    alert("Erro ao salvar. Por favor, calcule suas calorias novamente.")
    return
  }

  const novoRegistro = {
    id: Date.now(),
    data: new Date().toISOString(),
    calorias: calorias,
    objetivo: objetivo,
    usuario: usuarioAtual.id,
  }

  historicoCalorias.push(novoRegistro)
  localStorage.setItem("historicoCalorias", JSON.stringify(historicoCalorias))

  alert("Calorias salvas com sucesso!")

  // Atualizar interface
  atualizarTabelaCalorias()
  atualizarGraficoCalorias()
}

function definirMetaPeso(e) {
  e.preventDefault()

  if (!usuarioAtual) {
    alert("Você precisa estar logado para definir metas.")
    abrirModal("login-modal")()
    return
  }

  const pesoAtual = Number.parseFloat(document.getElementById("peso-atual").value)
  const pesoMeta = Number.parseFloat(document.getElementById("peso-meta").value)
  const dataMeta = document.getElementById("data-meta").value

  if (isNaN(pesoAtual) || isNaN(pesoMeta) || !dataMeta) {
    alert("Por favor, preencha todos os campos corretamente.")
    return
  }

  const dataMetaObj = new Date(dataMeta)
  if (dataMetaObj <= new Date()) {
    alert("A data da meta deve ser no futuro.")
    return
  }

  metaPeso = {
    id: Date.now(),
    pesoInicial: pesoAtual,
    pesoAtual: pesoAtual,
    pesoMeta: pesoMeta,
    dataInicio: new Date().toISOString(),
    dataMeta: dataMetaObj.toISOString(),
    usuario: usuarioAtual.id,
  }

  localStorage.setItem("metaPeso", JSON.stringify(metaPeso))

  alert("Meta de peso definida com sucesso!")

  // Atualizar interface
  atualizarProgressoMeta()
}

// Funções de atualização de interface
function atualizarTabelaIMC() {
  const tbody = document.querySelector("#imc-tabela tbody")
  tbody.innerHTML = ""

  if (!usuarioAtual) {
    return
  }

  const registrosUsuario = historicoIMC.filter((registro) => registro.usuario === usuarioAtual.id)

  if (registrosUsuario.length === 0) {
    const tr = document.createElement("tr")
    tr.innerHTML = '<td colspan="4" class="text-center">Nenhum registro encontrado</td>'
    tbody.appendChild(tr)
    return
  }

  // Ordenar por data (mais recente primeiro)
  registrosUsuario.sort((a, b) => new Date(b.data) - new Date(a.data))

  registrosUsuario.forEach((registro) => {
    const tr = document.createElement("tr")

    const data = new Date(registro.data)
    const dataFormatada = `${data.getDate().toString().padStart(2, "0")}/${(data.getMonth() + 1).toString().padStart(2, "0")}/${data.getFullYear()}`

    tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${registro.imc}</td>
            <td>${registro.categoria}</td>
            <td>
                <button class="btn btn-outline btn-small excluir-registro" data-id="${registro.id}" data-tipo="imc">Excluir</button>
            </td>
        `

    tbody.appendChild(tr)
  })

  // Adicionar eventos aos botões de excluir
  document.querySelectorAll('.excluir-registro[data-tipo="imc"]').forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = Number.parseInt(this.getAttribute("data-id"))
      excluirRegistro("imc", id)
    })
  })
}

function atualizarTabelaCalorias() {
  const tbody = document.querySelector("#calorias-tabela tbody")
  tbody.innerHTML = ""

  if (!usuarioAtual) {
    return
  }

  const registrosUsuario = historicoCalorias.filter((registro) => registro.usuario === usuarioAtual.id)

  if (registrosUsuario.length === 0) {
    const tr = document.createElement("tr")
    tr.innerHTML = '<td colspan="4" class="text-center">Nenhum registro encontrado</td>'
    tbody.appendChild(tr)
    return
  }

  // Ordenar por data (mais recente primeiro)
  registrosUsuario.sort((a, b) => new Date(b.data) - new Date(a.data))

  registrosUsuario.forEach((registro) => {
    const tr = document.createElement("tr")

    const data = new Date(registro.data)
    const dataFormatada = `${data.getDate().toString().padStart(2, "0")}/${(data.getMonth() + 1).toString().padStart(2, "0")}/${data.getFullYear()}`

    let objetivoTexto = ""
    switch (registro.objetivo) {
      case "perder":
        objetivoTexto = "Perder peso"
        break
      case "manter":
        objetivoTexto = "Manter peso"
        break
      case "ganhar":
        objetivoTexto = "Ganhar peso"
        break
    }

    tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${registro.calorias} kcal</td>
            <td>${objetivoTexto}</td>
            <td>
                <button class="btn btn-outline btn-small excluir-registro" data-id="${registro.id}" data-tipo="calorias">Excluir</button>
            </td>
        `

    tbody.appendChild(tr)
  })

  // Adicionar eventos aos botões de excluir
  document.querySelectorAll('.excluir-registro[data-tipo="calorias"]').forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = Number.parseInt(this.getAttribute("data-id"))
      excluirRegistro("calorias", id)
    })
  })
}

function atualizarProgressoMeta() {
  const metaProgresso = document.getElementById("meta-progresso")
  const progressoInfo = metaProgresso.querySelector(".progresso-info")
  const progressoBarraContainer = metaProgresso.querySelector(".progresso-barra-container")

  if (!metaPeso || !usuarioAtual || metaPeso.usuario !== usuarioAtual.id) {
    progressoInfo.innerHTML = "<p>Sem meta definida</p>"
    progressoBarraContainer.classList.add("hidden")
    return
  }

  progressoInfo.innerHTML = ""
  progressoBarraContainer.classList.remove("hidden")

  // Calcular progresso
  const pesoInicial = metaPeso.pesoInicial
  const pesoAtual = metaPeso.pesoAtual
  const pesoMeta = metaPeso.pesoMeta

  const dataInicio = new Date(metaPeso.dataInicio)
  const dataMeta = new Date(metaPeso.dataMeta)
  const hoje = new Date()

  // Calcular dias restantes
  const diasTotais = Math.ceil((dataMeta - dataInicio) / (1000 * 60 * 60 * 24))
  const diasRestantes = Math.ceil((dataMeta - hoje) / (1000 * 60 * 60 * 24))

  // Calcular porcentagem de progresso
  let progresso = 0
  if (pesoInicial > pesoMeta) {
    // Meta é perder peso
    progresso = ((pesoInicial - pesoAtual) / (pesoInicial - pesoMeta)) * 100
  } else if (pesoInicial < pesoMeta) {
    // Meta é ganhar peso
    progresso = ((pesoAtual - pesoInicial) / (pesoMeta - pesoInicial)) * 100
  } else {
    // Meta é manter peso
    progresso = 100
  }

  // Limitar progresso entre 0 e 100
  progresso = Math.max(0, Math.min(100, progresso))

  // Atualizar interface
  document.querySelector(".progresso-preenchimento").style.width = `${progresso}%`
  document.getElementById("progresso-inicial").textContent = `${pesoInicial} kg`
  document.getElementById("progresso-atual").textContent = `${pesoAtual} kg`
  document.getElementById("progresso-meta").textContent = `${pesoMeta} kg`
  document.getElementById("progresso-dias").textContent = `${diasRestantes} dias restantes`
}

function atualizarInterfaceUsuario() {
  const loginBtn = document.getElementById("login-btn")
  const registerBtn = document.getElementById("register-btn")
  const navMensagens = document.getElementById("nav-mensagens")
  const secaoMensagens = document.getElementById("mensagens")

  if (usuarioAtual) {
    loginBtn.textContent = usuarioAtual.nome.split(" ")[0]
    registerBtn.textContent = "Sair"

    // Mostrar seção de mensagens apenas para profissionais
    if (usuarioAtual.tipo === 'profissional') {
      navMensagens.classList.remove("hidden")
      secaoMensagens.classList.remove("hidden")
    } else {
      navMensagens.classList.add("hidden")
      secaoMensagens.classList.add("hidden")
    }

    // Alterar evento do botão de login para perfil
    loginBtn.removeEventListener("click", abrirModal("login-modal"))
    loginBtn.addEventListener("click", abrirPerfil)

    // Alterar evento do botão de registro para logout
    registerBtn.removeEventListener("click", abrirModal("register-modal"))
    registerBtn.addEventListener("click", fazerLogout)
  } else {
    loginBtn.textContent = "Entrar"
    registerBtn.textContent = "Cadastrar"
    navMensagens.classList.add("hidden")
    secaoMensagens.classList.add("hidden")

    // Restaurar eventos originais
    loginBtn.removeEventListener("click", abrirPerfil)
    loginBtn.addEventListener("click", abrirModal("login-modal"))

    registerBtn.removeEventListener("click", fazerLogout)
    registerBtn.addEventListener("click", abrirModal("register-modal"))
  }
}

// Funções de mensagens
function atualizarTabelaMensagens() {
  const tbody = document.querySelector("#mensagens-tabela tbody")
  tbody.innerHTML = ""

  if (!usuarioAtual || usuarioAtual.tipo !== 'profissional') {
    return
  }

  // Filtrar mensagens
  const filtroTipo = document.getElementById("filtro-tipo").value
  const filtroStatus = document.getElementById("filtro-status").value

  let mensagensFiltradas = mensagens.filter(mensagem => {
    let passaTipo = !filtroTipo || mensagem.tipoProfissional === filtroTipo
    let passaStatus = !filtroStatus || mensagem.status === filtroStatus
    return passaTipo && passaStatus
  })

  if (mensagensFiltradas.length === 0) {
    const tr = document.createElement("tr")
    tr.innerHTML = '<td colspan="7" class="text-center">Nenhuma mensagem encontrada</td>'
    tbody.appendChild(tr)
    return
  }

  // Ordenar por data (mais recente primeiro)
  mensagensFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data))

  mensagensFiltradas.forEach((mensagem) => {
    const tr = document.createElement("tr")

    const data = new Date(mensagem.data)
    const dataFormatada = `${data.getDate().toString().padStart(2, "0")}/${(data.getMonth() + 1).toString().padStart(2, "0")}/${data.getFullYear()}`

    let tipoProfissionalTexto = ""
    switch (mensagem.tipoProfissional) {
      case "nutricionista":
        tipoProfissionalTexto = "Nutricionista"
        break
      case "personal":
        tipoProfissionalTexto = "Personal Trainer"
        break
      case "medico":
        tipoProfissionalTexto = "Médico"
        break
    }

    let statusTexto = ""
    let statusClass = ""
    switch (mensagem.status) {
      case "nova":
        statusTexto = "Nova"
        statusClass = "status-nova"
        break
      case "lida":
        statusTexto = "Lida"
        statusClass = "status-lida"
        break
      case "respondida":
        statusTexto = "Respondida"
        statusClass = "status-respondida"
        break
    }

    const contatoInfo = []
    if (mensagem.email) contatoInfo.push(`Email: ${mensagem.email}`)
    if (mensagem.telefone) contatoInfo.push(`Tel: ${mensagem.telefone}`)

    tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${mensagem.nomeRemetente}</td>
            <td>${tipoProfissionalTexto}</td>
            <td>${mensagem.assunto}</td>
            <td>${contatoInfo.join('<br>')}</td>
            <td><span class="status-badge ${statusClass}">${statusTexto}</span></td>
            <td>
                <button class="btn btn-outline btn-small visualizar-mensagem" data-id="${mensagem.id}">Ver</button>
            </td>
        `

    tbody.appendChild(tr)
  })

  // Adicionar eventos aos botões de visualizar
  document.querySelectorAll('.visualizar-mensagem').forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = Number.parseInt(this.getAttribute("data-id"))
      visualizarMensagem(id)
    })
  })
}

function visualizarMensagem(id) {
  const mensagem = mensagens.find(m => m.id === id)
  if (!mensagem) return

  const detalhes = document.getElementById("mensagem-detalhes")
  
  const data = new Date(mensagem.data)
  const dataFormatada = `${data.getDate().toString().padStart(2, "0")}/${(data.getMonth() + 1).toString().padStart(2, "0")}/${data.getFullYear()} às ${data.getHours().toString().padStart(2, "0")}:${data.getMinutes().toString().padStart(2, "0")}`

  let tipoProfissionalTexto = ""
  switch (mensagem.tipoProfissional) {
    case "nutricionista":
      tipoProfissionalTexto = "Nutricionista"
      break
    case "personal":
      tipoProfissionalTexto = "Personal Trainer"
      break
    case "medico":
      tipoProfissionalTexto = "Médico"
      break
  }

  const contatoInfo = []
  if (mensagem.email) contatoInfo.push(`<strong>Email:</strong> ${mensagem.email}`)
  if (mensagem.telefone) contatoInfo.push(`<strong>Telefone:</strong> ${mensagem.telefone}`)
  if (mensagem.tipoContato) {
    let tipoContatoTexto = ""
    switch (mensagem.tipoContato) {
      case "email":
        tipoContatoTexto = "Email"
        break
      case "telefone":
        tipoContatoTexto = "Telefone"
        break
      case "ambos":
        tipoContatoTexto = "Email e Telefone"
        break
    }
    contatoInfo.push(`<strong>Preferência:</strong> ${tipoContatoTexto}`)
  }

  detalhes.innerHTML = `
    <div class="mensagem-detalhes">
      <h4>Informações da Mensagem</h4>
      <p><strong>Remetente:</strong> ${mensagem.nomeRemetente}</p>
      <p><strong>Data:</strong> ${dataFormatada}</p>
      <p><strong>Tipo de Profissional:</strong> ${tipoProfissionalTexto}</p>
      <p><strong>Assunto:</strong> ${mensagem.assunto}</p>
      <p><strong>Status:</strong> ${mensagem.status}</p>
      
      <h4>Informações de Contato</h4>
      ${contatoInfo.map(info => `<p>${info}</p>`).join('')}
      
      <div class="mensagem-texto">
        <h4>Mensagem:</h4>
        <p>${mensagem.mensagem}</p>
      </div>
    </div>
  `

  // Configurar botões de ação
  const marcarLidaBtn = document.getElementById("marcar-lida-btn")
  const marcarRespondidaBtn = document.getElementById("marcar-respondida-btn")

  marcarLidaBtn.dataset.mensagemId = id
  marcarRespondidaBtn.dataset.mensagemId = id

  if (mensagem.status === 'nova') {
    marcarLidaBtn.style.display = 'inline-block'
  } else {
    marcarLidaBtn.style.display = 'none'
  }

  if (mensagem.status !== 'respondida') {
    marcarRespondidaBtn.style.display = 'inline-block'
  } else {
    marcarRespondidaBtn.style.display = 'none'
  }

  document.getElementById("mensagem-modal").style.display = "block"
}

function marcarComoLida() {
  const id = Number.parseInt(document.getElementById("marcar-lida-btn").dataset.mensagemId)
  const mensagem = mensagens.find(m => m.id === id)
  
  if (mensagem) {
    mensagem.status = 'lida'
    localStorage.setItem("mensagens", JSON.stringify(mensagens))
    
    fecharModais()
    atualizarTabelaMensagens()
    alert("Mensagem marcada como lida!")
  }
}

function marcarComoRespondida() {
  const id = Number.parseInt(document.getElementById("marcar-respondida-btn").dataset.mensagemId)
  const mensagem = mensagens.find(m => m.id === id)
  
  if (mensagem) {
    mensagem.status = 'respondida'
    localStorage.setItem("mensagens", JSON.stringify(mensagens))
    
    fecharModais()
    atualizarTabelaMensagens()
    alert("Mensagem marcada como respondida!")
  }
}

function filtrarMensagens() {
  atualizarTabelaMensagens()
}

// Funções de gráficos (mantidas do código original)
function criarGraficoIMC(ctx) {
  // Implementação simplificada de gráfico usando canvas
  if (!ctx) return

  // Limpar canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  if (!usuarioAtual) {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#666"
    ctx.textAlign = "center"
    ctx.fillText("Faça login para visualizar seu histórico", ctx.canvas.width / 2, ctx.canvas.height / 2)
    return
  }

  const registrosUsuario = historicoIMC.filter((registro) => registro.usuario === usuarioAtual.id)

  if (registrosUsuario.length === 0) {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#666"
    ctx.textAlign = "center"
    ctx.fillText("Nenhum registro encontrado", ctx.canvas.width / 2, ctx.canvas.height / 2)
    return
  }

  // Ordenar por data (mais antigo primeiro)
  registrosUsuario.sort((a, b) => new Date(a.data) - new Date(b.data))

  // Limitar a 10 registros mais recentes
  const registrosLimitados = registrosUsuario.slice(-10)

  // Encontrar valores mínimos e máximos para escala
  const valores = registrosLimitados.map((r) => r.imc)
  const minValor = Math.min(...valores) * 0.9
  const maxValor = Math.max(...valores) * 1.1

  // Configurações do gráfico
  const margemEsquerda = 50
  const margemDireita = 20
  const margemSuperior = 20
  const margemInferior = 50

  const larguraGrafico = ctx.canvas.width - margemEsquerda - margemDireita
  const alturaGrafico = ctx.canvas.height - margemSuperior - margemInferior

  // Desenhar eixos
  ctx.beginPath()
  ctx.strokeStyle = "#333"
  ctx.lineWidth = 2
  ctx.moveTo(margemEsquerda, margemSuperior)
  ctx.lineTo(margemEsquerda, ctx.canvas.height - margemInferior)
  ctx.lineTo(ctx.canvas.width - margemDireita, ctx.canvas.height - margemInferior)
  ctx.stroke()

  // Desenhar linhas de grade horizontais
  ctx.beginPath()
  ctx.strokeStyle = "#ddd"
  ctx.lineWidth = 1

  const numLinhasHorizontais = 5
  for (let i = 0; i <= numLinhasHorizontais; i++) {
    const y = margemSuperior + (i / numLinhasHorizontais) * alturaGrafico
    ctx.moveTo(margemEsquerda, y)
    ctx.lineTo(ctx.canvas.width - margemDireita, y)

    // Adicionar rótulos do eixo Y
    const valor = maxValor - (i / numLinhasHorizontais) * (maxValor - minValor)
    ctx.fillStyle = "#666"
    ctx.font = "12px Arial"
    ctx.textAlign = "right"
    ctx.fillText(valor.toFixed(1), margemEsquerda - 10, y + 4)
  }
  ctx.stroke()

  // Desenhar pontos e linhas
  if (registrosLimitados.length > 0) {
    ctx.beginPath()
    ctx.strokeStyle = "#4CAF50"
    ctx.lineWidth = 2

    registrosLimitados.forEach((registro, index) => {
      const x = margemEsquerda + (index / (registrosLimitados.length - 1 || 1)) * larguraGrafico
      const y = margemSuperior + alturaGrafico - ((registro.imc - minValor) / (maxValor - minValor)) * alturaGrafico

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Desenhar pontos
      ctx.fillStyle = "#4CAF50"
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()

      // Adicionar rótulos do eixo X
      const data = new Date(registro.data)
      const dataFormatada = `${data.getDate()}/${data.getMonth() + 1}`
      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(dataFormatada, x, ctx.canvas.height - margemInferior + 20)
    })

    ctx.stroke()
  }
}

function criarGraficoCalorias(ctx) {
  // Implementação simplificada de gráfico usando canvas
  if (!ctx) return

  // Limpar canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  if (!usuarioAtual) {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#666"
    ctx.textAlign = "center"
    ctx.fillText("Faça login para visualizar seu histórico", ctx.canvas.width / 2, ctx.canvas.height / 2)
    return
  }

  const registrosUsuario = historicoCalorias.filter((registro) => registro.usuario === usuarioAtual.id)

  if (registrosUsuario.length === 0) {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#666"
    ctx.textAlign = "center"
    ctx.fillText("Nenhum registro encontrado", ctx.canvas.width / 2, ctx.canvas.height / 2)
    return
  }

  // Ordenar por data (mais antigo primeiro)
  registrosUsuario.sort((a, b) => new Date(a.data) - new Date(b.data))

  // Limitar a 10 registros mais recentes
  const registrosLimitados = registrosUsuario.slice(-10)

  // Encontrar valores mínimos e máximos para escala
  const valores = registrosLimitados.map((r) => r.calorias)
  const minValor = Math.min(...valores) * 0.9
  const maxValor = Math.max(...valores) * 1.1

  // Configurações do gráfico
  const margemEsquerda = 60
  const margemDireita = 20
  const margemSuperior = 20
  const margemInferior = 50

  const larguraGrafico = ctx.canvas.width - margemEsquerda - margemDireita
  const alturaGrafico = ctx.canvas.height - margemSuperior - margemInferior

  // Desenhar eixos
  ctx.beginPath()
  ctx.strokeStyle = "#333"
  ctx.lineWidth = 2
  ctx.moveTo(margemEsquerda, margemSuperior)
  ctx.lineTo(margemEsquerda, ctx.canvas.height - margemInferior)
  ctx.lineTo(ctx.canvas.width - margemDireita, ctx.canvas.height - margemInferior)
  ctx.stroke()

  // Desenhar linhas de grade horizontais
  ctx.beginPath()
  ctx.strokeStyle = "#ddd"
  ctx.lineWidth = 1

  const numLinhasHorizontais = 5
  for (let i = 0; i <= numLinhasHorizontais; i++) {
    const y = margemSuperior + (i / numLinhasHorizontais) * alturaGrafico
    ctx.moveTo(margemEsquerda, y)
    ctx.lineTo(ctx.canvas.width - margemDireita, y)

    // Adicionar rótulos do eixo Y
    const valor = maxValor - (i / numLinhasHorizontais) * (maxValor - minValor)
    ctx.fillStyle = "#666"
    ctx.font = "12px Arial"
    ctx.textAlign = "right"
    ctx.fillText(Math.round(valor), margemEsquerda - 10, y + 4)
  }
  ctx.stroke()

  // Desenhar barras
  if (registrosLimitados.length > 0) {
    const larguraBarra = (larguraGrafico / registrosLimitados.length) * 0.7

    registrosLimitados.forEach((registro, index) => {
      const x =
        margemEsquerda +
        (index / registrosLimitados.length) * larguraGrafico +
        (larguraGrafico / registrosLimitados.length) * 0.15
      const altura = ((registro.calorias - minValor) / (maxValor - minValor)) * alturaGrafico
      const y = ctx.canvas.height - margemInferior - altura

      // Desenhar barra
      ctx.fillStyle = "#FFC107"
      ctx.fillRect(x, y, larguraBarra, altura)

      // Adicionar rótulos do eixo X
      const data = new Date(registro.data)
      const dataFormatada = `${data.getDate()}/${data.getMonth() + 1}`
      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(dataFormatada, x + larguraBarra / 2, ctx.canvas.height - margemInferior + 20)
    })
  }
}

function atualizarGraficoIMC() {
  const ctx = document.getElementById("imc-grafico").getContext("2d")
  criarGraficoIMC(ctx)
}

function atualizarGraficoCalorias() {
  const ctx = document.getElementById("calorias-grafico").getContext("2d")
  criarGraficoCalorias(ctx)
}

// Funções de autenticação
function fazerLogin(e) {
  e.preventDefault()

  const email = document.getElementById("login-email").value
  const senha = document.getElementById("login-senha").value

  // Verificar se os campos estão preenchidos
  if (!email || !senha) {
    alert("Por favor, preencha todos os campos.")
    return
  }

  // Buscar usuários no localStorage
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")

  // Verificar se o usuário existe
  const usuario = usuarios.find((u) => u.email === email && u.senha === senha)

  if (!usuario) {
    alert("Email ou senha incorretos.")
    return
  }

  // Salvar usuário atual
  usuarioAtual = usuario
  localStorage.setItem("usuarioAtual", JSON.stringify(usuarioAtual))

  // Fechar modal
  fecharModais()

  // Atualizar interface
  atualizarInterface()

  alert(`Bem-vindo(a), ${usuario.nome.split(" ")[0]}!`)
}

function fazerCadastro(e) {
  e.preventDefault()

  const nome = document.getElementById("register-nome").value
  const email = document.getElementById("register-email").value
  const senha = document.getElementById("register-senha").value
  const confirmarSenha = document.getElementById("register-confirmar-senha").value
  const tipo = document.getElementById("register-tipo").value
  const palavraChave1 = document.getElementById("palavra-chave-1").value
  const palavraChave2 = document.getElementById("palavra-chave-2").value
  const palavraChave3 = document.getElementById("palavra-chave-3").value

  // Verificar se os campos estão preenchidos
  if (!nome || !email || !senha || !confirmarSenha || !tipo || !palavraChave1 || !palavraChave2 || !palavraChave3) {
    alert("Por favor, preencha todos os campos.")
    return
  }

  // Verificar se as senhas coincidem
  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem.")
    return
  }

  // Buscar usuários no localStorage
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")

  // Verificar se o email já está em uso
  if (usuarios.some((u) => u.email === email)) {
    alert("Este email já está em uso.")
    return
  }

  // Criar novo usuário
  const novoUsuario = {
    id: Date.now(),
    nome,
    email,
    senha,
    tipo,
    palavrasChave: [palavraChave1.toLowerCase().trim(), palavraChave2.toLowerCase().trim(), palavraChave3.toLowerCase().trim()]
  }

  // Adicionar à lista de usuários
  usuarios.push(novoUsuario)
  localStorage.setItem("usuarios", JSON.stringify(usuarios))

  // Salvar usuário atual
  usuarioAtual = novoUsuario
  localStorage.setItem("usuarioAtual", JSON.stringify(usuarioAtual))

  // Fechar modal
  fecharModais()

  // Atualizar interface
  atualizarInterface()

  alert(`Cadastro realizado com sucesso! Bem-vindo(a), ${nome.split(" ")[0]}!`)
}

function fazerLogout() {
  // Remover usuário atual
  usuarioAtual = null
  localStorage.removeItem("usuarioAtual")

  // Atualizar interface
  atualizarInterface()

  alert("Logout realizado com sucesso!")
}

// Funções de manipulação de registros
function excluirRegistro(tipo, id) {
  if (!confirm("Tem certeza que deseja excluir este registro?")) {
    return
  }

  if (tipo === "imc") {
    historicoIMC = historicoIMC.filter((registro) => registro.id !== id)
    localStorage.setItem("historicoIMC", JSON.stringify(historicoIMC))
    atualizarTabelaIMC()
    atualizarGraficoIMC()
  } else if (tipo === "calorias") {
    historicoCalorias = historicoCalorias.filter((registro) => registro.id !== id)
    localStorage.setItem("historicoCalorias", JSON.stringify(historicoCalorias))
    atualizarTabelaCalorias()
    atualizarGraficoCalorias()
  }

  alert("Registro excluído com sucesso!")
}

// Funções de manipulação de modais
function abrirModal(modalId) {
  return () => {
    document.getElementById(modalId).style.display = "block"
  }
}

function fecharModais() {
  const modais = document.querySelectorAll(".modal")
  modais.forEach((modal) => {
    modal.style.display = "none"
  })
}

function abrirPerfil() {
  alert("Funcionalidade de perfil em desenvolvimento.")
}

// Funções de contato
function enviarMensagem(e) {
  e.preventDefault()

  if (!usuarioAtual) {
    alert("Você precisa estar logado para enviar mensagens.")
    abrirModal("login-modal")()
    return
  }

  const profissional = document.getElementById("profissional").value
  const assunto = document.getElementById("assunto").value
  const mensagem = document.getElementById("mensagem").value
  const tipoContato = document.getElementById("tipo-contato").value
  const email = document.getElementById("contato-email").value
  const telefone = document.getElementById("contato-telefone").value

  if (!profissional || !assunto || !mensagem || !tipoContato || !email) {
    alert("Por favor, preencha todos os campos obrigatórios.")
    return
  }

  if ((tipoContato === "telefone" || tipoContato === "ambos") && !telefone) {
    alert("Por favor, informe seu telefone.")
    return
  }

  // Criar nova mensagem
  const novaMensagem = {
    id: Date.now(),
    data: new Date().toISOString(),
    nomeRemetente: usuarioAtual.nome,
    emailRemetente: usuarioAtual.email,
    tipoProfissional: profissional,
    assunto: assunto,
    mensagem: mensagem,
    tipoContato: tipoContato,
    email: email,
    telefone: telefone,
    status: 'nova'
  }

  mensagens.push(novaMensagem)
  localStorage.setItem("mensagens", JSON.stringify(mensagens))

  alert("Mensagem enviada com sucesso! Um profissional entrará em contato em breve.")

  // Limpar formulário
  document.getElementById("contato-form").reset()

  // Atualizar tabela se for profissional
  if (usuarioAtual.tipo === 'profissional') {
    atualizarTabelaMensagens()
  }
}

// Função para alternar entre tabs
function alternarTab(tabId) {
  // Remover classe active de todas as tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active")
  })

  // Adicionar classe active à tab selecionada
  document.querySelector(`[data-tab="${tabId}"]`).classList.add("active")
  document.getElementById(tabId).classList.add("active")
}

// Fechar modais quando clicar fora deles
window.addEventListener("click", (event) => {
  const modais = document.querySelectorAll(".modal")
  modais.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  })
})
