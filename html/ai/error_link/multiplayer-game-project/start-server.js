#!/usr/bin/env node

/**
 * 多人游戏服务器启动脚本
 * 
 * 这个脚本提供了一个简单的接口来启动和管理游戏服务器
 * 支持开发模式和生产模式
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 配置
const config = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    maxUsers: process.env.MAX_USERS || 100,
    logLevel: process.env.LOG_LEVEL || 'info',
    nodeEnv: process.env.NODE_ENV || 'development'
};

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// 日志函数
function log(level, message) {
    const timestamp = new Date().toISOString();
    const levelColors = {
        info: colors.blue,
        warn: colors.yellow,
        error: colors.red,
        success: colors.green
    };
    
    const color = levelColors[level] || colors.reset;
    console.log(`${colors.cyan}[${timestamp}]${colors.reset} ${color}${level.toUpperCase()}${colors.reset} ${message}`);
}

// 检查依赖
function checkDependencies() {
    try {
        require.resolve('ws');
        require.resolve('uuid');
        log('info', '依赖检查通过');
        return true;
    } catch (error) {
        log('error', `缺少依赖: ${error.message}`);
        log('info', '请运行: npm install');
        return false;
    }
}

// 检查端口是否被占用
function checkPort(port) {
    return new Promise((resolve) => {
        const net = require('net');
        const server = net.createServer();
        
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            } else {
                resolve(true);
            }
        });
        
        server.once('listening', () => {
            server.close();
            resolve(true);
        });
        
        server.listen(port);
    });
}

// 启动服务器
async function startServer() {
    log('info', '正在启动多人游戏服务器...');
    
    // 检查依赖
    if (!checkDependencies()) {
        process.exit(1);
    }
    
    // 检查端口
    const portAvailable = await checkPort(config.port);
    if (!portAvailable) {
        log('error', `端口 ${config.port} 已被占用`);
        process.exit(1);
    }
    
    log('info', `服务器配置:`);
    log('info', `  端口: ${config.port}`);
    log('info', `  主机: ${config.host}`);
    log('info', `  最大用户数: ${config.maxUsers}`);
    log('info', `  环境: ${config.nodeEnv}`);
    log('info', `  日志级别: ${config.logLevel}`);
    
    try {
        // 设置环境变量
        process.env.PORT = config.port;
        process.env.HOST = config.host;
        process.env.MAX_USERS = config.maxUsers;
        process.env.LOG_LEVEL = config.logLevel;
        process.env.NODE_ENV = config.nodeEnv;
        
        // 启动服务器
        const serverPath = path.join(__dirname, 'server', 'index.js');
        
        if (config.nodeEnv === 'development') {
            // 开发模式使用nodemon
            const nodemonPath = path.join(__dirname, 'node_modules', '.bin', 'nodemon');
            
            if (fs.existsSync(nodemonPath)) {
                log('info', '开发模式: 使用 nodemon 启动');
                const child = spawn('node', [nodemonPath, serverPath], {
                    stdio: 'inherit',
                    env: process.env
                });
                
                child.on('error', (error) => {
                    log('error', `启动失败: ${error.message}`);
                    process.exit(1);
                });
            } else {
                log('warn', '未找到 nodemon，使用普通模式启动');
                startProductionServer(serverPath);
            }
        } else {
            // 生产模式
            startProductionServer(serverPath);
        }
        
    } catch (error) {
        log('error', `服务器启动失败: ${error.message}`);
        process.exit(1);
    }
}

function startProductionServer(serverPath) {
    log('info', '生产模式: 启动服务器');
    
    const child = spawn('node', [serverPath], {
        stdio: 'inherit',
        env: process.env
    });
    
    child.on('error', (error) => {
        log('error', `启动失败: ${error.message}`);
        process.exit(1);
    });
    
    child.on('exit', (code) => {
        if (code !== 0) {
            log('error', `服务器退出，代码: ${code}`);
            process.exit(code);
        }
    });
}

// 显示帮助信息
function showHelp() {
    console.log(`
${colors.cyan}多人游戏服务器启动脚本${colors.reset}

${colors.yellow}用法:${colors.reset}
  node start-server.js [选项]

${colors.yellow}选项:${colors.reset}
  --port, -p <端口>       服务器端口 (默认: 3000)
  --host, -h <主机>       服务器主机 (默认: localhost)
  --max-users, -m <数量>  最大用户数 (默认: 100)
  --env, -e <环境>        运行环境 (默认: development)
  --log-level, -l <级别>  日志级别 (默认: info)
  --help                   显示帮助信息

${colors.yellow}示例:${colors.reset}
  node start-server.js --port 8080 --max-users 200
  node start-server.js -p 3000 -m 50 -e production

${colors.yellow}环境变量:${colors.reset}
  PORT                    服务器端口
  HOST                    服务器主机
  MAX_USERS               最大用户数
  NODE_ENV                运行环境
  LOG_LEVEL               日志级别

${colors.green}更多信息请查看 README.md${colors.reset}
    `);
}

// 解析命令行参数
function parseArgs() {
    const args = process.argv.slice(2);
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        const nextArg = args[i + 1];
        
        switch (arg) {
            case '--help':
                showHelp();
                process.exit(0);
                break;
            case '--port':
            case '-p':
                if (nextArg) {
                    config.port = parseInt(nextArg);
                    i++;
                }
                break;
            case '--host':
            case '-h':
                if (nextArg) {
                    config.host = nextArg;
                    i++;
                }
                break;
            case '--max-users':
            case '-m':
                if (nextArg) {
                    config.maxUsers = parseInt(nextArg);
                    i++;
                }
                break;
            case '--env':
            case '-e':
                if (nextArg) {
                    config.nodeEnv = nextArg;
                    i++;
                }
                break;
            case '--log-level':
            case '-l':
                if (nextArg) {
                    config.logLevel = nextArg;
                    i++;
                }
                break;
        }
    }
}

// 主函数
function main() {
    // 处理退出信号
    process.on('SIGINT', () => {
        log('info', '正在关闭服务器...');
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        log('info', '收到终止信号，正在关闭服务器...');
        process.exit(0);
    });
    
    // 解析命令行参数
    parseArgs();
    
    // 启动服务器
    startServer();
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = { startServer, config };