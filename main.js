const form = document.getElementById('todo-form');
const tarefasLista = document.getElementById('tarefas-lista');
const API_URL = 'http://localhost:3000';
let tarefas = [];

// Função para carregar tarefas do backend
async function carregarTarefas() {
    try {
        const response = await fetch(`${API_URL}/tarefas`);
        const data = await response.json();
        tarefas = data.tarefas || [];
        renderTarefas(tarefas);
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        tarefas = [];
        renderTarefas(tarefas);
    }
}

// Renderiza tarefas
function renderTarefas(lista) {
    tarefasLista.innerHTML = '';
    
    lista.forEach((tarefa) => {
        const card = document.createElement('div');
        card.className = 'card-tarefa';        card.innerHTML = `
            <h3>${tarefa.Titulo}</h3>
            <p>${tarefa.Descricao || 'Sem descrição'}</p>
            <p><strong>Criada em:</strong> ${tarefa.Data_Criacao ? new Date(tarefa.Data_Criacao).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Prazo:</strong> ${tarefa.Data_Prazo ? new Date(tarefa.Data_Prazo).toLocaleDateString() : 'Não definido'}</p>
            <p><strong>Criador:</strong> ${tarefa.Criador || 'N/A'}</p>
            <p><strong>Responsável:</strong> ${tarefa.Responsavel || 'Não atribuído'}</p>
            <p><strong>Prioridade:</strong> ${tarefa.Prioridade || 'Não definida'}</p>
            <p><strong>Status:</strong> ${tarefa.Status || 'Pendente'}</p>
            <p><strong>Categoria:</strong> ${tarefa.Categoria || 'Não definida'}</p>
            
            <div class="actions">
                <button class="btn-editar" onclick="editarTarefa(${tarefa.ID_Tarefa})">✏️ Editar</button>
                <button class="btn-excluir" onclick="excluirTarefa(${tarefa.ID_Tarefa})">🗑️ Excluir</button>
            </div>
        `;
        
        tarefasLista.appendChild(card);
    });
}

// Funções globais para os botões dos cards
async function excluirTarefa(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        try {
            const response = await fetch(`${API_URL}/tarefas/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                carregarTarefas(); // Recarrega as tarefas
            } else {
                console.error('Erro ao excluir tarefa');
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    }
}

function editarTarefa(id) {
    const tarefa = tarefas.find(t => t.ID_Tarefa === id);
    if (!tarefa) return;
    
    // Encontra o card da tarefa
    const cards = document.querySelectorAll('.card-tarefa');
    let targetCard = null;
    
    cards.forEach(card => {
        const editBtn = card.querySelector('.btn-editar');
        if (editBtn && editBtn.getAttribute('onclick').includes(id)) {
            targetCard = card;
        }
    });
    
    if (targetCard) {        targetCard.innerHTML = `
            <input type="text" id="edit-titulo" class="form-control mb-2" value="${tarefa.Titulo}">
            <textarea id="edit-descricao" class="form-control mb-2" rows="3">${tarefa.Descricao || ''}</textarea>
            <input type="date" id="edit-prazo" class="form-control mb-2" value="${tarefa.Data_Prazo ? tarefa.Data_Prazo.split('T')[0] : ''}">
            <input type="text" id="edit-responsavel" class="form-control mb-2" value="${tarefa.Responsavel || ''}">
            <select id="edit-prioridade" class="form-control mb-2">
                <option value="Baixa" ${tarefa.Prioridade === 'Baixa' ? 'selected' : ''}>Baixa</option>
                <option value="Média" ${tarefa.Prioridade === 'Média' ? 'selected' : ''}>Média</option>
                <option value="Alta" ${tarefa.Prioridade === 'Alta' ? 'selected' : ''}>Alta</option>
            </select>
            <input type="text" id="edit-categoria" class="form-control mb-2" value="${tarefa.Categoria || ''}">
            <div class="actions">
                <button class="btn-salvar" onclick="salvarEdicao(${id})">Salvar</button>
                <button class="btn-cancelar" onclick="carregarTarefas()">Cancelar</button>
            </div>
        `;
    }
}

async function salvarEdicao(id) {
    try {
        const dadosAtualizados = {
            Titulo: document.getElementById('edit-titulo').value,
            Descricao: document.getElementById('edit-descricao').value,
            Data_Prazo: document.getElementById('edit-prazo').value || null,
            Responsavel: document.getElementById('edit-responsavel').value,
            Prioridade: document.getElementById('edit-prioridade').value,
            Categoria: document.getElementById('edit-categoria').value
        };
        
        const response = await fetch(`${API_URL}/tarefas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)
        });
        
        if (response.ok) {
            carregarTarefas(); // Recarrega as tarefas
        } else {
            console.error('Erro ao salvar edição');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Modal de tarefa
document.getElementById('btn-criar-tarefa').onclick = function() {
    document.getElementById('modal-tarefa').style.display = 'flex';
};

document.getElementById('btn-cancelar-form').onclick = function() {
    document.getElementById('modal-tarefa').style.display = 'none';
    form.reset();
};

// Envio do formulário para criar nova tarefa
form.onsubmit = async function(e) {
    e.preventDefault();
    
    try {
        const novaTarefa = {
            Titulo: document.getElementById('titulo').value,
            Descricao: document.getElementById('descricao').value,
            Data_Prazo: document.getElementById('prazo').value || null,
            Criador: document.getElementById('criador').value,
            Responsavel: document.getElementById('responsavel').value,
            Prioridade: document.getElementById('prioridade').value,
            Categoria: document.getElementById('categoria').value,
            Status: 'Pendente'
        };
        
        const response = await fetch(`${API_URL}/tarefas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaTarefa)
        });
        
        if (response.ok) {
            form.reset();
            document.getElementById('modal-tarefa').style.display = 'none';
            carregarTarefas(); // Recarrega as tarefas
        } else {
            console.error('Erro ao criar tarefa');
            alert('Erro ao criar tarefa. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão. Verifique se o servidor está rodando.');
    }
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
    const prioridade = document.getElementById('filtro-prioridade').value;

    const filtradas = tarefas.filter(tarefa =>
        (!titulo || tarefa.Titulo.toLowerCase().includes(titulo)) &&
        (!responsavel || (tarefa.Responsavel && tarefa.Responsavel.toLowerCase().includes(responsavel))) &&
        (!categoria || (tarefa.Categoria && tarefa.Categoria.toLowerCase().includes(categoria))) &&
        (!prioridade || tarefa.Prioridade === prioridade)
    );
    
    renderTarefas(filtradas);
    document.getElementById('modal-filtro').style.display = 'none';
    document.getElementById('btn-limpar-filtro').style.display = 'inline-block';
};

// Botão para limpar filtro
const btnLimparFiltro = document.getElementById('btn-limpar-filtro');
btnLimparFiltro.onclick = function() {
    renderTarefas(tarefas);
    btnLimparFiltro.style.display = 'none';
};

// Inicializa carregando as tarefas do backend
carregarTarefas();