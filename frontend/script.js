let alunos = [
  {id:1,nome:"Ana Silva",dataNascimento:"2015-05-10",email:"ana@gmail.com",status:"ativo",turma:"1A"},
  {id:2,nome:"Pedro Souza",dataNascimento:"2014-03-20",email:"pedro@gmail.com",status:"inativo",turma:"2B"}
];

const alunosList = document.getElementById("alunos-list");
const feedback = document.getElementById("feedback");

const modal = document.getElementById("modal");
const alunoForm = document.getElementById("alunoForm");
const modalTitle = document.getElementById("modalTitle");
const turmaSelect = document.getElementById("turma");

const turmaFilter = document.getElementById("turmaFilter");
const statusFilter = document.getElementById("statusFilter");
const textoFilter = document.getElementById("textoFilter");

// Carregar turmas
const turmas = ["1A","2B","3C"];
turmaSelect.innerHTML = turmas.map(t=>`<option value="${t}">${t}</option>`).join("");
turmaFilter.innerHTML += turmas.map(t=>`<option value="${t}">${t}</option>`).join("");

// Mostrar lista
function mostrarAlunosLista() {
  alunosList.innerHTML = "";
  let filtro = alunos.filter(a=>{
    return (!turmaFilter.value || a.turma===turmaFilter.value)
      && (!statusFilter.value || a.status===statusFilter.value)
      && (!textoFilter.value || a.nome.toLowerCase().includes(textoFilter.value.toLowerCase()));
  });
  filtro.forEach(a=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.nome}</td>
      <td>${a.dataNascimento}</td>
      <td>${a.status}</td>
      <td>${a.turma}</td>
      <td>
        <button onclick="editarAluno(${a.id})">📝</button>
        <button onclick="excluirAluno(${a.id})">❌</button>
      </td>
    `;
    alunosList.appendChild(tr);
  });
}

// Novo Aluno
document.getElementById("novoAlunoBtn").onclick = ()=>{
  alunoForm.reset();
  modalTitle.textContent = "Novo Aluno";
  modal.style.display = "flex";
  alunoForm.dataset.editId = "";
}

// Fechar modal
document.getElementById("closeModal").onclick = ()=> modal.style.display="none";

// Salvar (novo ou edita
