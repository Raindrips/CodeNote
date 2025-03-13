# 搭建服务器步骤



以下是如何通过 Node.js 和 TypeScript 搭建一个服务器的详细步骤。这个服务器将支持 GET、POST、PUT、DELETE 请求，通过 WebSocket 创建连接，并且允许客户端通过浏览器的 HTTP 请求访问页面。我会一步一步地指导你完成这个任务。

---

### **步骤 1：安装 Node.js 和 TypeScript**

首先，确保你已经安装了 Node.js，它是一个运行 JavaScript 的服务器端环境。你可以从 [Node.js 官网](https://nodejs.org/) 下载并安装最新版本。安装完成后，检查版本以确认安装成功：

```bash
node -v
```

接下来，安装 TypeScript，它是 JavaScript 的超集，提供了类型检查等功能。使用 npm（Node.js 的包管理器）全局安装 TypeScript：

```bash
npm install -g typescript
```

安装完成后，检查 TypeScript 是否正常工作：

```bash
tsc -v
```

---

### **步骤 2：初始化 Node.js 项目**

创建一个新的项目文件夹，例如 `my-server`，然后进入该文件夹：

```bash
mkdir my-server
cd my-server
```

初始化一个 Node.js 项目，这会生成一个 `package.json` 文件：

```bash
npm init -y
```

`-y` 参数会跳过交互式提问，使用默认配置。

---

### **步骤 3：安装必要的依赖项**

我们需要以下几个库来实现功能：

1. **Express.js**：一个轻量级的 Web 框架，用于处理 HTTP 请求。
2. **ws**：一个 WebSocket 库，用于创建 WebSocket 连接。

安装这些库及其 TypeScript 类型定义：

```bash
npm install express ws
npm install @types/express @types/ws --save-dev
```

- `express` 和 `ws` 是核心依赖。
- `@types/express` 和 `@types/ws` 是 TypeScript 的类型定义文件，帮助我们在 TypeScript 中使用这些库时获得类型支持。

---

### **步骤 4：配置 TypeScript**

在项目根目录下创建一个 `tsconfig.json` 文件，用于配置 TypeScript 编译器。运行以下命令可以生成一个基础配置文件：

```bash
tsc --init
```

然后，修改 `tsconfig.json` 为以下内容：

```json
{
  "compilerOptions": {
    "target": "es6",           // 目标 JavaScript 版本
    "module": "commonjs",      // 使用 CommonJS 模块系统
    "outDir": "./dist",        // 编译输出目录
    "rootDir": "./src",        // 源代码目录
    "strict": true,            // 启用严格类型检查
    "esModuleInterop": true    // 支持 ES 模块互操作
  }
}
```

这个配置告诉 TypeScript 将代码编译到 `dist` 文件夹，并从 `src` 文件夹读取源代码。

---

### **步骤 5：创建服务器代码**

在项目根目录下创建一个 `src` 文件夹，并在其中创建一个 `index.ts` 文件。这是我们的服务器入口文件。

编辑 `src/index.ts`，添加以下代码：

```typescript
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
```

#### **代码说明**：
- **HTTP 请求**：使用 `app.get`、`app.post`、`app.put` 和 `app.delete` 定义了基本的路由，分别处理 GET、POST、PUT 和 DELETE 请求。
- **WebSocket**：通过 `ws` 库创建了一个 WebSocket 服务器，附加到 HTTP 服务器上。`wss.on('connection')` 处理客户端连接，`ws.on('message')` 处理消息，`ws.on('close')` 处理断开连接。
- **静态文件**：`app.use(express.static('public'))` 允许客户端访问 `public` 文件夹中的静态文件（如 HTML 页面）。

---

### **步骤 6：提供客户端页面**

在项目根目录下创建一个 `public` 文件夹，并在其中创建以下两个文件：

#### **public/index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
</head>
<body>
  <h1>Welcome to My App</h1>
  <p>Check the console for WebSocket messages!</p>
  <script src="client.js"></script>
</body>
</html>
```

#### **public/client.js**
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  console.log('Connected to server');
  ws.send('Hello, server!');
};

ws.onmessage = (event) => {
  console.log(`Received: ${event.data}`);
};

ws.onclose = () => {
  console.log('Disconnected from server');
};
```

#### **说明**：
- `index.html` 是客户端访问的页面，加载 `client.js`。
- `client.js` 建立与服务器的 WebSocket 连接，并在控制台打印消息。

---

### **步骤 7：编译并运行服务器**

#### **编译 TypeScript**
在终端中运行以下命令，将 TypeScript 代码编译为 JavaScript：

```bash
tsc
```

这会生成 `dist` 文件夹，其中包含编译后的 `index.js`。

#### **运行服务器**
运行编译后的代码：

```bash
node dist/index.js
```

服务器将在端口 3000 上运行。你可以通过以下方式测试：
- 打开浏览器，访问 `http://localhost:3000`，你应该看到 “Welcome to My App” 页面。
- 在浏览器开发者工具的控制台中，查看 WebSocket 连接的消息。
- 使用工具（如 Postman 或 curl）测试 GET、POST、PUT、DELETE 请求，例如：
  ```bash
  curl http://localhost:3000
  curl -X POST http://localhost:3000
  ```

---

### **步骤 8：优化开发体验（可选）**

为了方便开发，可以使用 `nodemon` 和 `ts-node` 来自动重启服务器并直接运行 TypeScript 代码。

#### **安装依赖**
```bash
npm install nodemon ts-node --save-dev
```

#### **更新 package.json**
在 `package.json` 的 `scripts` 部分添加以下内容：

```json
"scripts": {
  "start": "nodemon --exec ts-node src/index.ts"
}
```

#### **启动服务器**
运行以下命令：

```bash
npm start
```

现在，每次修改 `index.ts` 时，服务器都会自动重启。

---

### **总结**

通过以上步骤，你已经成功搭建了一个 Node.js + TypeScript 服务器，具有以下功能：
1. **接收 GET、POST、PUT、DELETE 请求**：通过 Express.js 实现。
2. **用 WebSocket 创建连接**：通过 ws 库实现。
3. **客户端能通过浏览器访问页面**：通过提供静态文件实现。

最终的项目结构如下：

```
my-server/
├── dist/               # 编译后的代码
├── public/            # 静态文件
│   ├── index.html
│   └── client.js
├── src/              # 源代码
│   └── index.ts
├── package.json
└── tsconfig.json
```

现在，你可以根据需要扩展这个服务器，例如添加更多的路由逻辑或复杂的 WebSocket 功能！