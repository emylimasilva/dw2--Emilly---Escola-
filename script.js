// Turmas disponíveis com capacidade e alunos inventados
const turmas = [
  { 
    id: 1, 
    nome: "1º Ano A", 
    capacidade: 15, 
    ocupacao: 0, 
    alunos: [
      { nome: "Ana Silva", ra: "RA1001", inicioDasAulas: "05/09/2025" },
      { nome: "Bruno Souza", ra: "RA1002", inicioDasAulas: "05/09/2025" },
      { nome: "Carlos Lima", ra: "RA1003", inicioDasAulas: "05/09/2025" },
      { nome: "Emilly Silva", ra: "RA1021", inicioDasAulas: "05/09/2025" },
      { nome: "Daniel Santos", ra: "RA1004", inicioDasAulas: "05/09/2025" },
      { nome: "Isabela Oliveira", ra: "RA1005", inicioDasAulas: "05/09/2025" },
      { nome: "Lucas Pereira", ra: "RA1006", inicioDasAulas: "05/09/2025" },
      { nome: "Maria Costa", ra: "RA1007", inicioDasAulas: "05/09/2025" },
      { nome: "Pedro Almeida", ra: "RA1008", inicioDasAulas: "05/09/2025" },
      { nome: "Julia Ferreira", ra: "RA1009", inicioDasAulas: "05/09/2025" },
      { nome: "Thiago Ribeiro", ra: "RA1010", inicioDasAulas: "05/09/2025" },
      { nome: "Laura Mendes", ra: "RA1011", inicioDasAulas: "05/09/2025" },
      { nome: "Rafael Castro", ra: "RA1012", inicioDasAulas: "05/09/2025" },
      { nome: "Sofia Torres", ra: "RA1013", inicioDasAulas: "05/09/2025" },
      { nome: "Matheus Carvalho", ra: "RA1014", inicioDasAulas: "05/09/2025" }
    ] 
  },
  { 
    id: 2, 
    nome: "2º Ano B", 
    capacidade: 22, 
    ocupacao: 0, 
    alunos: [
      { nome: "Eduardo Rocha", ra: "RA2001", inicioDasAulas: "05/09/2025" },
      { nome: "Fernanda Gabriela", ra: "RA2002", inicioDasAulas: "05/09/2025" },
      { nome: "Gustavo Lima", ra: "RA2003", inicioDasAulas: "05/09/2025" },
      { nome: "Beatriz Santos", ra: "RA2004", inicioDasAulas: "05/09/2025" },
      { nome: "Ricardo Oliveira", ra: "RA2005", inicioDasAulas: "05/09/2025" },
      { nome: "Camila Pereira", ra: "RA2006", inicioDasAulas: "05/09/2025" },
      { nome: "Felipe Alves", ra: "RA2007", inicioDasAulas: "05/09/2025" },
      { nome: "Mariana Costa", ra: "RA2008", inicioDasAulas: "05/09/2025" },
      { nome: "Leonardo Silva", ra: "RA2009", inicioDasAulas: "05/09/2025" },
      { nome: "Amanda Ferreira", ra: "RA2010", inicioDasAulas: "05/09/2025" },
      { nome: "João Ribeiro", ra: "RA2011", inicioDasAulas: "05/09/2025" },
      { nome: "Vitória Mendes", ra: "RA2012", inicioDasAulas: "05/09/2025" },
      { nome: "Diego Castro", ra: "RA2013", inicioDasAulas: "05/09/2025" },
      { nome: "Clara Torres", ra: "RA2014", inicioDasAulas: "05/09/2025" },
      { nome: "Arthur Carvalho", ra: "RA2015", inicioDasAulas: "05/09/2025" },
      { nome: "Luiza Rodrigues", ra: "RA2016", inicioDasAulas: "05/09/2025" },
      { nome: "Henrique Martins", ra: "RA2017", inicioDasAulas: "05/09/2025" },
      { nome: "Gabriela Santos", ra: "RA2018", inicioDasAulas: "05/09/2025" },
      { nome: "Lucas Moreira", ra: "RA2019", inicioDasAulas: "05/09/2025" },
      { nome: "Isabella Souza", ra: "RA2020", inicioDasAulas: "05/09/2025" },
      { nome: "Miguel Andrade", ra: "RA2021", inicioDasAulas: "05/09/2025" },
      { nome: "Carolina Lima", ra: "RA2022", inicioDasAulas: "05/09/2025" }
    ] 
  },
  { 
    id: 3, 
    nome: "3º Ano C", 
    capacidade: 35, 
    ocupacao: 0, 
    alunos: [
      { nome: "Gabriel Dias", ra: "RA3001", inicioDasAulas: "05/09/2025" },
      { nome: "Helena Martins", ra: "RA3002", inicioDasAulas: "05/09/2025" }
      // Você pode completar até 35 alunos se quiser
    ] 
  }
];

// Função de login / matrícula
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const nomeAluno = document.getElementById("nomeAluno").value.trim();
  const emailResponsavel = document.getElementById("emailResponsavel").value.trim();
  const nomePais = document.getElementById("nomePais").value.trim();

  if(nomeAluno && emailResponsavel && nomePais){
    // Armazena no localStorage
    localStorage.setItem("nomeAluno", nomeAluno);
    localStorage.setItem("emailResponsavel", emailResponsavel);
    localStorage.setItem("nomePais", nomePais);
    localStorage.removeItem("turmaSelecionada"); // garante matrícula única
    mostrarDashboard();
  }
});

// Mostra dashboard após login
function mostrarDashboard(){
  document.getElementById("login-container").style.display = "none";
  document.getElementById("header").style.display = "block";
  document.getElementById("main").style.display = "block";
  document.getElementById("footer").style.display = "block";

  document.getElementById("nomeAlunoDisplay").innerText = localStorage.getItem("nomeAluno");

  atualizarListaTurmas();
}

// Atualiza lista de turmas disponíveis
function atualizarListaTurmas(){
  const lista = document.getElementById("listaTurmas");
  lista.innerHTML = "";
  turmas.forEach(turma => {
    const li = document.createElement("li");
    li.innerText = `${turma.nome} - ${turma.ocupacao}/${turma.capacidade} vagas`;
    
    li.addEventListener("click", function(){
      // Verifica se já está matriculado em alguma turma
      if(localStorage.getItem("turmaSelecionada")){
        alert("Você já está matriculado(a) em uma turma!");
        mostrarAlunosDaTurma(localStorage.getItem("turmaSelecionada"));
        return;
      }

      if(turma.ocupacao < turma.capacidade){
        turma.ocupacao++;
        localStorage.setItem("turmaSelecionada", turma.id);
        alert(`Matrícula confirmada em ${turma.nome}!`);
        mostrarAlunosDaTurma(turma.id);
        atualizarListaTurmas();
      } else {
        alert("Turma cheia! Escolha outra.");
      }
    });

    lista.appendChild(li);
  });
}

// Mostra lista de alunos da turma selecionada
function mostrarAlunosDaTurma(turmaId){
  const turma = turmas.find(t => t.id == turmaId);
  const main = document.getElementById("main");
  main.innerHTML = `
    <section>
      <h2>Lista de Alunos - ${turma.nome}</h2>
      <ul id="listaAlunos"></ul>
    </section>
  `;
  const ul = document.getElementById("listaAlunos");
  turma.alunos.forEach(aluno => {
    const li = document.createElement("li");
    li.innerText = `${aluno.nome} - RA: ${aluno.ra} - Início: ${aluno.inicioDasAulas}`;
    ul.appendChild(li);
  });
}
// Exemplo de materiais por turma
const materiais = {
  1: ["Caderno", "Lápis", "Borrachas", "Estojo"],
  2: ["Caderno grande", "Canetas coloridas", "Estojo", "Agenda"],
  3: ["Caderno universitário", "Canetas", "Régua", "Mochila"]
};

// Exemplo de materiais detalhados por turma
const materiaisDetalhados = {
  1: ["1 Tesoura", "3 Lápis", "1 Borracha", "1 Caderno pequeno"],
  2: ["2 Cadernos grandes", "5 Canetas coloridas", "1 Estojo", "1 Agenda"],
  3: ["3 Cadernos universitários", "6 Canetas", "1 Régua", "1 Mochila"]
};

function mostrarAlunosDaTurma(turmaId){
  const turma = turmas.find(t => t.id == turmaId);
  const main = document.getElementById("main");
  main.innerHTML = `
    <section>
      <h2>Lista de Alunos - ${turma.nome}</h2>

      <label for="materialSelect">Selecione a lista de material:</label>
      <select id="materialSelect">
        <option value="">--Escolha o material--</option>
        ${materiaisDetalhados[turmaId].map((item, index) => `<option value="${index}">${item.split(' ')[1]}</option>`).join('')}
      </select>

      <ul id="listaAlunos"></ul>

      <h3>Materiais Necessários:</h3>
      <ul id="listaMateriais"></ul>
    </section>
  `;

  // Lista de alunos
  const ulAlunos = document.getElementById("listaAlunos");
  turma.alunos.forEach(aluno => {
    const li = document.createElement("li");
    li.innerText = `${aluno.nome} - RA: ${aluno.ra} - Início: ${aluno.inicioDasAulas}`;
    ulAlunos.appendChild(li);
  });

  // Mostrar materiais ao selecionar
  const select = document.getElementById("materialSelect");
  const ulMateriais = document.getElementById("listaMateriais");
  select.addEventListener("change", () => {
    ulMateriais.innerHTML = ''; // limpa a lista
    if(select.value !== ""){
      materiaisDetalhados[turmaId].forEach(item => {
        const li = document.createElement("li");
        li.innerText = item;
        ulMateriais.appendChild(li);
      });
    }
  });
}s
  // Ação ao mudar o material selecionado
  const select = document.getElementById("materialSelect");
  select.addEventListener("change", () => {
    alert(`Você selecionou: ${select.value}`);
  });


// Botão motivacional
function motivarAluno() {
  const frases = [
    "Estudar hoje é conquistar amanhã! 🚀",
    "Você é capaz de grandes coisas! 🌟",
    "Cada página lida é um passo a mais para o sucesso. 📖",
    "Nunca desista dos seus sonhos! 💡"
  ];
  const frase = frases[Math.floor(Math.random() * frases.length)];
  alert(frase);
}

// Botão Sair / Logout
document.getElementById("logoutBtn").addEventListener("click", function(){
  localStorage.clear();
  location.reload();
});

// Auto-login
window.onload = function(){
  const nomeAluno = localStorage.getItem("nomeAluno");
  const turmaSelecionada = localStorage.getItem("turmaSelecionada");
  if(nomeAluno){
    mostrarDashboard();
    if(turmaSelecionada) mostrarAlunosDaTurma(turmaSelecionada);
  }
}
