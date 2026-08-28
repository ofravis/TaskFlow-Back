console.log('TaskFlow API — pronto para o Express!');

const express = require('express');
const app = express();
const PORTA = 3000;

const tarefas = [
    { id: 1, texto: 'Estudar Node', prioridade: 'alta', coluna: 'afazer' },
    { id: 2, texto: 'Criar API', prioridade: 'alta', coluna: 'andamento' },
    { id: 3, texto: 'Testar Postman', prioridade: 'media', coluna: 'concluido' },
];

app.use(express.json());

let proximaId = 4;

// Criar nova tarefa
app.post('/tarefas', (req, res) => {
    const { texto, prioridade, coluna, cidade } = req.body;

    if (!texto) {
        return res.status(400).json({ erro: 'O campo texto é obrigatório' });
    }

    const novaTarefa = {
        id: proximaId++,
        texto: texto,
        prioridade: prioridade || 'media',
        coluna: coluna || 'afazer',
        cidade: cidade || '',
    };

    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});


app.put('/tarefas/:id', (req, res) => {
    const id = Number(req.params.id);
    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    const { texto, prioridade, coluna, cidade } = req.body;

    if (texto !== undefined) tarefa.texto = texto;
    if (prioridade !== undefined) tarefa.prioridade = prioridade;
    if (coluna !== undefined) tarefa.coluna = coluna;
    if (cidade !== undefined) tarefa.cidade = cidade;

    res.json(tarefa);
});


app.delete('/tarefas/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = tarefas.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    const [tarefaRemovida] = tarefas.splice(index, 1);
    res.json({ mensagem: 'Tarefa removida com sucesso', tarefa: tarefaRemovida });
});


app.get('/', (req, res) => {
    res.json({ api: 'TaskFlow', versao: '1.0', status: 'online' });
});

app.get('/ok', (req, res) => {
    res.json({ status: 'ok', dados: [1, 2, 3] });
});
app.get('/criado', (req, res) => {
    res.status(201).json({ mensagem: 'Criado com sucesso' });
});
app.get('/erro', (req, res) => {
    res.status(400).json({ erro: 'Dados inválidos' });
});
app.get('/texto', (req, res) => {
    res.send('Resposta em texto simples');
});

app.get('/tarefas', (req, res) => {
    const { coluna, prioridade } = req.query;
    let resultado = tarefas;

    if (coluna) {
        resultado = resultado.filter(t => t.coluna === coluna);
    }
    if (prioridade) {
        resultado = resultado.filter(t => t.prioridade === prioridade);
    }

    res.json(resultado);
});

// Buscar tarefa por ID
app.get('/tarefas/:id', (req, res) => {
    const id = Number(req.params.id);
    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) {
        return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    res.json(tarefa);
});


const usuarios = [
    { id: 1, nome: 'admin', email: 'admin@taskflow.com' }
];


app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});


// Middleware de rota 404
app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        metodo: req.method,
        caminho: req.url,
    });
});

// Inicialização do servidor
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});