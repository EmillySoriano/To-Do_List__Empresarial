# To-Do List Empresarial

Sistema completo de gerenciamento de tarefas empresariais com interface web e API RESTful, desenvolvido com Node.js, Express, MySQL e HTML/CSS/JavaScript.

## Características

- ✅ Interface web responsiva e intuitiva
- 🔄 API RESTful para gerenciamento de tarefas
- 🗄️ Banco de dados MySQL para persistência
- 🌐 Acesso multi-dispositivo na rede local
- ⚡ Configuração automática de porta
- 📝 Formulários com validação em tempo real
- 🎯 Sistema de prioridades e categorias
- 👥 Gerenciamento de responsáveis e criadores

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL Server
- Navegador web moderno

## Instalação e Configuração

### 1. Clone o repositório e instale as dependências

```bash
npm install
```

### 2. Configure o banco de dados

**Opção A: Configuração automática (recomendada)**
```bash
npm run setup-db
```

**Opção B: Configuração manual**

1. Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=gerenciamento_tarefas
```

2. Execute o script SQL:
```bash
mysql -u seu_usuario -p < gerenciamento_tarefas.sql
```

### 3. Inicie o servidor

```bash
npm start
```

O servidor iniciará automaticamente em uma porta disponível (começando pela 3000) e exibirá:
- URL local: `http://localhost:PORTA`
- URL da rede: `http://IP_DA_REDE:PORTA` (para acesso de outros dispositivos)

## Acesso Multi-dispositivo

Para permitir que outros usuários acessem o sistema:

1. Certifique-se de que todos os dispositivos estão na mesma rede
2. Use a URL da rede exibida no console quando o servidor iniciar
3. Configure o firewall se necessário para permitir conexões na porta

## Scripts Disponíveis

- `npm start` - Inicia o servidor de produção
- `npm run setup-db` - Configuração automática do banco de dados
- `npm run setup-simple` - Configuração simplificada do banco
- `npm run dev` - Inicia o servidor (alias para start)

## API Endpoints

### Tarefas

#### GET /tarefas
Retorna todas as tarefas cadastradas.

**Resposta:**
```json
[
  {
    "ID_Tarefa": 1,
    "Titulo": "Reunião de projeto",
    "Descricao": "Discussão sobre funcionalidades",
    "Data_Criacao": "2024-01-15T10:00:00.000Z",
    "Data_Prazo": "2024-01-20T18:00:00.000Z",
    "Criador": "João Silva",
    "Responsavel": "Maria Santos",
    "Prioridade": "Alta",
    "Status": "Em andamento",
    "Categoria": "Desenvolvimento"
  }
]
```

#### POST /tarefas
Cria uma nova tarefa.

**Body:**
```json
{
  "Titulo": "string (obrigatório)",
  "Descricao": "string (opcional)",
  "Data_Prazo": "YYYY-MM-DD (obrigatório)",
  "Criador": "string (obrigatório)",
  "Responsavel": "string (opcional)",
  "Prioridade": "Baixa|Média|Alta (obrigatório)",
  "Status": "string (opcional, padrão: 'Pendente')",
  "Categoria": "string (opcional)"
}
```

**Resposta:** `201 Created`

#### PUT /tarefas/:id
Atualiza uma tarefa existente.

**Body:** Mesma estrutura do POST (todos os campos opcionais)

**Resposta:** `200 OK`

#### DELETE /tarefas/:id
Remove uma tarefa.

**Resposta:** `200 OK`

## Estrutura do Banco de Dados

### Tabela: Tarefa

| Campo | Tipo | Descrição |
|-------|------|-----------|
| ID_Tarefa | INT (PK, AUTO_INCREMENT) | Identificador único |
| Titulo | VARCHAR(255) | Título da tarefa |
| Descricao | TEXT | Descrição detalhada |
| Data_Criacao | DATETIME | Data de criação (auto) |
| Data_Prazo | DATE | Data limite |
| Criador | VARCHAR(100) | Nome do criador |
| Responsavel | VARCHAR(100) | Nome do responsável |
| Prioridade | ENUM | Baixa, Média, Alta |
| Status | VARCHAR(50) | Status atual |
| Categoria | VARCHAR(50) | Categoria da tarefa |

## Interface Web

### Funcionalidades

- **Listagem de Tarefas**: Visualização em tabela com todas as informações
- **Criação**: Formulário completo com validação
- **Edição**: Edição inline com validação
- **Exclusão**: Confirmação antes da remoção
- **Filtros**: Busca e filtros por status/prioridade (futuro)
- **Responsivo**: Adaptável a diferentes tamanhos de tela

### Campos do Formulário

- **Título**: Campo de texto obrigatório
- **Descrição**: Campo de texto opcional
- **Data Prazo**: Seletor de data obrigatório
- **Criador**: Campo de texto obrigatório
- **Responsável**: Campo de texto opcional
- **Prioridade**: Dropdown (Baixa, Média, Alta) obrigatório
- **Status**: Campo de texto opcional
- **Categoria**: Campo de texto opcional

## Solução de Problemas

### Erro de Conexão com o Banco

1. Verifique se o MySQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Execute `npm run setup-db` para recriar as tabelas

### Erro de Porta em Uso

O sistema encontra automaticamente uma porta disponível. Se ainda houver problemas:

```bash
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux
```

### Problemas de Acesso na Rede

1. Verifique se o firewall está bloqueando a porta
2. Confirme que todos os dispositivos estão na mesma rede
3. Use o IP exibido no console, não localhost

## Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Banco de Dados**: MySQL
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Comunicação**: REST API, Fetch API
- **Estilo**: CSS Grid, Flexbox, Media Queries

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Autor

Desenvolvido como projeto de portfolio demonstrando habilidades em desenvolvimento full-stack.

## Roadmap

- [ ] Sistema de autenticação de usuários
- [ ] Filtros avançados e busca
- [ ] Notificações de prazo
- [ ] Dashboard com estatísticas
- [ ] Anexos em tarefas
- [ ] Comentários em tarefas
- [ ] API mobile-friendly
- [ ] Testes automatizados

- **Body**:

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

- **Body**:

```json
{
  "Nome_Categoria": "string",
  "Descricao": "string"
}
```

### Relacionamentos

#### POST /tarefa-categoria

Associa uma categoria a uma tarefa.

- **Body**:

```json
{
  "ID_Tarefa": "number",
  "ID_Categoria": "number"
}
```

#### POST /usuario-acesso

Atribui um tipo de acesso a um usuário.

- **Body**:

```json
{
  "ID_Usuario": "number",
  "ID_Acesso": "number"
}
```

## Status HTTP

- `200`: Sucesso
- `201`: Criado
- `400`: Erro de validação
- `404`: Recurso não encontrado
- `500`: Erro interno do servidor

## Observações

- Todas as requisições que modificam dados (POST, PUT, DELETE) requerem que o corpo da requisição seja em formato JSON.
- As datas devem ser enviadas no formato "YYYY-MM-DD".
- Os IDs são sempre números inteiros.
- As respostas sempre incluem uma mensagem descritiva e, quando apropriado, os dados solicitados.
