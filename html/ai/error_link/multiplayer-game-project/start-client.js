#!/usr/bin/env node

/**
 * 多人游戏客户端启动脚本
 * 
 * 这个脚本提供了一个简单的接口来启动客户端开发服务器
 * 支持热重载和构建
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const url = require('url');

// 配置
const config = {
    port: process.env.CLIENT_PORT || 5173,
    host: process.env.CLIENT_HOST || 'localhost',
    serverPort: process.env.SERVER_PORT || 3000,
    serverHost: process.env.SERVER_HOST || 'localhost',
    openBrowser: process.env.OPEN_BROWSER !== 'false',
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

// 简单的静态文件服务器
function createStaticServer() {
    const clientPath = path.join(__dirname, 'client');
    
    const server = http.createServer((req, res) => {
        const parsedUrl = url.parse(req.url);
        let pathname = parsedUrl.pathname;
        
        // 默认文件
        if (pathname === '/') {
            pathname = '/index.html';
        }
        
        // 文件路径
        const filePath = path.join(clientPath, pathname);
        
        // 安全检查
        if (!filePath.startsWith(clientPath)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }
        
        // 检查文件是否存在
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }
            
            // 读取并返回文件
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Internal server error');
                    return;
                }
                
                // 设置内容类型
                const ext = path.extname(filePath).toLowerCase();
                const contentTypes = {
                    '.html': 'text/html',
                    '.js': 'application/javascript',
                    '.css': 'text/css',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.gif': 'image/gif',
                    '.svg': 'image/svg+xml'
                };
                
                const contentType = contentTypes[ext] || 'application/octet-stream';
                
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                });
                
                res.end(data);
            });
        });
    });
    
    return server;
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

// 启动客户端开发服务器
async function startClient() {
    log('info', '正在启动游戏客户端...');
    
    // 检查端口
    const portAvailable = await checkPort(config.port);
    if (!portAvailable) {
        log('error', `端口 ${config.port} 已被占用`);
        process.exit(1);
    }
    
    log('info', `客户端配置:`);
    log('info', `  端口: ${config.port}`);
    log('info', `  主机: ${config.host}`);
    log('info', `  服务器: ${config.serverHost}:${config.serverPort}`);
    log('info', `  环境: ${config.nodeEnv}`);
    
    try {
        // 检查是否有Vite
        const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
        const hasVite = fs.existsSync(vitePath);
        
        if (hasVite && config.nodeEnv === 'development') {
            // 使用Vite开发服务器
            log('info', '开发模式: 使用 Vite 启动');
            startViteClient(vitePath);
        } else {
            // 使用简单的静态文件服务器
            log('info', '使用静态文件服务器');
            startStaticServer();
        }
        
    } catch (error) {
        log('error', `客户端启动失败: ${error.message}`);
        process.exit(1);
    }
}

function startViteClient(vitePath) {
    const clientPath = path.join(__dirname, 'client');
    
    const args = ['--host', config.host, '--port', config.port];
    
    if (config.openBrowser) {
        args.push('--open');
    }
    
    log('info', `运行命令: vite ${args.join(' ')}`);
    
    const child = spawn('node', [vitePath, ...args], {
        cwd: clientPath,
        stdio: 'inherit',
        env: {
            ...process.env,
            CLIENT_PORT: config.port,
            CLIENT_HOST: config.host,
            SERVER_PORT: config.serverPort,
            SERVER_HOST: config.serverHost
        }
    });
    
    child.on('error', (error) => {
        log('error', `Vite启动失败: ${error.message}`);
        log('info', '回退到静态文件服务器');
        startStaticServer();
    });
    
    child.on('exit', (code) => {
        if (code !== 0) {
            log('error', `Vite退出，代码: ${code}`);
        }
    });
}

function startStaticServer() {
    const server = createStaticServer();
    
    server.listen(config.port, config.host, () => {
        log('success', `客户端服务器启动成功`);
        log('info', `访问地址: http://${config.host}:${config.port}`);
        log('info', `客户端文件路径: ${path.join(__dirname, 'client')}`);
        
        if (config.openBrowser) {
            // 尝试打开浏览器
            setTimeout(() => {
                const open = require('child_process');
                const url = `http://${config.host}:${config.port}`;
                
                // 根据不同操作系统使用不同的命令
                const commands = {
                    darwin: 'open',
                    win32: 'start',
                    linux: 'xdg-open'
                };
                
                const command = commands[process.platform];
                if (command) {
                    try {
                        open.exec(`${command} ${url}`);
                        log('info', `已尝试打开浏览器: ${url}`);
                    } catch (error) {
                        log('warn', `无法自动打开浏览器，请手动访问: ${url}`);
                    }
                } else {
                    log('info', `请手动访问: ${url}`);
                }
            }, 1000);
        }
    });
    
    server.on('error', (error) => {
        log('error', `服务器错误: ${error.message}`);
        process.exit(1);
    });
}

// 构建客户端
function buildClient() {
    log('info', '正在构建客户端...');
    
    try {
        const clientPath = path.join(__dirname, 'client');
        
        // 检查是否有Vite
        const vitePath = path.join(__dirname, 'node_modules', '.bin', 'vite');
        const hasVite = fs.existsSync(vitePath);
        
        if (hasVite) {
            // 使用Vite构建
            log('info', '使用 Vite 构建');
            
            const child = spawn('node', [vitePath, 'build'], {
                cwd: clientPath,
                stdio: 'inherit',
                env: process.env
            });
            
            child.on('error', (error) => {
                log('error', `构建失败: ${error.message}`);
                process.exit(1);
            });
            
            child.on('exit', (code) => {
                if (code === 0) {
                    log('success', '客户端构建成功');
                    log('info', `构建输出: ${path.join(clientPath, 'dist')}`);
                } else {
                    log('error', `构建失败，退出代码: ${code}`);
                    process.exit(code);
                }
            });
        } else {
            log('error', '未找到 Vite，无法构建');
            log('info', '请运行: npm install');
            process.exit(1);
        }
        
    } catch (error) {
        log('error', `构建失败: ${error.message}`);
        process.exit(1);
    }
}

// 显示帮助信息
function showHelp() {
    console.log(`
${colors.cyan}多人游戏客户端启动脚本${colors.reset}

${colors.yellow}用法:${colors.reset}
  node start-client.js [命令] [选项]

${colors.yellow}命令:${colors.reset}
  dev                     启动开发服务器 (默认)
  build                   构建生产版本
  --help                  显示帮助信息

${colors.yellow}选项:${colors.reset}
  --port, -p <端口>       客户端端口 (默认: 5173)
  --host, -h <主机>       客户端主机 (默认: localhost)
  --server-port <端口>    服务端端口 (默认: 3000)
  --server-host <主机>   服务端主机 (默认: localhost)
  --no-open               不自动打开浏览器

${colors.yellow}示例:${colors.reset}
  node start-client.js dev --port 8080
  node start-client.js build
  node start-client.js --help

${colors.yellow}环境变量:${colors.reset}
  CLIENT_PORT             客户端端口
  CLIENT_HOST             客户端主机
  SERVER_PORT             服务端端口
  SERVER_HOST             服务端主机
  OPEN_BROWSER            是否自动打开浏览器

${colors.green}更多信息请查看 README.md${colors.reset}
    `);
}

// 解析命令行参数
function parseArgs() {
    const args = process.argv.slice(2);
    let command = 'dev'; // 默认命令
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        const nextArg = args[i + 1];
        
        // 处理命令
        if (arg === 'dev' || arg === 'build') {
            command = arg;
            continue;
        }
        
        // 处理选项
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
            case '--server-port':
                if (nextArg) {
                    config.serverPort = parseInt(nextArg);
                    i++;
                }
                break;
            case '--server-host':
                if (nextArg) {
                    config.serverHost = nextArg;
                    i++;
                }
                break;
            case '--no-open':
                config.openBrowser = false;
                break;
        }
    }
    
    return command;
}

// 主函数
function main() {
    // 处理退出信号
    process.on('SIGINT', () => {
        log('info', '正在关闭客户端...');
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        log('info', '收到终止信号，正在关闭客户端...');
        process.exit(0);
    });
    
    // 解析命令行参数
    const command = parseArgs();
    
    // 执行命令
    switch (command) {
        case 'dev':
            startClient();
            break;
        case 'build':
            buildClient();
            break;
        default:
            log('error', `未知命令: ${command}`);
            showHelp();
            process.exit(1);
    }
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = { startClient, buildClient, config };