// URL base da API
const API_URL = 'http://localhost:8000';

// Elementos DOM
const tabelaAlunos = document.getElementById('tabela-alunos').querySelector('tbody');
const filtroTurma = document.getElementById('filtro-turma');
const filtroStatus = document.getElementById('filtro-status');
const buscaAluno = document.getElementById('busca-aluno');
const totalAlunos = document.getElementById('total-alunos');
const totalAtivos = document.getElementById('total-ativos');
const paginacao = document.getElementById('paginacao');
const ordenarSelect = document.getElementById('ordenar');
const btnExportarCSV = document.getElementById('exportar-csv');
const btnExportarJSON = document.getElementById('exportar-json');

// Modais
const modalNovoAluno = document.getElementById('modal-novo-aluno');
const btnNovoAluno = document.getElementById('btn-novo-aluno');
const fecharModalAluno = document.getElementById('fechar-modal-aluno');
const formNovoAluno = document.getElementById('form-novo-aluno');

const modalNovaMatricula = document.getElementById('modal-nova-matricula');
const btnNovaMatricula = document.getElementById('btn-nova-matricula');
const fecharModalMatricula = document.getElementById('fechar-modal-matricula');
const formNovaMatricula = document.getElementById('form-nova-matricula');

// Dados globais
let alunos = [];
let turmas = [];
let paginaAtual = 1;
const porPagina = 10;
let criterioOrdenacao = localStorage.getItem('criterioOrdenacao') || 'nome';

// Feedbacks acessíveis
const feedbackDiv = document.createElement('div');
feedbackDiv.setAttribute('aria-live', 'polite');
feedbackDiv.setAttribute('style', 'position:fixed;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;');
document.body.appendChild(feedbackDiv);

function feedbackAcessivel(msg) {
  feedbackDiv.textContent = msg;
}

// Funções utilitárias
function abrirModal(modal) {
	modal.hidden = false;
	setTimeout(() => {
		const campo = modal.querySelector('input, select, button');
		if (campo) campo.focus();
	}, 100);
}
function fecharModal(modal) {
	modal.hidden = true;
}

// Fetch turmas e alunos
async function carregarTurmas() {
	const resp = await fetch(`${API_URL}/turmas`);
	turmas = await resp.json();
	filtroTurma.innerHTML = '<option value="">Todas</option>' + turmas.map(t => `<option value="${t.id}">${t.nome}</option>`).join('');
	// Preencher selects dos modais
	document.getElementById('turma_id').innerHTML = '<option value="">Nenhuma</option>' + turmas.map(t => `<option value="${t.id}">${t.nome}</option>`).join('');
	document.getElementById('turma_id_matricula').innerHTML = turmas.map(t => `<option value="${t.id}">${t.nome}</option>`).join('');
}

async function carregarAlunos() {
	const resp = await fetch(`${API_URL}/alunos`);
	alunos = await resp.json();
	atualizarTabela();
	atualizarIndicadores();
}

function atualizarIndicadores() {
	totalAlunos.textContent = alunos.length;
	totalAtivos.textContent = alunos.filter(a => a.status === 'ativo').length;
}

function ordenarAlunos(lista) {
	if (criterioOrdenacao === 'nome') {
		return lista.sort((a, b) => a.nome.localeCompare(b.nome));
	} else if (criterioOrdenacao === 'data_nascimento') {
		return lista.sort((a, b) => a.data_nascimento.localeCompare(b.data_nascimento));
	}
	return lista;
}

function filtrarAlunos() {
	let filtrados = [...alunos];
	const turma = filtroTurma.value;
	const status = filtroStatus.value;
	const busca = buscaAluno.value.toLowerCase();
	if (turma) filtrados = filtrados.filter(a => a.turma_id == turma);
	if (status) filtrados = filtrados.filter(a => a.status === status);
	if (busca) filtrados = filtrados.filter(a => a.nome.toLowerCase().includes(busca));
	return ordenarAlunos(filtrados);
}

function atualizarTabela() {
	const filtrados = filtrarAlunos();
	const inicio = (paginaAtual - 1) * porPagina;
	const paginados = filtrados.slice(inicio, inicio + porPagina);
	tabelaAlunos.innerHTML = paginados.map(a => `
		<tr>
			<td>${a.nome}</td>
			<td>${a.data_nascimento}</td>
			<td>${a.email || ''}</td>
			<td>${a.status}</td>
			<td>${turmas.find(t => t.id === a.turma_id)?.nome || ''}</td>
			<td>
				<button aria-label="Editar" onclick="editarAluno(${a.id})">✏️</button>
				<button aria-label="Excluir" onclick="excluirAluno(${a.id})">🗑️</button>
			</td>
		</tr>
	`).join('');
	atualizarPaginacao(filtrados.length);
}

function atualizarPaginacao(total) {
	const paginas = Math.ceil(total / porPagina);
	paginacao.innerHTML = '';
	for (let i = 1; i <= paginas; i++) {
		const btn = document.createElement('button');
		btn.textContent = i;
		btn.className = (i === paginaAtual) ? 'active' : '';
		btn.onclick = () => { paginaAtual = i; atualizarTabela(); };
		paginacao.appendChild(btn);
	}
}

// Exportar funções
function exportarCSV() {
  const lista = filtrarAlunos();
  if (!lista.length) return alert('Nenhum aluno para exportar!');
  const header = ['Nome','Data de Nascimento','Email','Status','Turma'];
  const rows = lista.map(a => [
    a.nome,
    a.data_nascimento,
    a.email || '',
    a.status,
    turmas.find(t => t.id === a.turma_id)?.nome || ''
  ]);
  let csv = header.join(',') + '\n';
  csv += rows.map(r => r.map(v => '"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'alunos.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportarJSON() {
  const lista = filtrarAlunos();
  if (!lista.length) return alert('Nenhum aluno para exportar!');
  const json = JSON.stringify(lista, null, 2);
  const blob = new Blob([json], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'alunos.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

if (btnExportarCSV) btnExportarCSV.addEventListener('click', exportarCSV);
if (btnExportarJSON) btnExportarJSON.addEventListener('click', exportarJSON);

// Eventos de filtro e busca
filtroTurma.addEventListener('change', () => { paginaAtual = 1; atualizarTabela(); });
filtroStatus.addEventListener('change', () => { paginaAtual = 1; atualizarTabela(); });
buscaAluno.addEventListener('input', () => { paginaAtual = 1; atualizarTabela(); });
if (ordenarSelect) ordenarSelect.value = criterioOrdenacao;
ordenarSelect.addEventListener('change', () => {
	criterioOrdenacao = ordenarSelect.value;
	localStorage.setItem('criterioOrdenacao', criterioOrdenacao);
	atualizarTabela();
});

// Modais
btnNovoAluno.addEventListener('click', () => abrirModal(modalNovoAluno));
fecharModalAluno.addEventListener('click', () => fecharModal(modalNovoAluno));
btnNovaMatricula.addEventListener('click', () => abrirModal(modalNovaMatricula));
fecharModalMatricula.addEventListener('click', () => fecharModal(modalNovaMatricula));

// Fechar modal com ESC
window.addEventListener('keydown', e => {
	if (e.key === 'Escape') {
		if (!modalNovoAluno.hidden) fecharModal(modalNovoAluno);
		if (!modalNovaMatricula.hidden) fecharModal(modalNovaMatricula);
	}
});


// Cadastro de novo aluno

formNovoAluno.addEventListener('submit', async function (e) {
  e.preventDefault();
  const form = e.target;
  const id = form.aluno_id.value;
  const nome = form.nome.value.trim();
  const data_nascimento = form.data_nascimento.value;
  const email = form.email.value.trim();
  const status = form.status.value;
  const turma_id = form.turma_id.value || null;

  // Validação básica
  if (nome.length < 3 || nome.length > 80) {
    alert('Nome deve ter entre 3 e 80 caracteres.');
    return;
  }
  if (!data_nascimento) {
    alert('Data de nascimento obrigatória.');
    return;
  }
  // Validação de faixa etária mínima (5 anos)
  const hoje = new Date();
  const nascimento = new Date(data_nascimento);
  const idade = hoje.getFullYear() - nascimento.getFullYear() - (hoje.getMonth() < nascimento.getMonth() || (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate()) ? 1 : 0);
  if (idade < 5) {
    alert('O aluno deve ter pelo menos 5 anos de idade.');
    return;
  }
  // Validação de email (se preenchido)
  if (email && !email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    alert('Digite um email válido.');
    return;
  }
  // Validação de status
  if (status !== 'ativo' && status !== 'inativo') {
    alert('Status inválido.');
    return;
  }

  const alunoData = {
    nome,
    data_nascimento,
    email: email || null,
    status,
    turma_id: turma_id ? Number(turma_id) : null
  };

  try {
    let resp;
    if (id) {
      // Edição
      resp = await fetch(`${API_URL}/alunos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alunoData)
      });
    } else {
      // Cadastro
      resp = await fetch(`${API_URL}/alunos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alunoData)
      });
    }
    if (!resp.ok) {
      const erro = await resp.json();
      alert('Erro ao salvar: ' + (erro.detail || resp.status));
      return;
    }
    fecharModal(modalNovoAluno);
    form.reset();
    document.getElementById('titulo-modal-aluno').textContent = 'Novo Aluno';
    await carregarAlunos();
    feedbackAcessivel(id ? 'Aluno editado com sucesso!' : 'Aluno cadastrado com sucesso!');
    alert(id ? 'Aluno editado com sucesso!' : 'Aluno cadastrado com sucesso!');
  } catch (err) {
    alert('Erro ao salvar aluno.');
  }
});

// Matrícula de aluno
formNovaMatricula.addEventListener('submit', async function (e) {
  e.preventDefault();
  const aluno_id = formNovaMatricula.aluno_id.value;
  const turma_id = formNovaMatricula.turma_id_matricula.value;
  if (!aluno_id || !turma_id) {
    alert('Selecione o aluno e a turma.');
    return;
  }
  try {
    const resp = await fetch(`${API_URL}/matriculas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aluno_id: Number(aluno_id), turma_id: Number(turma_id) })
    });
    if (!resp.ok) {
      const erro = await resp.json();
      alert('Erro ao matricular: ' + (erro.detail || resp.status));
      return;
    }
    fecharModal(modalNovaMatricula);
    await carregarAlunos();
    alert('Matrícula realizada com sucesso!');
  } catch (err) {
    alert('Erro ao realizar matrícula.');
  }
});

// Preencher select de alunos no modal de matrícula
btnNovaMatricula.addEventListener('click', () => {
  // Só alunos inativos ou sem turma
  const alunosDisponiveis = alunos.filter(a => a.status !== 'ativo' || !a.turma_id);
  const selectAluno = document.getElementById('aluno_id');
  selectAluno.innerHTML = alunosDisponiveis.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
});

// Inicialização
carregarTurmas().then(carregarAlunos);

// Funções de edição e exclusão (placeholders)
window.editarAluno = function(id) {
  const aluno = alunos.find(a => a.id === id);
  if (!aluno) return alert('Aluno não encontrado!');
  document.getElementById('aluno_id').value = aluno.id;
  document.getElementById('nome').value = aluno.nome;
  document.getElementById('data_nascimento').value = aluno.data_nascimento;
  document.getElementById('email').value = aluno.email || '';
  document.getElementById('status').value = aluno.status;
  document.getElementById('turma_id').value = aluno.turma_id || '';
  document.getElementById('titulo-modal-aluno').textContent = 'Editar Aluno';
  abrirModal(modalNovoAluno);
}
window.excluirAluno = async function(id) {
  if (!confirm('Tem certeza que deseja excluir este aluno?')) return;
  try {
    const resp = await fetch(`${API_URL}/alunos/${id}`, { method: 'DELETE' });
    if (!resp.ok) {
      const erro = await resp.json();
      alert('Erro ao excluir: ' + (erro.detail || resp.status));
      return;
    }
    await carregarAlunos();
    alert('Aluno excluído com sucesso!');
  } catch (err) {
    alert('Erro ao excluir aluno.');
  }
}

// Tela de login
const telaLogin = document.getElementById('tela-login');
const conteudoApp = document.getElementById('conteudo-app');
const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('login-nome').value.trim();
  const email = document.getElementById('login-email').value.trim();
  if (nome.length < 3) {
    alert('Nome deve ter pelo menos 3 caracteres.');
    return;
  }
  if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    alert('Digite um email válido.');
    return;
  }
  telaLogin.style.display = 'none';
  conteudoApp.style.display = 'block';
});
