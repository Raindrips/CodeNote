/**
 * Node.js登录系统主应用
 * 基于Express框架，MySQL数据库，JWT认证
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');
const userRoutes = require('./routes/user');
const { success, error } = require('./utils/response');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * 全局中间件配置
 */

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || false 
    : true,
  credentials: true
}));

// 请求体解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP每15分钟100个请求
  message: '请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 更严格的注册/登录速率限制
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 限制每个IP每15分钟5个认证请求
  message: '认证请求过于频繁，请15分钟后再试',
  skipSuccessfulRequests: false,
});

/**
 * 健康检查接口
 */
app.get('/health', (req, res) => {
  res.json(success({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  }, '服务运行正常'));
});

/**
 * API路由
 */
app.use('/api/user', authLimiter, userRoutes);

/**
 * 404处理
 */
app.use('*', (req, res) => {
  res.status(404).json(error('接口不存在', 404));
});

/**
 * 全局错误处理中间件
 */
app.use((err, req, res, next) => {
  console.error('全局错误处理:', err);
  
  // 处理特定类型的错误
  if (err.name === 'ValidationError') {
    return res.status(400).json(error('参数验证失败: ' + err.message, 400));
  }
  
  if (err.code === 'ECONNREFUSED') {
    return res.status(500).json(error('数据库连接失败', 500));
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(error('Token验证失败', 401));
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(error('Token已过期', 401));
  }
  
  // 默认错误响应
  res.status(500).json(error(
    process.env.NODE_ENV === 'production' 
      ? '服务器内部错误' 
      : err.message || '未知错误',
    500
  ));
});

/**
 * 启动服务器
 */
async function startServer() {
  try {
    // 测试数据库连接
    await testConnection();
    console.log('🔄 正在测试数据库连接...');
    
    // 启动HTTP服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器启动成功`);
      console.log(`📡 运行端口: ${PORT}`);
      console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 健康检查: http://localhost:${PORT}/health`);
      console.log(`📚 API文档: http://localhost:${PORT}/health`);
      console.log('========================================');
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error.message);
    process.exit(1);
  }
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  process.exit(1);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到SIGINT信号，正在关闭服务器...');
  process.exit(0);
});

// 启动应用
startServer();

module.exports = app;
