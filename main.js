const form = document.getElementById('todo-form');
const tarefasLista = document.getElementById('tarefas-lista');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

form.addEventListener('submit', function(e) {
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
    renderTarefas(tarefas);
});

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
                <button onclick="marcarConcluida(${idx})">${tarefa.done ? 'Desfazer' : 'Concluir'}</button>
                <button onclick="excluirTarefa(${idx})">Excluir</button>
            </div>
        `;
        tarefasLista.appendChild(card);
    });
}

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

function filtrarTarefas() {
    const colaborador = document.getElementById('filtro-colaborador').value.toLowerCase();
    const setor = document.getElementById('filtro-setor').value.toLowerCase();
    const categoria = document.getElementById('filtro-categoria').value.toLowerCase();
    const filtradas = tarefas.filter(t =>
        t.responsavel.toLowerCase().includes(colaborador) &&
        t.responsavel.toLowerCase().includes(setor) &&
        t.categoria.toLowerCase().includes(categoria)
    );
    renderTarefas(filtradas);
}

renderTarefas(tarefas);

  function renderTarefas(lista) {
    tarefasLista.innerHTML = '';
    lista.forEach((tarefa, idx) => {
        const card = document.createElement('div');
        card.className = 'card card-tarefa' + (tarefa.done ? ' done' : '');
        card.style.width = "18rem";
        card.style.minWidth = "220px";
        card.style.marginBottom = "0";

        if (tarefa.editando) {
            card.innerHTML = `
                <div class="card-body">
                    <form onsubmit="event.preventDefault(); salvarEdicao(${idx});">
                        <div class="mb-2">
                            <input type="text" id="edit-titulo-${idx}" class="form-control mb-2" value="${tarefa.titulo}" placeholder="Título" required>
                            <input type="text" id="edit-descricao-${idx}" class="form-control mb-2" value="${tarefa.descricao}" placeholder="Descrição" required>
                            <input type="date" id="edit-prazo-${idx}" class="form-control mb-2" value="${tarefa.prazo}" required>
                            <input type="text" id="edit-criador-${idx}" class="form-control mb-2" value="${tarefa.criador}" placeholder="Criador" required>
                            <input type="text" id="edit-responsavel-${idx}" class="form-control mb-2" value="${tarefa.responsavel}" placeholder="Responsável/Setor" required>
                            <input type="text" id="edit-categoria-${idx}" class="form-control mb-2" value="${tarefa.categoria}" placeholder="Categoria" required>
                        </div>
                        <div class="actions d-flex gap-2">
                            <button type="submit" class="btn btn-success btn-salvar">Salvar</button>
                            <button type="button" class="btn btn-secondary btn-cancelar" onclick="cancelarEdicao(${idx})">Cancelar</button>
                        </div>
                    </form>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${tarefa.titulo}</h5>
                    <p class="card-text"><strong>Descrição:</strong> ${tarefa.descricao}</p>
                    <p class="card-text"><strong>Data de criação:</strong> ${tarefa.dataCriacao}</p>
                    <p class="card-text"><strong>Prazo:</strong> ${tarefa.prazo}</p>
                    <p class="card-text"><strong>Criador:</strong> ${tarefa.criador}</p>
                    <p class="card-text"><strong>Responsável/Setor:</strong> ${tarefa.responsavel}</p>
                    <p class="card-text"><strong>Categoria:</strong> ${tarefa.categoria}</p>
                <div class="actions d-flex justify-content-between flex-wrap gap-2 mt-3">
                    <button class="btn btn-success btn-concluir flex-fill" onclick="marcarConcluida(${idx})">${tarefa.done ? 'Desfazer' : 'Concluir'}</button>
                    <button class="btn btn-primary btn-editar flex-fill" onclick="editarTarefa(${idx})">Editar</button>
                    <button class="btn btn-danger btn-excluir flex-fill" onclick="excluirTarefa(${idx})">Excluir</button>
                </div>
            `;
        }
        tarefasLista.appendChild(card);
    });
}
        function editarTarefa(idx) {
            tarefas[idx].editando = true;
            renderTarefas(tarefas);
        }

            function salvarEdicao(idx) {
                tarefas[idx].titulo = document.getElementById(`edit-titulo-${idx}`).value;
                tarefas[idx].descricao = document.getElementById(`edit-descricao-${idx}`).value;
                tarefas[idx].prazo = document.getElementById(`edit-prazo-${idx}`).value;
                tarefas[idx].criador = document.getElementById(`edit-criador-${idx}`).value;
                tarefas[idx].responsavel = document.getElementById(`edit-responsavel-${idx}`).value;
                tarefas[idx].categoria = document.getElementById(`edit-categoria-${idx}`).value;
                tarefas[idx].editando = false;
                localStorage.setItem('tarefas', JSON.stringify(tarefas));
                renderTarefas(tarefas);
        }

            function cancelarEdicao(idx) {
                tarefas[idx].editando = false;
                renderTarefas(tarefas);
        }

        function mostrarToDoList() {
    const inicial = document.getElementById('tela-inicial');
    const todo = document.getElementById('tela-todo');
    inicial.classList.remove('show');
    setTimeout(() => {
        inicial.style.display = 'none';
        todo.style.display = 'block';
        setTimeout(() => {
            todo.classList.add('show');
        }, 10);
    }, 500);
}

        function voltarParaInicial() {
    const inicial = document.getElementById('tela-inicial');
    const todo = document.getElementById('tela-todo');
    todo.classList.remove('show');
    setTimeout(() => {
        todo.style.display = 'none';
        inicial.style.display = 'flex'; // Use flex para centralizar
        setTimeout(() => {
            inicial.classList.add('show');
        }, 10);
    }, 500);
}