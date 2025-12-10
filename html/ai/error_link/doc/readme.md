## 项目架构

**核心概述**: 本项目是一个基于Node.js和WebSocket技术构建的多人在线游戏系统，包含模块化的服务端架构和Canvas渲染的客户端实现。系统支持100位用户同时在线，提供实时位置同步、用户管理、房间系统和安全防护功能。本文档详细介绍了项目架构、安装运行指南、压力测试方法、目录结构、核心技术实现及性能优化建议，旨在帮助开发者快速理解和使用该项目。

本项目采用客户端-服务器(C/S)架构模式，通过WebSocket实现实时双向通信，构建了一个功能完整的多人在线游戏系统。整体架构分为服务端和客户端两个主要部分，各自采用模块化设计，确保代码的可维护性和扩展性。

- 多人游戏系统架构
  - 服务端架构
    - 核心模块
      - 用户管理模块
      - 消息处理模块
      - 广播管理模块
      - 房间管理模块
      - 安全管理模块
    - 技术栈
      - Node.js
      - ws库
      - UUID
      - 模块化设计
  - 客户端架构
    - 核心功能
      - Canvas渲染引擎
      - WebSocket通信
      - 用户输入处理
      - 状态同步
      - UI界面
    - 技术栈
      - HTML5 Canvas
      - JavaScript
      - CSS3
      - WebSocket API
  - 通信协议
    - 消息类型
      - 登录消息
      - 移动消息
      - 聊天消息
      - 系统消息
    - 数据格式
      - JSON
      - 统一消息结构



#### 架构

本项目采用客户端-服务器(C/S)架构模式，通过WebSocket实现实时双向通信，构建了一个功能完整的多人在线游戏系统。整体架构分为服务端和客户端两个主要部分，各自采用模块化设计，确保代码的可维护性和扩展性。

服务端采用Node.js作为运行环境，利用WebSocket协议(通过ws库实现)建立客户端与服务器之间的持久连接，支持实时数据传输。核心业务逻辑被拆分为多个职责单一的模块，包括用户管理、消息处理、广播管理、房间管理和安全管理等，各模块之间通过明确定义的接口进行通信，降低了系统的耦合度。

客户端基于HTML5 Canvas技术实现游戏画面渲染，采用原生JavaScript开发，不依赖复杂框架，确保轻量高效。客户端负责处理用户输入、渲染游戏场景和其他玩家状态，并通过WebSocket与服务端保持实时通信，实现位置同步和状态更新。

#### 技术栈详情

服务端技术栈以Node.js为核心，结合WebSocket库(ws)实现实时通信功能。具体技术组件包括：Node.js运行环境提供了非阻塞I/O特性，适合处理高并发的网络连接；ws库实现了WebSocket协议，支持客户端与服务器之间的持久连接和双向通信；uuid库用于生成唯一的用户标识符；模块化设计模式确保代码的可维护性和可扩展性。服务端不依赖数据库，采用内存存储用户数据和游戏状态，提高数据访问速度，简化系统架构。

客户端技术栈基于Web标准构建，主要包括：HTML5 Canvas API用于游戏画面的绘制和渲染，支持高性能的2D图形绘制；原生JavaScript处理业务逻辑和用户交互；CSS3实现界面样式和动画效果；WebSocket API建立与服务端的实时连接。客户端还使用了现代JavaScript特性和模块化设计，确保代码的可读性和可维护性。



消息均采用JSON格式传输

例如，用户移动消息格式为`{ type: 'move', data: { position: { x: 0, y: 0, z: 0 } } }`



## 环境要求

Node.js运行环境(v14.0.0或更高版本)

npm包管理工具(v6.0.0或更高版本)

WebSocket协议的网络环境

服务器硬件配置建议至少1核CPU和1GB内存

## 运行环境

进入服务端`game_architecture`,执行命令

```
npm install

npm run dev
```

启动

```
npm start
```

设置端口

```
PORT=8080 npm start
```

进入客户端路径`canvas-game-client`

```
npm install
npm run build
npm run preview
```

**注意事项**:

- 服务端和客户端的WebSocket连接地址需要匹配，否则无法建立连接。开发环境下，客户端默认连接ws://localhost:3000，若服务端使用自定义端口，需同步修改客户端的连接地址。
- 生产环境部署时，建议使用Nginx等反向代理服务器，并配置SSL/TLS证书，将WebSocket连接升级为wss://协议，确保通信安全。
- 客户端构建前，应确认vite.config.js中的配置符合部署环境要求，特别是base和outDir参数。

服务端配置主要通过环境变量实现，支持的环境变量包括：PORT(服务端监听端口)，默认值为3000；MAX_USERS(最大支持用户数)，默认值为100；HEARTBEAT_INTERVAL(心跳检测间隔，毫秒)，默认值为30000；TIMEOUT_THRESHOLD(连接超时阈值，毫秒)，默认值为300000。



## 压力测试

```
## 启动服务端
cd /home/workspace/game_architecture
npm start

# 命令执行基本测试
node test-server.js

# 测试100个用户
node test-server.js --users 100
```

测试脚本支持多种参数自定义测试场景，常用参数包括：

- --users: 指定并发用户数，默认10
- --duration: 测试持续时间(秒)，默认60
- --interval: 消息发送间隔(毫秒)，默认1000
- --server: 服务端WebSocket地址，默认ws://localhost:3000

例如，以下命令模拟100个用户连接，持续测试5分钟，每500毫秒发送一次移动消息：

```
node test-server.js --users 100 --duration 300 --interval 500 --server ws://localhost:3000
```



**测试成功指标**:

- 100个客户端成功连接并保持稳定
- 登录成功率100%
- 消息发送成功率>99.9%
- 平均响应时间<100ms
- 无明显内存泄漏
- CPU使用率<70%

**常见性能瓶颈**:

- 消息广播算法效率低
- 内存数据结构设计不合理
- 缺少消息合并机制
- 未优化的JSON序列化/反序列化
- 事件循环阻塞
- 网络带宽限制

项目结构

```undefined
/home/workspace/
├── canvas-game-client/      # 客户端项目目录
├── game_architecture/       # 服务端项目目录
├── game_features/           # 游戏功能说明文档
├── palettes.json            # 配色方案配置文件
└── README.md                # 项目根文档
```



服务端目录结构

```undefined
game_architecture/
├── package.json              # 项目配置和依赖
├── package-lock.json         # 依赖版本锁定文件
├── server.js                 # 主服务器文件
├── test-server.js            # 压力测试脚本
├── client-demo.html          # 简易客户端演示页面
├── README.md                 # 服务端文档
├── answer_sheet.md           # 任务说明文档
└── modules/                  # 核心模块目录
    ├── UserManager.js        # 用户管理模块
    ├── MessageHandler.js     # 消息处理模块
    ├── BroadcastManager.js   # 广播管理模块
    ├── GameRoom.js           # 游戏房间模块
    ├── RoomManager.js        # 房间管理模块
    └── SecurityManager.js    # 安全管理模块
```

server.js是服务端的入口文件，定义了GameServer类，负责初始化服务器、管理WebSocket连接和协调各个模块。该文件是服务端的核心，实现了服务器的启动流程和连接处理逻辑。

modules目录是服务端的核心功能实现部分，包含多个职责单一的模块：

- UserManager.js: 负责用户连接的管理，维护在线用户列表，处理用户登录、退出和状态更新。
- MessageHandler.js: 处理客户端发送的各种消息，解析消息内容，执行相应的业务逻辑，并生成响应。
- BroadcastManager.js: 实现消息的广播功能，支持向所有用户、特定用户组或单个用户发送消息，优化消息分发效率。
- GameRoom.js: 定义游戏房间的数据结构和操作方法，管理房间内的玩家和游戏状态。
- RoomManager.js: 负责多个游戏房间的创建、删除和管理，实现玩家的房间分配和切换。
- SecurityManager.js: 提供安全防护功能，包括速率限制、消息过滤和用户验证等，保护服务器免受恶意攻击。

test-server.js是服务端的压力测试脚本，用于模拟多个客户端并发连接，测试服务器在高负载下的性能表现。client-demo.html是一个简易的客户端演示页面，可用于快速测试服务端功能。

package.json文件定义了服务端项目的元数据和依赖关系，包括项目名称、版本、入口文件、脚本命令和依赖包列表等。

#### 客户端目录结构详解

客户端代码位于canvas-game-client目录下，采用现代前端工程化方案，使用Vite作为构建工具，目录结构清晰合理。详细目录结构如下：

```
canvas-game-client/
├── index.html                # 客户端入口HTML文件
├── package.json              # 项目配置和依赖
├── package-lock.json         # 依赖版本锁定文件
├── vite.config.js            # Vite配置文件
├── eslint.config.js          # ESLint配置文件
├── assets/                   # 静态资源目录
├── scripts/                  # 构建脚本目录
│   ├── eslint-plugin-internal-links.cjs
│   ├── eslint-plugin-require-src.cjs
│   ├── vite-plugin-asset-check.js
│   ├── vite-plugin-basename-check.js
│   ├── vite-plugin-lint-internal-links.js
│   └── vite-plugin-static-copy-safe.js
└── dist/                     # 构建输出目录(构建后生成)
```

index.html是客户端的入口HTML文件，包含页面结构、样式引入和主要脚本。该文件定义了游戏容器、UI元素和Canvas画布，是客户端应用的起点。

vite.config.js是Vite的配置文件，定义了项目的构建规则、开发服务器设置、插件配置等。通过该文件可以定制客户端的构建流程和输出格式。

assets目录用于存放客户端所需的静态资源，如图片、字体等。scripts目录包含构建过程中使用的各种辅助脚本和Vite插件，用于资源检查、代码 linting 和静态文件复制等功能。

package.json文件定义了客户端项目的元数据和依赖关系，包括开发依赖和构建脚本。客户端的主要依赖是Vite及其相关插件，用于构建和开发环境支持。

dist目录是客户端构建后的输出目录，包含优化后的HTML、CSS和JavaScript文件，可直接部署到生产环境。

#### 关键文件功能说明

项目中包含多个关键文件，对系统的正常运行至关重要。以下是这些文件的功能说明：

服务端关键文件：

- server.js: 服务端主入口文件，实现GameServer类，负责初始化服务器、管理WebSocket连接和协调各个模块。该文件是服务端的核心，控制着整个服务器的启动和运行流程。
- modules/UserManager.js: 用户管理模块的实现文件，定义了UserManager类，提供用户添加、删除、查询和状态更新等功能。该模块维护着当前在线用户的列表，是其他模块获取用户信息的主要来源。
- modules/MessageHandler.js: 消息处理模块，负责解析客户端发送的消息，根据消息类型执行相应的业务逻辑，并生成响应消息。该模块是服务端处理业务逻辑的核心，支持登录、移动、聊天等多种消息类型的处理。

客户端关键文件：

- index.html: 客户端入口文件，定义了游戏界面的HTML结构，包括Canvas元素、UI控件和引入的JavaScript文件。该文件是客户端应用的起点，负责页面初始化和游戏启动。
- vite.config.js: Vite构建配置文件，定义了客户端项目的构建规则，包括入口文件、输出目录、开发服务器配置和插件设置等。通过该文件可以定制客户端的构建流程和优化策略。
- scripts/vite-plugin-asset-check.js: 自定义Vite插件，用于在构建过程中检查静态资源的完整性和引用有效性，确保客户端资源的正确加载。

配置文件：

- palettes.json: 定义了客户端UI的配色方案，包含多种主题色和辅助色的定义，用于统一客户端的视觉风格。

这些关键文件共同构成了项目的核心功能实现，理解它们的作用和相互关系对于掌握整个项目的工作原理至关重要。

### 关键功能实现的技术细节

#### WebSocket通信机制

WebSocket通信是本项目实现实时多人在线功能的核心技术基础，通过建立持久连接实现客户端与服务器之间的双向实时数据传输。服务端和客户端的WebSocket实现细节如下：

服务端WebSocket实现基于ws库，这是一个轻量级、高性能的WebSocket实现。在GameServer类的start方法中，通过创建WebSocket.Server实例启动WebSocket服务：

```JavaScript
this.wss = new WebSocket.Server({ port: this.port });
```

服务端通过监听connection事件处理新的客户端连接。每当有新客户端连接时，会创建一个WebSocket对象(ws)，并调用handleNewConnection方法进行处理：

```JavaScript
this.wss.on('connection', (ws) => {
    this.handleNewConnection(ws);
});
```

handleNewConnection方法首先检查当前在线用户数是否已达到上限(maxUsers)，若已达上限则拒绝连接并发送"服务器已满"的错误消息。否则，为新连接生成唯一的用户ID，创建用户对象，并通过userManager.addUser方法将用户添加到在线用户列表。

用户对象包含连接的WebSocket实例、用户ID、用户名、位置信息、登录状态和最后活动时间等属性。这些信息在用户会话期间被持续维护，用于实现实时状态同步和消息路由。

服务端通过监听WebSocket对象的message事件接收客户端发送的消息：

```JavaScript
ws.on('message', (data) => {
    this.handleMessage(ws, data);
});
```

接收到的消息数据首先被转换为字符串，然后解析为JSON对象，再交由messageHandler模块进行处理：

```JavaScript
handleMessage(ws, data) {
    try {
        const message = JSON.parse(data.toString());
        const user = this.userManager.getUserByWs(ws);
        this.messageHandler.processMessage(user, message);
    } catch (error) {
        console.error('消息处理错误:', error);
    }
}
```

客户端WebSocket实现使用浏览器原生的WebSocket API，通过创建WebSocket对象建立与服务端的连接：

```JavaScript
const ws = new WebSocket('ws://localhost:3000');
```

客户端WebSocket连接的生命周期管理包括连接建立、消息发送、消息接收、连接关闭和错误处理等阶段：

- 连接建立：监听WebSocket对象的open事件，在连接成功建立后执行登录等初始化操作。
- 消息发送：通过WebSocket对象的send方法发送JSON格式的消息。
- 消息接收：监听message事件，接收服务端推送的消息并进行处理。
- 连接关闭：监听close事件，处理连接意外断开的情况，如尝试重连。
- 错误处理：监听error事件，处理连接过程中的错误。

客户端实现了自动重连机制，当连接意外断开时，会尝试定期重新连接服务器，直到连接成功或用户主动退出。

#### 用户管理与状态同步

用户管理是服务端的核心功能之一，负责维护用户的连接状态、基本信息和游戏状态，确保多用户在线时的数据一致性和实时性。UserManager模块是实现这一功能的核心，提供了全面的用户管理接口。

UserManager类的主要功能包括用户的添加、删除、查询和状态更新。当新客户端连接到服务器时，会创建一个用户对象并添加到用户列表：

```JavaScript
addUser(user) {
    this.users.set(user.id, user);
    this.updateUserActivity(user.id);
    return user.id;
}
```

用户对象存储在一个Map数据结构中，以用户ID为键，便于高效的查找和更新操作。UserManager提供了多种用户查询方法，如根据用户ID、WebSocket实例或用户名查找用户：

```JavaScript
getUserById(userId) {
    return this.users.get(userId);
}

getUserByWs(ws) {
    for (const user of this.users.values()) {
        if (user.ws === ws) return user;
    }
    return null;
}
```

用户状态管理包括登录状态、位置信息、旋转角度等的维护。用户登录过程中，UserManager验证用户名的唯一性，并更新用户的登录状态：

```JavaScript
loginUser(userId, username) {
    const user = this.getUserById(userId);
    if (!user) return false;
    
    // 检查用户名是否已存在
    if (this.isUsernameTaken(username)) {
        return false;
    }
    
    user.username = username;
    user.isLoggedIn = true;
    this.updateUserActivity(userId);
    return true;
}
```

位置同步是多人在线游戏的核心功能，UserManager提供了更新和获取用户位置的方法：

```JavaScript
updateUserPosition(userId, position) {
    const user = this.getUserById(userId);
    if (user) {
        user.position = { ...user.position, ...position };
        this.updateUserActivity(userId);
        return true;
    }
    return false;
}
```

当用户移动时，客户端会定期发送包含新位置信息的消息，服务端更新用户位置后，通过广播机制将位置变化通知给其他相关用户，实现所有客户端的位置同步。

为确保连接的有效性和资源的及时释放，UserManager实现了用户活动监控和超时断开功能。每次用户发送消息或更新位置时，会更新最后活动时间：

```JavaScript
updateUserActivity(userId) {
    const user = this.getUserById(userId);
    if (user) {
        user.lastActivity = Date.now();
    }
}
```

服务端定期检查所有用户的最后活动时间，对超过超时阈值的用户执行强制断开操作：

```JavaScript
checkInactiveUsers() {
    const now = Date.now();
    const timeout = this.timeoutThreshold;
    
    for (const user of this.users.values()) {
        if (now - user.lastActivity > timeout) {
            console.log(`用户超时断开连接: ${user.username || user.id}`);
            user.ws.close(1001, '连接超时');
            this.removeUser(user.id);
        }
    }
}
```

这种用户管理机制确保了系统能够准确跟踪在线用户状态，及时释放无效连接，维持系统的稳定性和资源效率。

#### 消息处理与广播机制

消息处理和广播机制是实现多人在线游戏实时交互的关键技术，负责解析客户端消息、执行业务逻辑和高效分发状态更新。本项目通过MessageHandler和BroadcastManager两个核心模块实现这一功能。

MessageHandler模块负责解析和处理客户端发送的各种消息，根据消息类型执行相应的业务逻辑。该模块支持多种消息类型，包括登录、移动、聊天、心跳等，并为每种消息类型定义了专门的处理方法。

消息处理流程始于processMessage方法，该方法根据消息类型路由到相应的处理函数：

```JavaScript
processMessage(user, message) {
    switch (message.type) {
        case 'login':
            this.handleLogin(user, message.data);
            break;
        case 'move':
            this.handleMove(user, message.data);
            break;
        case 'chat':
            this.handleChat(user, message.data);
            break;
        case 'heartbeat':
            this.handleHeartbeat(user);
            break;
        // 其他消息类型处理...
        default:
            this.sendError(user, `未知消息类型: ${message.type}`);
    }
}
```

以登录消息处理为例，handleLogin方法验证用户登录信息，检查用户名唯一性，更新用户状态，并在登录成功后向客户端发送登录成功消息，同时广播新用户加入事件：

```JavaScript
handleLogin(user, data) {
    const { username } = data;
    
    // 验证用户名格式
    if (!this.validateUsername(username)) {
        this.sendError(user, '无效的用户名格式');
        return;
    }
    
    // 尝试登录用户
    const success = this.userManager.loginUser(user.id, username);
    if (!success) {
        this.sendError(user, '用户名已被占用');
        return;
    }
    
    // 发送登录成功消息
    this.sendMessage(user, 'login_success', {
        userId: user.id,
        username: user.username
    });
    
    // 广播新用户加入
    this.broadcastUserJoined(user);
    
    // 向新用户发送当前在线用户列表
    this.sendOnlineUsers(user);
}
```

移动消息处理涉及更新用户位置并广播位置变化，确保其他客户端能够实时看到用户移动：

```JavaScript
handleMove(user, data) {
    const { position } = data;
    
    // 验证位置数据
    if (!this.validatePosition(position)) {
        this.sendError(user, '无效的位置数据');
        return;
    }
    
    // 更新用户位置
    this.userManager.updateUserPosition(user.id, position);
    
    // 广播用户位置变化
    this.broadcastManager.broadcastUserMove(user);
}
```

BroadcastManager模块负责实现高效的消息广播功能，支持向不同范围的用户群体发送消息，包括全局广播、房间广播和个人消息。

全局广播用于将消息发送给所有在线用户，如系统通知、新用户加入等事件：

```JavaScript
broadcastSystemMessage(message) {
    this.broadcast({
        type: 'system_message',
        message: message
    });
}
```

为提高广播效率，BroadcastManager采用批量处理和消息合并策略，减少WebSocket发送操作的次数：

```JavaScript
broadcast(data) {
    const message = JSON.stringify(data);
    this.userManager.getOnlineUsers().forEach(user => {
        if (user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(message);
        }
    });
}
```

针对用户位置更新等高频消息，BroadcastManager实现了消息节流和合并机制，避免网络拥塞和客户端性能问题：

```JavaScript
queueUserMove(user) {
    // 将用户移动加入队列
    this.moveQueue.set(user.id, user.position);
    
    // 如果定时器未激活，则启动定时器
    if (!this.moveBroadcastTimer) {
        this.moveBroadcastTimer = setTimeout(() => {
            this.broadcastQueuedMoves();
            this.moveBroadcastTimer = null;
        }, this.moveBroadcastInterval);
    }
}

broadcastQueuedMoves() {
    if (this.moveQueue.size === 0) return;
    
    // 构建批量移动消息
    const moves = Array.from(this.moveQueue.entries()).map(([userId, position]) => ({
        userId,
        position
    }));
    
    // 广播批量移动消息
    this.broadcast({
        type: 'user_moves',
        moves: moves
    });
    
    // 清空队列
    this.moveQueue.clear();
}
```

这种批量广播策略将短时间内的多个位置更新合并为一个消息发送，显著减少了网络传输量和客户端处理负担，提高了系统的整体性能。

#### Canvas渲染与用户界面

客户端的Canvas渲染和用户界面实现是提供良好游戏体验的关键，本项目基于HTML5 Canvas API实现了高效的游戏画面渲染和响应式用户界面。

Canvas渲染系统的核心是游戏循环(Game Loop)，通过requestAnimationFrame API实现平滑的动画效果：

```JavaScript
function gameLoop(timestamp) {
    // 计算时间增量
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制游戏场景
    drawBackground();
    
    // 绘制所有用户
    drawUsers();
    
    // 绘制UI元素
    drawUI();
    
    // 请求下一帧渲染
    requestAnimationFrame(gameLoop);
}

// 启动游戏循环
requestAnimationFrame(gameLoop);
```

游戏循环负责协调渲染过程的各个环节，包括清空画布、绘制背景、绘制用户、绘制UI等，并控制渲染帧率以确保流畅的视觉体验。

用户渲染是Canvas渲染系统的核心功能，负责绘制所有在线用户的头像和名称，并突出显示当前用户。drawUsers函数遍历所有在线用户，调用drawUser函数绘制每个用户：

```JavaScript
function drawUsers() {
    onlineUsers.forEach(user => {
        drawUser(user);
    });
}

function drawUser(user) {
    const { position, username, id } = user;
    const isCurrentUser = id === currentUserId;
    
    // 计算用户在画布上的坐标
    const x = position.x + canvas.width / 2;
    const y = position.y + canvas.height / 2;
    
    // 绘制用户头像
    drawAvatar(x, y, isCurrentUser);
    
    // 绘制用户名标签
    drawUsernameTag(x, y, username, isCurrentUser);
}
```

用户头像绘制支持圆形剪裁和高亮效果，当前用户的头像会添加特殊边框以突出显示：

```JavaScript
function drawAvatar(x, y, isCurrentUser) {
    // 保存当前绘图状态
    ctx.save();
    
    // 创建圆形剪裁区域
    ctx.beginPath();
    ctx.arc(x, y, AVATAR_RADIUS, 0, Math.PI * 2);
    ctx.clip();
    
    // 绘制头像背景
    ctx.fillStyle = isCurrentUser ? CURRENT_USER_COLOR : OTHER_USER_COLOR;
    ctx.fillRect(x - AVATAR_RADIUS, y - AVATAR_RADIUS, 
                AVATAR_RADIUS * 2, AVATAR_RADIUS * 2);
    
    // 绘制用户头像图片或默认头像
    if (userAvatar) {
        ctx.drawImage(userAvatar, x - AVATAR_RADIUS, y - AVATAR_RADIUS, 
                     AVATAR_RADIUS * 2, AVATAR_RADIUS * 2);
    } else {
        // 绘制默认头像
        drawDefaultAvatar(x, y);
    }
    
    // 恢复绘图状态
    ctx.restore();
    
    // 如果是当前用户，绘制高亮边框
    if (isCurrentUser) {
        ctx.beginPath();
        ctx.arc(x, y, AVATAR_RADIUS + 2, 0, Math.PI * 2);
        ctx.strokeStyle = HIGHLIGHT_COLOR;
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}
```

用户界面(UI)元素的绘制包括游戏控制说明、状态信息和聊天窗口等。UI绘制采用分层策略，确保UI元素始终显示在游戏场景上方：

```JavaScript
function drawUI() {
    // 绘制控制说明
    drawControlsHelp();
    
    // 绘制状态信息
    drawStatusInfo();
    
    // 绘制聊天窗口
    drawChatWindow();
    
    // 绘制登录面板(如果未登录)
    if (!isLoggedIn) {
        drawLoginPanel();
    }
}
```

为确保在不同设备和屏幕尺寸上的良好显示效果，客户端实现了Canvas自适应调整功能，根据窗口大小动态调整Canvas尺寸：

```JavaScript
function resizeCanvas() {
    // 设置Canvas尺寸为窗口大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 重新绘制场景
    drawScene();
}

// 监听窗口大小变化事件
window.addEventListener('resize', resizeCanvas);

// 初始调整
resizeCanvas();
```

为优化渲染性能，特别是在100用户同时在线的场景下，客户端实现了多种性能优化策略，包括：

1. 减少绘制操作：通过合并绘制操作和减少状态切换，降低Canvas渲染开销。
2. 视距剔除：只绘制视野范围内的用户，对于超出屏幕范围的用户不进行渲染。
3. 批量渲染：对静态元素和动态元素分开渲染，减少不必要的重绘。
4. 图像缓存：将频繁使用的图像资源预加载并缓存，避免重复创建图像对象。

这些优化措施确保了客户端在大量用户同时在线的情况下仍能保持流畅的渲染性能和响应性。

### 性能优化建议

#### 代码层面优化

在代码实现层面，有多种优化策略可以提高系统性能，减少资源消耗，提升响应速度。以下是针对服务端和客户端的具体代码优化建议：

服务端代码优化主要关注CPU利用率、内存管理和消息处理效率。一个关键优化点是减少JSON序列化和反序列化的开销，这是WebSocket通信中的主要性能瓶颈之一。可以通过以下方式优化：

1. 使用更高效的序列化格式：考虑使用MessagePack等二进制格式替代JSON，减少序列化开销和数据大小。
2. 对象池复用：创建对象池管理常用消息对象，避免频繁的对象创建和垃圾回收。
3. 选择性序列化：只序列化必要的字段，减少数据传输量。

```JavaScript
// 优化前：每次创建新对象并完整序列化
ws.send(JSON.stringify({
    type: 'user_moved',
    userId: user.id,
    username: user.username,
    position: user.position,
    timestamp: Date.now()
}));

// 优化后：使用对象池和选择性序列化
const msg = messagePool.get();
msg.type = 'user_moved';
msg.userId = user.id;
msg.position = user.position;
ws.send(serialize(msg));
messagePool.release(msg);
```

事件循环优化对于Node.js应用至关重要，避免长时间占用事件循环的操作，确保服务器能够及时响应新的连接和消息：

1. 异步处理：将CPU密集型操作移至工作线程或使用异步API。
2. 批量处理：将短时间内的多个小操作合并为批量操作，减少事件循环周转次数。
3. 定时器优化：合理设置定时器间隔，避免过多的定时器回调阻塞事件循环。

```JavaScript
// 优化前：每个用户单独设置定时器
users.forEach(user => {
    setInterval(() => checkUserStatus(user), 1000);
});

// 优化后：使用单个定时器批量处理
setInterval(() => {
    users.forEach(user => checkUserStatus(user));
}, 1000);
```

内存管理优化有助于避免内存泄漏和减少垃圾回收压力：

1. 使用Map和Set替代数组进行频繁查找操作，提高查找效率。
2. 及时清理不再需要的对象引用，特别是事件监听器和定时器。
3. 限制缓存数据的大小和生命周期，避免无限制增长。

客户端代码优化主要关注渲染性能和用户交互响应性。Canvas渲染优化可以显著提升画面流畅度：

1. 使用离屏Canvas：将复杂的静态背景或重复元素绘制到离屏Canvas，需要时直接绘制到主Canvas，减少重复计算。
2. 减少绘制区域：只重绘发生变化的区域，而非整个Canvas。
3. 优化路径绘制：减少不必要的路径操作，使用更高效的绘制方法。

```JavaScript
// 使用离屏Canvas缓存静态背景
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');
// 绘制静态背景到离屏Canvas
drawStaticBackground(offscreenCtx);

// 主循环中直接绘制离屏Canvas
function gameLoop() {
    // 绘制静态背景
    ctx.drawImage(offscreenCanvas, 0, 0);
    
    // 只绘制动态元素
    drawDynamicElements();
    
    requestAnimationFrame(gameLoop);
}
```

JavaScript执行优化可以提升客户端响应速度：

1. 减少重绘和回流：避免频繁修改DOM，使用CSS transforms代替top/left定位。
2. 事件委托：使用事件委托减少事件监听器数量，提高事件处理效率。
3. Web Workers：将复杂计算移至Web Workers，避免阻塞主线程。

#### 架构层面优化

从系统架构层面进行优化可以显著提升系统的可扩展性、稳定性和性能。以下是针对本项目的架构优化建议：

服务端架构优化的核心是提高并发处理能力和系统弹性：

1. 引入房间分区机制：将用户分配到不同的房间(分区)，每个房间由独立的服务实例处理，实现负载分散。这种机制可以将100用户的负载分散到多个进程或服务器，提高系统的整体处理能力。

- 客户端
- 负载均衡器
  - 房间服务器1
    - 房间A
  - 房间服务器N
    - 房间B

1. 引入发布-订阅模式：使用Redis Pub/Sub等消息队列实现房间服务器之间的通信，解耦服务实例，提高系统弹性。
2. 状态管理优化：将用户状态和游戏状态从内存存储迁移到分布式缓存(如Redis)，提高数据访问速度和系统容错能力。
3. 连接池管理：实现WebSocket连接池，复用连接资源，减少连接建立和关闭的开销。

客户端架构优化关注资源加载和状态管理：

1. 资源预加载策略：实现智能资源预加载系统，根据用户行为和游戏状态预测并预加载可能需要的资源。
2. 状态管理优化：引入轻量级状态管理库或实现自定义状态管理模式，统一管理应用状态，减少不必要的重绘和计算。
3. 模块化和代码分割：使用ES模块系统和动态import实现代码分割，减少初始加载时间，实现按需加载。
4. 离线支持：使用Service Worker和IndexedDB实现基本的离线功能，提高应用的可靠性和用户体验。

#### 部署层面优化

部署层面的优化可以显著提升系统的可用性、性能和可维护性。以下是针对本项目的部署优化建议：

服务端部署优化：

1. 使用进程管理工具：采用PM2等进程管理工具启动和监控服务端应用，实现进程崩溃自动重启、负载均衡和资源监控。

```Bash
# 使用PM2启动多个服务实例，实现负载均衡
pm2 start server.js -i max --name "game-server"
```

1. 容器化部署：使用Docker容器化服务端应用，确保环境一致性，简化部署流程，便于水平扩展。

```Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

1. 反向代理配置：使用Nginx作为反向代理，处理SSL终止、请求路由、负载均衡和静态资源服务，提高系统安全性和性能。

```Nginx
server {
    listen 443 ssl;
    server_name game-server.example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # WebSocket代理配置
    location /ws {
        proxy_pass http://game-server-upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
    
    # 静态资源服务
    location /static {
        alias /path/to/static/files;
        expires 1d;
        add_header Cache-Control "public";
    }
}

upstream game-server-upstream {
    server server1:3000;
    server server2:3000;
    server server3:3000;
}
```

1. 水平扩展：通过增加服务器实例和配置负载均衡，实现系统的水平扩展，提高并发处理能力。

客户端部署优化：

1. 静态资源优化：对客户端静态资源(JS、CSS、图片)进行压缩、合并和版本控制，减少加载时间。使用Vite的内置优化功能：

```JavaScript
// vite.config.js
export default defineConfig({
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['lodash', 'three'],
          game: ['src/game'],
          ui: ['src/ui']
        }
      }
    }
  },
  plugins: [
    // 其他插件...
    viteCompression()
  ]
});
```

1. CDN部署：将静态资源部署到CDN(内容分发网络)，利用CDN的边缘节点加速资源加载，减少延迟。
2. 缓存策略：配置合理的HTTP缓存头，利用浏览器缓存减少重复资源加载。对频繁变化的资源使用协商缓存，对稳定资源使用强缓存。
3. 监控和告警：部署应用性能监控(APM)工具，如New Relic或Datadog，实时监控应用性能指标，设置关键指标告警，及时发现和解决问题。

**综合优化建议**: 对于支持100用户同时在线的多人游戏系统，推荐采用"房间分区+容器化部署+CDN加速"的综合优化方案。首先，实现房间机制将用户分散到不同房间，每个房间限制30-50用户；其次，使用Docker容器化服务端应用，通过Kubernetes实现自动扩缩容；最后，将客户端静态资源部署到CDN，配置适当的缓存策略。这种方案可以在保证实时性的同时，最大化系统性能和用户体验。

#### 数据库与存储优化

虽然当前项目采用内存存储用户数据，不依赖数据库，但随着系统扩展，引入持久化存储和优化数据访问变得必要。以下是数据库和存储优化建议：

1. 引入Redis缓存：将用户状态、房间信息等频繁访问的数据存储在Redis中，利用其高性能的内存数据存储和丰富的数据结构，提高数据访问速度。

```JavaScript
// 使用Redis存储用户位置
async function updateUserPosition(userId, position) {
    await redisClient.hSet(`user:${userId}`, 'position', JSON.stringify(position));
    await redisClient.expire(`user:${userId}`, 3600); // 设置过期时间
}

// 从Redis获取用户位置
async function getUserPosition(userId) {
    const positionStr = await redisClient.hGet(`user:${userId}`, 'position');
    return positionStr ? JSON.parse(positionStr) : null;
}
```

1. 数据库选型：根据游戏类型和数据特性选择合适的数据库。对于实时性要求高的游戏数据，可选择MongoDB等文档数据库；对于需要事务支持的数据，可选择PostgreSQL等关系型数据库。
2. 数据分片：当用户量和数据量增长时，采用数据分片策略，将数据分散存储在多个数据库实例中，提高数据处理能力和系统可扩展性。
3. 冷热数据分离：将频繁访问的热数据存储在内存或高速缓存中，将访问频率低的冷数据存储在低成本的持久化存储中，优化存储成本和访问性能。
4. 读写分离：实现数据库读写分离，主库负责写操作，从库负责读操作，提高查询性能和系统可用性。

这些数据库和存储优化策略可以根据系统规模和业务需求逐步实施，确保系统在用户量增长的情况下仍能保持良好的性能和可扩展性。

### 总结

本项目是一个基于Node.js和WebSocket技术构建的多人在线游戏系统，包含模块化的服务端架构和Canvas渲染的客户端实现。系统采用客户端-服务器架构模式，通过WebSocket实现实时双向通信，支持100位用户同时在线，提供用户管理、实时位置同步、房间系统和安全防护等功能。

本文档详细介绍了项目的整体架构，包括服务端的模块化设计和客户端的Canvas渲染引擎；提供了详细的安装运行指南，涵盖服务端和客户端的环境要求、安装步骤和启动方法；阐述了压力测试的实现方式，包括测试脚本使用、测试环境准备、执行步骤和性能监控；解析了项目的目录结构，详细说明了服务端和客户端各文件和目录的功能；深入探讨了核心技术实现，包括WebSocket通信机制、用户管理、消息处理、广播机制和Canvas渲染；最后从代码层面、架构层面、部署层面和数据存储四个维度提供了全面的性能优化建议。

通过本文档的指导，开发者可以快速理解项目架构，搭建开发环境，运行和测试系统功能，并根据性能优化建议进一步提升系统性能。项目的模块化设计和清晰的协议定义也为后续功能扩展和系统升级提供了便利。

**项目核心价值**: 本项目通过模块化设计和WebSocket实时通信技术，构建了一个轻量级但功能完整的多人在线游戏系统。系统无需依赖复杂的游戏引擎和数据库，即可支持100用户同时在线，为小型多人在线游戏提供了经济高效的技术解决方案。项目的架构设计和性能优化策略也可为其他实时Web应用开发提供参考。