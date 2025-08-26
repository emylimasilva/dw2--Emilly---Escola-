// Estado da aplicação
let alunos = [];
let turmas = [];
let filtroAtual = {
    turma: '',
    status: '',
    texto: ''
};
let ordenacao = {
    campo: 'nome',
    direcao: 'asc'
};

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
});

async function initApp() {
    await Promise.all([
        carregarTurmas(),
        carregarAlunos()
    ]);
    
    atualizarEstatisticas();
    preencherSelectTurmas();
    aplicarFiltrosEOrdenacao();
}

// ========== SETUP DE EVENTOS ==========
function setupEventListeners() {
    // Eventos de filtro
    document.getElementById('filtroTurma').addEventListener('change', handleFiltro);
    document.getElementById('filtroStatus').addEventListener('change', handleFiltro);
    document.getElementById('searchAluno').addEventListener('input', debounce(handleFiltro, 300));

    // Eventos de ordenação
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', handleOrdenacao);
    });

    // Eventos de tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabs);
    });

    // Eventos de modais
    document.getElementById('newAlunoBtn').addEventListener('click', () => toggleModal('modalNovoAluno', true));
    document.getElementById('newMatriculaBtn').addEventListener('click', () => toggleModal('modalNovaMatricula', true));
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', e => toggleModal(e.target.closest('.modal').id, false));
    });

    // Eventos de formulários
    document.getElementById('formNovoAluno').addEventListener('submit', handleNovoAluno);
    document.getElementById('formNovaMatricula').addEventListener('submit', handleNovaMatricula);

    // Evento de exportação
    document.getElementById('exportBtn').addEventListener('click', handleExportacao);
}

// ========== HANDLERS ==========
function handleFiltro() {
    filtroAtual = {
        turma: document.getElementById('filtroTurma').value,
        status: document.getElementById('filtroStatus').value,
        texto: document.getElementById('searchAluno').value.toLowerCase()
    };
    aplicarFiltrosEOrdenacao();
}

function handleOrdenacao(e) {
    const campo = e.target.dataset.sort;
    if (ordenacao.campo === campo) {
        ordenacao.direcao = ordenacao.direcao === 'asc' ? 'desc' : 'asc';
    } else {
        ordenacao.campo = campo;
        ordenacao.direcao = 'asc';
    }
    aplicarFiltrosEOrdenacao();
}

function handleTabs(e) {
    const tabId = e.target.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    e.target.classList.add('active');
    document.getElementById(tabId + 'Tab').classList.add('active');
}

async function handleNovoAluno(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const novoAluno = {
        nome: formData.get('nomeAluno'),
        dataNascimento: formData.get('dataNascimento'),
        email: formData.get('emailAluno'),
        status: formData.get('statusAluno'),
        turmaId: formData.get('turmaAluno')
    };

    try {
        await criarAluno(novoAluno);
        mostrarFeedback('Aluno cadastrado com sucesso!', 'sucesso');
        toggleModal('modalNovoAluno', false);
        e.target.reset();
        await carregarAlunos();
        aplicarFiltrosEOrdenacao();
        atualizarEstatisticas();
    } catch (error) {
        mostrarFeedback(error.message, 'erro');
    }
}

async function handleNovaMatricula(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const matricula = {
        alunoId: formData.get('alunoMatricula'),
        turmaId: formData.get('turmaMatricula')
    };

    try {
        await matricularAluno(matricula);
        mostrarFeedback('Matrícula realizada com sucesso!', 'sucesso');
        toggleModal('modalNovaMatricula', false);
        e.target.reset();
        await Promise.all([
            carregarAlunos(),
            carregarTurmas()
        ]);
        aplicarFiltrosEOrdenacao();
        atualizarEstatisticas();
    } catch (error) {
        mostrarFeedback(error.message, 'erro');
    }
}

function handleExportacao() {
    const dados = {
        alunos: alunos.map(({ nome, dataNascimento, email, status, turmaId }) => ({
            nome,
            dataNascimento,
            email,
            status,
            turmaId
        }))
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alunos.json';
    a.click();
    URL.revokeObjectURL(url);
}

// ========== FUNÇÕES DE RENDERIZAÇÃO ==========
function renderizarAlunos(alunosFiltrados) {
    const tbody = document.getElementById('listaAlunos');
    tbody.innerHTML = '';

    alunosFiltrados.forEach(aluno => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${formatarData(aluno.dataNascimento)}</td>
            <td>${aluno.email || '-'}</td>
            <td>${getTurmaNome(aluno.turmaId) || '-'}</td>
            <td><span class="status-badge ${aluno.status}">${aluno.status}</span></td>
            <td>
                <button class="btn btn-secundario btn-sm" onclick="editarAluno(${aluno.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-acento btn-sm" onclick="excluirAluno(${aluno.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderizarTurmas() {
    const container = document.getElementById('listaTurmas');
    container.innerHTML = '';

    turmas.forEach(turma => {
        const div = document.createElement('div');
        div.className = 'card turma-card';
        const ocupacao = (turma.ocupacao / turma.capacidade) * 100;
        div.innerHTML = `
            <h3>${turma.nome}</h3>
            <div class="progresso-container">
                <div class="progresso" style="width: ${ocupacao}%"></div>
            </div>
            <p>${turma.ocupacao}/${turma.capacidade} alunos</p>
        `;
        container.appendChild(div);
    });
}

// ========== FUNÇÕES DE SUPORTE ==========
function aplicarFiltrosEOrdenacao() {
    let alunosFiltrados = alunos.filter(aluno => {
        const matchTurma = !filtroAtual.turma || aluno.turmaId === filtroAtual.turma;
        const matchStatus = !filtroAtual.status || aluno.status === filtroAtual.status;
        const matchTexto = !filtroAtual.texto || 
            aluno.nome.toLowerCase().includes(filtroAtual.texto) || 
            (aluno.email && aluno.email.toLowerCase().includes(filtroAtual.texto));
        return matchTurma && matchStatus && matchTexto;
    });

    alunosFiltrados.sort((a, b) => {
        const fator = ordenacao.direcao === 'asc' ? 1 : -1;
        if (ordenacao.campo === 'nome') {
            return a.nome.localeCompare(b.nome) * fator;
        } else if (ordenacao.campo === 'idade') {
            return (new Date(b.dataNascimento) - new Date(a.dataNascimento)) * fator;
        }
        return 0;
    });

    renderizarAlunos(alunosFiltrados);
}

function atualizarEstatisticas() {
    const total = alunos.length;
    const ativos = alunos.filter(a => a.status === 'ativo').length;
    const ocupacaoTotal = turmas.reduce((acc, t) => acc + (t.ocupacao / t.capacidade), 0) / turmas.length * 100;

    document.getElementById('totalAlunos').textContent = total;
    document.getElementById('alunosAtivos').textContent = ativos;
    document.getElementById('taxaOcupacao').textContent = `${ocupacaoTotal.toFixed(1)}%`;
}

function preencherSelectTurmas() {
    const selects = ['filtroTurma', 'turmaAluno', 'turmaMatricula'];
    selects.forEach(id => {
        const select = document.getElementById(id);
        select.innerHTML = '<option value="">Selecione uma turma</option>';
        turmas.forEach(turma => {
            select.innerHTML += `<option value="${turma.id}">${turma.nome}</option>`;
        });
    });
}

// ========== FUNÇÕES DE UI ==========
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (show) {
        modal.removeAttribute('hidden');
    } else {
        modal.setAttribute('hidden', '');
    }
}

function mostrarFeedback(mensagem, tipo) {
    const toast = document.getElementById('toastFeedback');
    toast.textContent = mensagem;
    toast.className = `toast ${tipo} show`;
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== FUNÇÕES UTILITÁRIAS ==========
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

function getTurmaNome(turmaId) {
    const turma = turmas.find(t => t.id === turmaId);
    return turma ? turma.nome : null;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== MOCK DE API ==========
async function carregarTurmas() {
    // Simula chamada à API
    turmas = [
        { id: 1, nome: "1º Ano A", capacidade: 15, ocupacao: 0 },
        { id: 2, nome: "2º Ano B", capacidade: 22, ocupacao: 0 },
        { id: 3, nome: "3º Ano C", capacidade: 35, ocupacao: 0 }
    ];
    renderizarTurmas();
}

async function carregarAlunos() {
    // Simula chamada à API
    alunos = []; // Aqui você pode adicionar alunos mock
    renderizarAlunos(alunos);
}

async function criarAluno(aluno) {
    // Validações
    if (!validarIdade(aluno.dataNascimento)) {
        throw new Error('O aluno deve ter pelo menos 5 anos.');
    }
    
    // Simula chamada à API
    const novoAluno = {
        id: Date.now(),
        ...aluno
    };
    alunos.push(novoAluno);
    return novoAluno;
}

async function matricularAluno({ alunoId, turmaId }) {
    const turma = turmas.find(t => t.id === turmaId);
    if (turma.ocupacao >= turma.capacidade) {
        throw new Error('Turma está cheia.');
    }
    
    // Atualiza ocupação da turma
    turma.ocupacao++;
    
    // Atualiza status do aluno
    const aluno = alunos.find(a => a.id === alunoId);
    aluno.status = 'ativo';
    aluno.turmaId = turmaId;
}

function validarIdade(dataNascimento) {
    const idade = new Date().getFullYear() - new Date(dataNascimento).getFullYear();
    return idade >= 5;
}
