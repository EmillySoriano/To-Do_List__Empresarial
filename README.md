# 📚 TriadZEG - To-Do List Empresarial
O TriadZEG é uma aplicação web voltada para a gestão de tarefas no ambiente empresarial, projetada para otimizar a organização e a colaboração entre equipes.

## 🎯 Objetivo do Projeto
O TriadZEG tem como objetivo facilitar o planejamento e a execução de tarefas em equipe, promovendo maior produtividade e organização no ambiente corporativo. Com uma interface intuitiva, a aplicação permite que equipes gerenciem projetos, acompanhem o progresso e colaborem de forma eficiente.

## ⚙️ Funcionalidades
* Gestão de Tarefas: Crie, edite e atribua tarefas com prazos, prioridades e responsáveis.
* Colaboração em Equipe: Permita que múltiplos usuários acessem e atualizem listas de tarefas em tempo real.

## 🔧 Tecnologias Utilizadas
* Frontend: React.js, TypeScript, CSS
* Backend: Node.js, Express
* Banco de Dados: MySQL

--

# API To-Do List Empresarial

API RESTful para gerenciamento de tarefas empresariais, desenvolvida com Node.js, Express e MySQL.

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Configure o arquivo `.env` com suas credenciais do MySQL:

```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=gerenciamento_tarefas
```

3. Execute o script SQL `gerenciamento_tarefas.sql` para criar o banco de dados e as tabelas.

4. Inicie o servidor:

```bash
npm start
```

## Endpoints

### Tarefas

#### POST /tarefas

Cria uma nova tarefa.

* **Body**:

```json
{
  "Titulo": "string",
  "Descricao": "string",
  "Data_Prazo": "YYYY-MM-DD",
  "ID_Usuario_Criador": "number",
  "ID_Usuario_Responsavel": "number (opcional)",
  "ID_Equipe": "number (opcional)"
}
```

* **Resposta**: `201 Created`

```json
{
  "message": "Tarefa criada",
  "ID_Tarefa": "number"
}
```

#### GET /tarefas

Lista todas as tarefas com informações relacionadas.

* **Resposta**: `200 OK`

```json
{
  "message": "Tarefas recuperadas",
  "data": [
    {
      "ID_Tarefa": "number",
      "Titulo": "string",
      "Nome_Criador": "string",
      "Nome_Responsavel": "string",
      "Nome_Equipe": "string"
    }
  ]
}
```

#### GET /tarefas/:id

Retorna os detalhes de uma tarefa específica.

* **Resposta**: `200 OK`

```json
{
  "message": "Tarefa recuperada",
  "data": {
    "ID_Tarefa": "number",
    "Titulo": "string",
    "categorias": [
      {
        "ID_Categoria": "number",
        "Nome_Categoria": "string"
      }
    ]
  }
}
```

### Usuários

#### POST /usuarios

Cria um novo usuário.

* **Body**:

```json
{
  "Nome_Primeiro": "string",
  "Nome_Sobrenome": "string",
  "Cargo": "string",
  "Data_Nascimento": "YYYY-MM-DD",
  "Departamento_ID": "number"
}
```

#### GET /usuarios

Lista todos os usuários com seus departamentos.

#### GET /usuarios/:id

Retorna os detalhes de um usuário específico, incluindo suas tarefas e acessos.

### Departamentos

#### POST /departamentos

Cria um novo departamento.

* **Body**:

```json
{
  "Nome_Departamento": "string",
  "Descricao": "string"
}
```

#### GET /departamentos

Lista todos os departamentos.

### Equipes

#### POST /equipes

Cria uma nova equipe.

* **Body**:

```json
{
  "Nome_Equipe": "string",
  "Descricao": "string"
}
```

#### GET /equipes

Lista todas as equipes.

### Categorias

#### POST /categorias

Cria uma nova categoria.

* **Body**:

```json
{
  "Nome_Categoria": "string",
  "Descricao": "string"
}
```

### Relacionamentos

#### POST /tarefa-categoria

Associa uma categoria a uma tarefa.

* **Body**:

```json
{
  "ID_Tarefa": "number",
  "ID_Categoria": "number"
}
```

#### POST /usuario-acesso

Atribui um tipo de acesso a um usuário.

* **Body**:

```json
{
  "ID_Usuario": "number",
  "ID_Acesso": "number"
}
```

## Status HTTP

* `200`: Sucesso
* `201`: Criado
* `400`: Erro de validação
* `404`: Recurso não encontrado
* `500`: Erro interno do servidor

## Observações

* Todas as requisições que modificam dados (POST, PUT, DELETE) requerem que o corpo da requisição seja em formato JSON.
* As datas devem ser enviadas no formato "YYYY-MM-DD".
* Os IDs são sempre números inteiros.
* As respostas sempre incluem uma mensagem descritiva e, quando apropriado, os dados solicitados.
