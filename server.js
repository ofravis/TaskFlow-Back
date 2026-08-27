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
app.post('/tarefas', (req, res) => {
    const {texto, prioridade, coluna, cidade} = req.body;
    const novaTarefa = {
        id:     proximaId++,
        texto:  texto,
        prioridade: prioridade ||'media',
        coluna: coluna ||'afazer',
        cidade: cidade ||'',
    };

app.put('/tarefas/:id', (req, res) => {
    
})


tarefas.push(novaTarefa);
res.status(201).json(novaTarefa);
});




// Rota raiz
app.get('/', (req, res) => {
    res.json({ api: 'TaskFlow', versao: '1.0', status: 'online' });
});

// Rotas de teste
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

// Listar tarefas (com suporte a filtros via query)
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

// Middleware de rota 404 (deve ficar após todas as rotas válidas)
app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        metodo: req.method,
        caminho: req.url,
    });
});

// Inicialização do servidor (deve ficar sempre ao final)
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});