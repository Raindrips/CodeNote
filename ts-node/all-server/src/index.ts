import express from 'express';
import http from 'http';
import { Server } from 'ws';

// 创建 Express 应用
const app = express();

// 设置 HTTP 路由
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
