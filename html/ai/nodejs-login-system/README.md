# Node.js 登录系统

一个基于 Node.js + Express + MySQL + JWT 的生产级用户认证系统，提供了完整的用户注册、登录、信息查询等功能。

## 🚀 项目特性

- ✅ **用户注册** - 支持用户名唯一性校验，密码加密存储（BCrypt）
- ✅ **用户登录** - JWT Token认证，支持Token过期机制
- ✅ **用户信息查询** - 获取当前登录用户信息
- ✅ **密码修改** - 支持用户修改密码功能
- ✅ **用户管理** - 获取用户列表、删除用户（管理员功能）
- ✅ **参数验证** - 全面的输入参数校验
- ✅ **安全防护** - 防SQL注入、密码加密、速率限制
- ✅ **统一响应** - 标准化的API响应格式
- ✅ **异常处理** - 完善的错误处理机制
- ✅ **生产就绪** - 包含部署脚本和健康检查

## 📋 技术栈

- **后端框架**: Node.js + Express.js
- **数据库**: MySQL 8.0+
- **认证机制**: JWT (JSON Web Token)
- **密码加密**: BCrypt
- **参数验证**: express-validator
- **安全防护**: helmet, cors, express-rate-limit
- **环境配置**: dotenv
- **开发工具**: nodemon (开发模式)

## 📦 环境要求

- **Node.js**: 14.0.0 或更高版本
- **MySQL**: 8.0.0 或更高版本
- **npm**: 6.0.0 或更高版本

## 🔧 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd nodejs-login-system
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境配置文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置您的数据库连接信息：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nodejs_login
DB_USER=root
DB_PASSWORD=your_password

# JWT配置
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# 服务器配置
PORT=3000
NODE_ENV=development
```

### 4. 初始化数据库

执行SQL脚本创建数据库和表：

```bash
mysql -u root -p < sql/init.sql
```

### 5. 启动应用

**开发模式**（支持热重载）：

```bash
npm run dev
```

**生产模式**：

```bash
npm start
```

### 6. 验证部署

访问健康检查接口：

```bash
curl http://localhost:3000/health
```

预期响应：

```json
{
  "code": 200,
  "msg": "服务运行正常",
  "data": {
    "status": "healthy",
    "timestamp": "2025-12-16T03:34:43.123Z",
    "uptime": 12.345
  }
}
```

## 📚 API接口文档

### 基础信息

- **Base URL**: `http://localhost:3000`
- **认证方式**: Bearer Token
- **响应格式**: JSON统一格式

### 响应格式说明

所有接口返回统一格式的JSON数据：

```json
{
  "code": 200,        // 状态码
  "msg": "操作成功",    // 消息描述
  "data": {}          // 响应数据
}
```

### 接口列表

#### 1. 用户注册

**POST** `/api/user/register`

**描述**: 创建新用户账户

**请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | string | 是 | 用户名，3-20个字符，支持字母、数字、下划线 |
| password | string | 是 | 密码，6-50个字符，必须包含大小写字母和数字 |

**请求示例**:

```json
{
  "username": "testuser",
  "password": "Test123456"
}
```

**成功响应** (201):

```json
{
  "code": 200,
  "msg": "用户注册成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "created_at": "2025-12-16T03:34:43.123Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应** (409):

```json
{
  "code": 409,
  "msg": "用户名已存在",
  "data": null
}
```

#### 2. 用户登录

**POST** `/api/user/login`

**描述**: 用户身份验证

**请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**请求示例**:

```json
{
  "username": "testuser",
  "password": "Test123456"
}
```

**成功响应** (200):

```json
{
  "code": 200,
  "msg": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应** (401):

```json
{
  "code": 401,
  "msg": "用户名或密码错误",
  "data": null
}
```

#### 3. 获取用户信息

**GET** `/api/user/info`

**描述**: 获取当前登录用户的信息

**请求头**:

```
Authorization: Bearer <token>
```

**成功响应** (200):

```json
{
  "code": 200,
  "msg": "获取用户信息成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "created_at": "2025-12-16T03:34:43.123Z",
    "updated_at": "2025-12-16T03:34:43.123Z"
  }
}
```

**错误响应** (401):

```json
{
  "code": 401,
  "msg": "Token已过期，请重新登录",
  "data": null
}
```

#### 4. 修改密码

**PUT** `/api/user/change-password`

**描述**: 修改当前用户的密码

**请求头**:

```
Authorization: Bearer <token>
```

**请求参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| oldPassword | string | 是 | 当前密码 |
| newPassword | string | 是 | 新密码，6-50个字符，必须包含大小写字母和数字 |

**请求示例**:

```json
{
  "oldPassword": "Test123456",
  "newPassword": "NewPass123"
}
```

**成功响应** (200):

```json
{
  "code": 200,
  "msg": "密码修改成功",
  "data": null
}
```

#### 5. 获取用户列表

**GET** `/api/user/list`

**描述**: 获取所有用户的列表（管理员功能）

**请求头**:

```
Authorization: Bearer <token>
```

**成功响应** (200):

```json
{
  "code": 200,
  "msg": "获取用户列表成功",
  "data": [
    {
      "id": 1,
      "username": "testuser",
      "created_at": "2025-12-16T03:34:43.123Z",
      "updated_at": "2025-12-16T03:34:43.123Z"
    }
  ]
}
```

#### 6. 删除用户

**DELETE** `/api/user/:id`

**描述**: 删除指定用户（管理员功能）

**请求头**:

```
Authorization: Bearer <token>
```

**路径参数**:

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | number | 是 | 要删除的用户ID |

**成功响应** (200):

```json
{
  "code": 200,
  "msg": "用户删除成功",
  "data": null
}
```

**错误响应** (403):

```json
{
  "code": 403,
  "msg": "不能删除自己的账户",
  "data": null
}
```

## 🧪 测试方法

### 使用curl进行测试

#### 1. 注册用户

```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123456"
  }'
```

#### 2. 用户登录

```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123456"
  }'
```

#### 3. 获取用户信息

```bash
# 将 YOUR_TOKEN 替换为实际获取到的token
curl -X GET http://localhost:3000/api/user/info \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 4. 修改密码

```bash
curl -X PUT http://localhost:3000/api/user/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "oldPassword": "Test123456",
    "newPassword": "NewPass123"
  }'
```

### 使用Postman进行测试

1. 导入以下curl命令到Postman
2. 设置环境变量 `base_url` 为 `http://localhost:3000`
3. 登录后将返回的token设置为环境变量 `token`
4. 在需要认证的请求中使用 `{{token}}` 变量

## 🔒 安全特性

- **密码加密**: 使用BCrypt进行密码哈希，salt rounds为10
- **JWT认证**: Token有效期24小时，支持过期自动失效
- **参数验证**: 严格的输入参数校验，防止恶意输入
- **速率限制**: IP级别的请求频率限制，防止暴力破解
- **安全头**: 使用helmet设置安全HTTP头
- **CORS配置**: 跨域请求安全配置
- **错误处理**: 不会泄露敏感的错误信息

## 📁 项目结构

```
nodejs-login-system/
├── src/                          # 源代码目录
│   ├── app.js                   # 应用主入口文件
│   ├── config/                  # 配置文件
│   │   └── database.js          # 数据库连接配置
│   ├── controllers/             # 控制器层
│   │   └── userController.js    # 用户控制器
│   ├── middleware/              # 中间件
│   │   ├── auth.js             # JWT认证中间件
│   │   └── validation.js       # 参数验证中间件
│   ├── models/                  # 数据模型层
│   │   └── User.js             # 用户模型
│   ├── routes/                  # 路由定义
│   │   └── user.js             # 用户相关路由
│   └── utils/                   # 工具函数
│       ├── jwt.js              # JWT工具类
│       └── response.js         # 统一响应格式
├── sql/                         # SQL脚本
│   └── init.sql                # 数据库初始化脚本
├── scripts/                     # 部署脚本
│   └── setup.sh                # 自动部署脚本
├── package.json                 # 项目依赖配置
├── .env.example                 # 环境变量示例
└── README.md                    # 项目文档
```

## 🚀 部署指南

### 使用自动部署脚本

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 手动部署步骤

1. **环境准备**
   ```bash
   # 安装Node.js 14+ 和 MySQL 8.0+
   # 确保服务正常运行
   ```

2. **项目部署**
   ```bash
   # 复制项目到服务器
   # 安装依赖
   npm install
   
   # 配置环境变量
   cp .env.example .env
   # 编辑 .env 文件
   
   # 初始化数据库
   mysql -u root -p < sql/init.sql
   ```

3. **启动应用**
   ```bash
   # 生产环境
   npm start
   
   # 或使用PM2等进程管理器
   pm2 start src/app.js --name "nodejs-login"
   ```

### Docker部署（可选）

```dockerfile
# Dockerfile示例
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# 构建镜像
docker build -t nodejs-login-system .

# 运行容器
docker run -d -p 3000:3000 --env-file .env nodejs-login-system
```

## 🔧 环境变量配置

| 变量名 | 描述 | 默认值 | 必填 |
|--------|------|--------|------|
| DB_HOST | MySQL主机地址 | localhost | 是 |
| DB_PORT | MySQL端口 | 3306 | 否 |
| DB_NAME | 数据库名称 | nodejs_login | 是 |
| DB_USER | 数据库用户 | root | 是 |
| DB_PASSWORD | 数据库密码 | - | 是 |
| JWT_SECRET | JWT密钥 | - | 是 |
| JWT_EXPIRES_IN | Token有效期 | 24h | 否 |
| PORT | 应用端口 | 3000 | 否 |
| NODE_ENV | 运行环境 | development | 否 |

## 📝 开发指南

### 添加新功能

1. **创建模型** - 在 `src/models/` 目录下创建数据模型
2. **创建控制器** - 在 `src/controllers/` 目录下创建控制器
3. **定义路由** - 在 `src/routes/` 目录下创建路由文件
4. **添加验证** - 在 `src/middleware/validation.js` 中添加参数验证规则
5. **更新文档** - 同步更新API文档

### 数据库迁移

当需要修改数据库结构时：

1. 创建新的SQL迁移脚本
2. 在模型中更新相应的查询逻辑
3. 测试数据迁移过程
4. 更新部署文档

## 🐛 常见问题

### Q: 数据库连接失败怎么办？

**A**: 检查以下几点：
- 确认MySQL服务正在运行
- 检查数据库连接配置是否正确
- 确认数据库用户有访问权限
- 检查防火墙设置

### Q: Token验证失败？

**A**: 可能的原因：
- Token已过期（默认24小时）
- JWT_SECRET配置不一致
- Token格式不正确（需要Bearer前缀）

### Q: 密码加密失败？

**A**: 确保：
- BCrypt库正确安装
- 密码长度符合要求（6-50字符）
- 包含要求的字符类型

### Q: 部署后接口无法访问？

**A**: 检查：
- 应用是否成功启动
- 端口是否被占用
- 防火墙是否放行端口
- 路由配置是否正确

## 🤝 贡献指南

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Express.js](https://expressjs.com/) - Web应用框架
- [MySQL2](https://github.com/sidorares/node-mysql2) - MySQL客户端
- [JWT](https://jwt.io/) - JSON Web Token标准
- [BCrypt](https://github.com/kelektiv/node.bcrypt.js) - 密码加密库

---

**⭐ 如果这个项目对您有帮助，请给个Star支持一下！**
