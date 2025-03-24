import express from 'express';
import http from 'http';
import { Server } from 'ws';

// 创建 Express 应用
const app = express();

// 设置 HTTP 路由
// Test
app.get('/', (req, res) => {
    res.send('Hello, World! (GET)');
});

app.post('/', (req, res) => {
    res.send('Received a POST request');
});

app.put('/', (req, res) => {
    res.send('Received a PUT request');
});

app.delete('/', (req, res) => {
    res.send('Received a DELETE request');
});

// example
let users: { id: number; name: string; email: string }[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
];

// GET: 获取用户列表（支持按 name 过滤）
app.get('/users', (req, res) => {
    const { name } = req.query;
    if (name) {
        const filteredUsers = users.filter((u) =>
            u.name.toLowerCase().includes((name as string).toLowerCase()),
        );
        return res.json(filteredUsers);
    }
    res.json(users);
});

// POST: 添加新用户
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).send('Name and email are required');
    }
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT: 更新用户邮箱
app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { email } = req.body;
    const user = users.find((u) => u.id === id);
    if (!user) {
        return res.status(404).send('User not found');
    }
    if (!email) {
        return res.status(400).send('Email is required');
    }
    user.email = email;
    res.json(user);
});

// DELETE: 删除用户
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
        return res.status(404).send('User not found');
    }
    users.splice(index, 1);
    res.status(204).send();
});

// 创建 HTTP 服务器
const server = http.createServer(app);

// 创建 WebSocket 服务器
const wss = new Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`You sent: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// 设置静态文件服务
app.use(express.static('public'));

// 启动服务器
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
