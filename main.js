const form = document.getElementById('todo-form');
const tarefasLista = document.getElementById('tarefas-lista');
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

// Renderiza tarefas
function renderTarefas(lista) {
    tarefasLista.innerHTML = '';
    lista.forEach((tarefa, idx) => {
        const card = document.createElement('div');
        card.className = 'card-tarefa' + (tarefa.done ? ' done' : '');
        card.innerHTML = `
            <h3>${tarefa.titulo}</h3>
            <p>${tarefa.descricao}</p>
            <p><strong>Criada em:</strong> ${tarefa.dataCriacao}</p>
            <p><strong>Prazo:</strong> ${tarefa.prazo}</p>
            <p><strong>Criador:</strong> ${tarefa.criador}</p>
            <p><strong>Responsável/Setor:</strong> ${tarefa.responsavel}</p>
            <p><strong>Categoria:</strong> ${tarefa.categoria}</p>
            <div class="actions">
                <button class="btn-concluir" onclick="marcarConcluida(${idx})">${tarefa.done ? 'Desfazer' : 'Concluir'}</button>
                <button class="btn-editar" onclick="editarTarefa(${idx})">Editar</button>
                <button class="btn-excluir" onclick="excluirTarefa(${idx})">Excluir</button>
            </div>
        `;
        tarefasLista.appendChild(card);
    });
}

// Funções globais para os botões dos cards
function marcarConcluida(idx) {
    tarefas[idx].done = !tarefas[idx].done;
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderTarefas(tarefas);
}
function excluirTarefa(idx) {
    tarefas.splice(idx, 1);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderTarefas(tarefas);
}
function editarTarefa(idx) {
    const tarefa = tarefas[idx];
    const card = tarefasLista.children[idx];
    card.innerHTML = `
        <input type="text" id="edit-titulo" class="form-control mb-2" value="${tarefa.titulo}">
        <input type="text" id="edit-descricao" class="form-control mb-2" value="${tarefa.descricao}">
        <input type="date" id="edit-prazo" class="form-control mb-2" value="${tarefa.prazo}">
        <input type="text" id="edit-criador" class="form-control mb-2" value="${tarefa.criador}">
        <input type="text" id="edit-responsavel" class="form-control mb-2" value="${tarefa.responsavel}">
        <input type="text" id="edit-categoria" class="form-control mb-2" value="${tarefa.categoria}">
        <div class="actions">
            <button class="btn-salvar" onclick="salvarEdicao(${idx})">Salvar</button>
            <button class="btn-cancelar" onclick="renderTarefas(tarefas)">Cancelar</button>
        </div>
    `;
}
function salvarEdicao(idx) {
    tarefas[idx].titulo = document.getElementById('edit-titulo').value;
    tarefas[idx].descricao = document.getElementById('edit-descricao').value;
    tarefas[idx].prazo = document.getElementById('edit-prazo').value;
    tarefas[idx].criador = document.getElementById('edit-criador').value;
    tarefas[idx].responsavel = document.getElementById('edit-responsavel').value;
    tarefas[idx].categoria = document.getElementById('edit-categoria').value;
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    renderTarefas(tarefas);
}

// Modal de tarefa
document.getElementById('btn-criar-tarefa').onclick = function() {
    document.getElementById('modal-tarefa').style.display = 'flex';
};
document.getElementById('btn-cancelar-form').onclick = function() {
    document.getElementById('modal-tarefa').style.display = 'none';
    form.reset();
};
form.onsubmit = function(e) {
    e.preventDefault();
    const novaTarefa = {
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        dataCriacao: new Date().toLocaleDateString(),
        prazo: document.getElementById('prazo').value,
        criador: document.getElementById('criador').value,
        responsavel: document.getElementById('responsavel').value,
        categoria: document.getElementById('categoria').value,
        done: false
    };
    tarefas.push(novaTarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    form.reset();
    document.getElementById('modal-tarefa').style.display = 'none';
    renderTarefas(tarefas);
};

// Modal de filtro
document.getElementById('btn-filtro-tarefa').onclick = function() {
    document.getElementById('modal-filtro').style.display = 'flex';
};
document.getElementById('btn-cancelar-filtro').onclick = function() {
    document.getElementById('modal-filtro').style.display = 'none';
    document.getElementById('filtro-form').reset();
};
document.getElementById('filtro-form').onsubmit = function(e) {
    e.preventDefault();
    const titulo = document.getElementById('filtro-titulo').value.toLowerCase();
    const responsavel = document.getElementById('filtro-responsavel').value.toLowerCase();
    const categoria = document.getElementById('filtro-categoria').value.toLowerCase();

    const filtradas = tarefas.filter(tarefa =>
        (!titulo || tarefa.titulo.toLowerCase().includes(titulo)) &&
        (!responsavel || tarefa.responsavel.toLowerCase().includes(responsavel)) &&
        (!categoria || tarefa.categoria.toLowerCase().includes(categoria))
    );
    renderTarefas(filtradas);
    document.getElementById('modal-filtro').style.display = 'none';
};

// Inicializa a lista ao carregar
renderTarefas(tarefas);

const btnLimparFiltro = document.getElementById('btn-limpar-filtro');

// Mostrar botão ao aplicar filtro
document.getElementById('filtro-form').onsubmit = function(e) {
    e.preventDefault();
    const titulo = document.getElementById('filtro-titulo').value.toLowerCase();
    const responsavel = document.getElementById('filtro-responsavel').value.toLowerCase();
    const categoria = document.getElementById('filtro-categoria').value.toLowerCase();

    const filtradas = tarefas.filter(tarefa =>
        (!titulo || tarefa.titulo.toLowerCase().includes(titulo)) &&
        (!responsavel || tarefa.responsavel.toLowerCase().includes(responsavel)) &&
        (!categoria || tarefa.categoria.toLowerCase().includes(categoria))
    );
    renderTarefas(filtradas);
    document.getElementById('modal-filtro').style.display = 'none';
    btnLimparFiltro.style.display = 'inline-block';
};

// Botão para limpar filtro e voltar à lista completa
btnLimparFiltro.onclick = function() {
    renderTarefas(tarefas);
    btnLimparFiltro.style.display = 'none';
};