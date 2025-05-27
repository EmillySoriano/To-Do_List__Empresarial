const form = document.getElementById('todo-form');
const tarefasLista = document.getElementById('tarefas-lista');
// URL dinâmica baseada na localização atual
const API_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
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
    
    if (lista.length === 0) {
        tarefasLista.innerHTML = '<p class="text-center">Nenhuma tarefa encontrada.</p>';
        return;
    }
    
    lista.forEach((tarefa) => {
        const card = document.createElement('div');
        card.className = 'card-tarefa';
        
        // Formatação de datas
        const dataCriacao = tarefa.Data_Criacao ? new Date(tarefa.Data_Criacao).toLocaleDateString('pt-BR') : 'N/A';
        const dataPrazo = tarefa.Data_Prazo ? new Date(tarefa.Data_Prazo).toLocaleDateString('pt-BR') : 'Não definido';
        
        // Definir cor baseada na prioridade
        let corPrioridade = '';
        switch(tarefa.Prioridade) {
            case 'Alta': corPrioridade = 'text-danger'; break;
            case 'Média': corPrioridade = 'text-warning'; break;
            case 'Baixa': corPrioridade = 'text-success'; break;
            default: corPrioridade = 'text-muted';
        }        // Verificar se a tarefa está concluída
        const isConcluida = tarefa.Status === 'Concluída' || tarefa.Status === 'Concluida';
        const classeCard = isConcluida ? 'card-tarefa concluida' : 'card-tarefa';
        const statusIcon = isConcluida ? '✅' : '';
        
        card.className = classeCard;
        card.setAttribute('data-status', tarefa.Status || 'Pendente');
          card.innerHTML = `
            <h3>${statusIcon} ${tarefa.Titulo}</h3>
            <p><strong>Descrição:</strong> ${tarefa.Descricao || 'Sem descrição'}</p>
            <p><strong>Criada em:</strong> ${dataCriacao}</p>
            <p><strong>Prazo:</strong> ${dataPrazo}</p>
            <p><strong>Responsável:</strong> ${tarefa.Responsavel || 'Não atribuído'}</p>
            <p><strong>Prioridade:</strong> <span class="${corPrioridade}">${tarefa.Prioridade || 'Não definida'}</span></p>
            <p><strong>Categoria:</strong> ${tarefa.Categoria || 'Não definida'}</p>
            
            <div class="status-control">
                <label><strong>Status:</strong></label>
                <select class="status-dropdown" onchange="alterarStatus(${tarefa.ID_Tarefa}, this.value)">
                    <option value="Pendente" ${tarefa.Status === 'Pendente' ? 'selected' : ''}>📋 Pendente</option>
                    <option value="Em andamento" ${tarefa.Status === 'Em andamento' ? 'selected' : ''}>⚡ Em andamento</option>
                    <option value="Concluída" ${tarefa.Status === 'Concluída' || tarefa.Status === 'Concluida' ? 'selected' : ''}>✅ Concluída</option>
                    <option value="Cancelada" ${tarefa.Status === 'Cancelada' ? 'selected' : ''}>❌ Cancelada</option>
                </select>
            </div>
            
            <div class="actions">
                ${isConcluida ? `<button class="btn-desfazer" onclick="desfazerConclusao(${tarefa.ID_Tarefa})">↩️ Desfazer</button>` : ''}
                <button class="btn-editar" onclick="editarTarefa(${tarefa.ID_Tarefa})" ${isConcluida ? 'disabled' : ''}>✏️ Editar</button>
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
                alert('Tarefa excluída com sucesso!');
            } else {
                const error = await response.json();
                alert('Erro ao excluir tarefa: ' + error.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro de conexão. Verifique se o servidor está rodando.');
        }
    }
}

// Função para concluir tarefa
async function concluirTarefa(id) {
    if (confirm('Marcar esta tarefa como concluída?')) {
        try {
            const response = await fetch(`${API_URL}/tarefas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Status: 'Concluída'
                })
            });
            
            if (response.ok) {
                carregarTarefas(); // Recarrega as tarefas
                alert('Tarefa marcada como concluída!');
            } else {
                const error = await response.json();
                alert('Erro ao concluir tarefa: ' + error.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro de conexão. Verifique se o servidor está rodando.');
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
      if (targetCard) {
        const dataPrazo = tarefa.Data_Prazo ? tarefa.Data_Prazo.split('T')[0] : '';
        
        targetCard.innerHTML = `
            <div class="mb-3">
                <label class="form-label">Título:</label>
                <input type="text" id="edit-titulo" class="form-control" value="${tarefa.Titulo}">
            </div>
            <div class="mb-3">
                <label class="form-label">Descrição:</label>
                <textarea id="edit-descricao" class="form-control" rows="3">${tarefa.Descricao || ''}</textarea>
            </div>
            <div class="mb-3">
                <label class="form-label">Prazo:</label>
                <input type="date" id="edit-prazo" class="form-control" value="${dataPrazo}">
            </div>
            <div class="mb-3">
                <label class="form-label">Responsável:</label>
                <input type="text" id="edit-responsavel" class="form-control" value="${tarefa.Responsavel || ''}">
            </div>
            <div class="mb-3">
                <label class="form-label">Prioridade:</label>
                <select id="edit-prioridade" class="form-control">
                    <option value="Baixa" ${tarefa.Prioridade === 'Baixa' ? 'selected' : ''}>Baixa</option>
                    <option value="Média" ${tarefa.Prioridade === 'Média' ? 'selected' : ''}>Média</option>
                    <option value="Alta" ${tarefa.Prioridade === 'Alta' ? 'selected' : ''}>Alta</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Categoria:</label>
                <input type="text" id="edit-categoria" class="form-control" value="${tarefa.Categoria || ''}">
            </div>            <div class="mb-3">
                <label class="form-label">Status:</label>
                <select id="edit-status" class="form-control">
                    <option value="Pendente" ${tarefa.Status === 'Pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="Em andamento" ${tarefa.Status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
                    <option value="Concluída" ${tarefa.Status === 'Concluída' ? 'selected' : ''}>Concluída</option>
                    <option value="Cancelada" ${tarefa.Status === 'Cancelada' ? 'selected' : ''}>Cancelada</option>
                </select>
            </div>
            <div class="actions">
                <button class="btn-salvar" onclick="salvarEdicao(${id})">💾 Salvar</button>
                <button class="btn-cancelar" onclick="carregarTarefas()">❌ Cancelar</button>
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
            Categoria: document.getElementById('edit-categoria').value,
            Status: document.getElementById('edit-status') ? document.getElementById('edit-status').value : 'Pendente'
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
            alert('Tarefa atualizada com sucesso!');
        } else {
            const error = await response.json();
            alert('Erro ao salvar edição: ' + error.message);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão. Verifique se o servidor está rodando.');
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
            Titulo: document.getElementById('titulo').value.trim(),
            Descricao: document.getElementById('descricao').value.trim(),
            Data_Prazo: document.getElementById('prazo').value || null,
            Responsavel: document.getElementById('responsavel').value.trim(),
            Prioridade: document.getElementById('prioridade').value,
            Status: document.getElementById('status') ? document.getElementById('status').value.trim() : 'Pendente',
            Categoria: document.getElementById('categoria').value.trim(),
            Status: 'Pendente'
        };
          // Validações básicas
        if (!novaTarefa.Titulo) {
            alert('Título é obrigatório!');
            return;
        }
        if (!novaTarefa.Responsavel) {
            alert('Responsável é obrigatório!');
            return;
        }
        if (!novaTarefa.Prioridade) {
            alert('Prioridade é obrigatória!');
            return;
        }
        if (!novaTarefa.Categoria) {
            alert('Categoria é obrigatória!');
            return;
        }
        
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
            alert('Tarefa criada com sucesso!');
        } else {
            const error = await response.json();
            alert('Erro ao criar tarefa: ' + error.message);
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

// Função para alterar status via dropdown
async function alterarStatus(id, novoStatus) {
    try {
        const response = await fetch(`${API_URL}/tarefas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Status: novoStatus
            })
        });
        
        if (response.ok) {
            carregarTarefas(); // Recarrega as tarefas
            // Alert opcional para feedback
            // alert(`Status alterado para: ${novoStatus}`);
        } else {
            const error = await response.json();
            alert('Erro ao alterar status: ' + error.message);
            carregarTarefas(); // Recarrega para voltar ao estado anterior
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão. Verifique se o servidor está rodando.');
        carregarTarefas(); // Recarrega para voltar ao estado anterior
    }
}

// Função para desfazer conclusão (volta para "Em andamento")
async function desfazerConclusao(id) {
    if (confirm('Desfazer conclusão desta tarefa?')) {
        try {
            const response = await fetch(`${API_URL}/tarefas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Status: 'Em andamento'
                })
            });
            
            if (response.ok) {
                carregarTarefas(); // Recarrega as tarefas
                alert('Conclusão desfeita! Tarefa voltou para "Em andamento".');
            } else {
                const error = await response.json();
                alert('Erro ao desfazer conclusão: ' + error.message);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro de conexão. Verifique se o servidor está rodando.');
        }
    }
}