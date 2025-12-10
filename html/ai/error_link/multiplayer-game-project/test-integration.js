#!/usr/bin/env node

/**
 * 多人游戏项目集成测试脚本
 * 测试服务端和客户端的基本功能
 */

const WebSocket = require('ws');
const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

// 测试配置
const config = {
    serverPort: process.env.PORT || 3000,
    clientPort: process.env.CLIENT_PORT || 5173,
    serverUrl: `ws://localhost:${process.env.PORT || 3000}`,
    clientUrl: `http://localhost:${process.env.CLIENT_PORT || 5173}`,
    timeout: 10000,
    testTimeout: 30000
};

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

// 测试结果
const results = {
    passed: 0,
    failed: 0,
    tests: []
};

// 日志函数
function log(level, message) {
    const timestamp = new Date().toISOString();
    const levelColors = {
        info: colors.blue,
        success: colors.green,
        error: colors.red,
        warn: colors.yellow
    };
    
    const color = levelColors[level] || colors.reset;
    console.log(`${color}[${timestamp}] ${level.toUpperCase()}${colors.reset} ${message}`);
}

// 延迟函数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 检查端口是否可用
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

// 测试WebSocket连接
async function testWebSocketConnection() {
    log('info', '测试WebSocket连接...');
    
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(config.serverUrl);
        let testPassed = false;
        
        ws.on('open', () => {
            log('success', 'WebSocket连接成功');
            testPassed = true;
            ws.close();
        });
        
        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                if (message.type === 'connected') {
                    log('success', '收到连接确认消息');
                    testPassed = true;
                }
            } catch (error) {
                log('error', `消息解析错误: ${error.message}`);
            }
        });
        
        ws.on('error', (error) => {
            log('error', `WebSocket错误: ${error.message}`);
            reject(error);
        });
        
        ws.on('close', () => {
            if (testPassed) {
                resolve(true);
            } else {
                reject(new Error('WebSocket测试失败'));
            }
        });
        
        // 超时处理
        setTimeout(() => {
            if (ws.readyState !== WebSocket.CLOSED) {
                ws.close();
            }
            if (!testPassed) {
                reject(new Error('WebSocket连接超时'));
            }
        }, config.timeout);
    });
}

// 测试用户登录
async function testUserLogin() {
    log('info', '测试用户登录...');
    
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(config.serverUrl);
        let testPassed = false;
        
        ws.on('open', () => {
            // 发送登录消息
            ws.send(JSON.stringify({
                type: 'login',
                data: { username: '测试用户' }
            }));
        });
        
        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                if (message.type === 'login_success') {
                    log('success', '用户登录成功');
                    testPassed = true;
                    ws.close();
                } else if (message.type === 'login_failed') {
                    log('error', '用户登录失败');
                    ws.close();
                }
            } catch (error) {
                log('error', `消息解析错误: ${error.message}`);
            }
        });
        
        ws.on('error', (error) => {
            log('error', `WebSocket错误: ${error.message}`);
            reject(error);
        });
        
        ws.on('close', () => {
            if (testPassed) {
                resolve(true);
            } else {
                reject(new Error('用户登录测试失败'));
            }
        });
        
        // 超时处理
        setTimeout(() => {
            if (ws.readyState !== WebSocket.CLOSED) {
                ws.close();
            }
            if (!testPassed) {
                reject(new Error('用户登录超时'));
            }
        }, config.timeout);
    });
}

// 测试玩家移动
async function testPlayerMovement() {
    log('info', '测试玩家移动...');
    
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(config.serverUrl);
        let userId = null;
        let testPassed = false;
        
        ws.on('open', () => {
            // 发送登录消息
            ws.send(JSON.stringify({
                type: 'login',
                data: { username: '移动测试用户' }
            }));
        });
        
        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                
                if (message.type === 'login_success') {
                    userId = message.userId;
                    log('info', `用户登录成功，ID: ${userId}`);
                    
                    // 发送移动消息
                    setTimeout(() => {
                        ws.send(JSON.stringify({
                            type: 'move',
                            data: { position: { x: 100, y: 100, z: 0 } }
                        }));
                        log('info', '发送移动消息');
                    }, 1000);
                } else if (message.type === 'user_moved' && message.userId === userId) {
                    log('success', '玩家移动消息接收成功');
                    testPassed = true;
                    ws.close();
                }
            } catch (error) {
                log('error', `消息解析错误: ${error.message}`);
            }
        });
        
        ws.on('error', (error) => {
            log('error', `WebSocket错误: ${error.message}`);
            reject(error);
        });
        
        ws.on('close', () => {
            if (testPassed) {
                resolve(true);
            } else {
                reject(new Error('玩家移动测试失败'));
            }
        });
        
        // 超时处理
        setTimeout(() => {
            if (ws.readyState !== WebSocket.CLOSED) {
                ws.close();
            }
            if (!testPassed) {
                reject(new Error('玩家移动超时'));
            }
        }, config.timeout * 2);
    });
}

// 测试多玩家场景
async function testMultiPlayerScenario() {
    log('info', '测试多玩家场景...');
    
    return new Promise((resolve, reject) => {
        const players = [];
        const playerCount = 3;
        let connectedCount = 0;
        let testPassed = false;
        
        function createPlayer(index) {
            const ws = new WebSocket(config.serverUrl);
            const playerName = `测试玩家${index + 1}`;
            
            ws.on('open', () => {
                ws.send(JSON.stringify({
                    type: 'login',
                    data: { username: playerName }
                }));
            });
            
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    
                    if (message.type === 'login_success') {
                        connectedCount++;
                        log('info', `玩家 ${playerName} 登录成功`);
                        
                        // 所有玩家都登录后，开始移动测试
                        if (connectedCount === playerCount) {
                            setTimeout(() => {
                                // 让所有玩家移动
                                players.forEach((player, i) => {
                                    player.ws.send(JSON.stringify({
                                        type: 'move',
                                        data: { position: { x: i * 50, y: i * 50, z: 0 } }
                                    }));
                                });
                            }, 1000);
                        }
                    } else if (message.type === 'user_moved') {
                        // 检查是否收到所有玩家的移动消息
                        const movedPlayers = new Set();
                        players.forEach(player => {
                            if (player.ws.readyState === WebSocket.OPEN) {
                                movedPlayers.add(player.playerName);
                            }
                        });
                        
                        if (movedPlayers.size === playerCount) {
                            testPassed = true;
                            log('success', '多玩家场景测试通过');
                            
                            // 关闭所有连接
                            players.forEach(player => {
                                if (player.ws.readyState === WebSocket.OPEN) {
                                    player.ws.close();
                                }
                            });
                        }
                    }
                } catch (error) {
                    log('error', `消息解析错误: ${error.message}`);
                }
            });
            
            ws.on('error', (error) => {
                log('error', `玩家 ${playerName} WebSocket错误: ${error.message}`);
            });
            
            players.push({ ws, playerName });
        }
        
        // 创建多个玩家
        for (let i = 0; i < playerCount; i++) {
            createPlayer(i);
        }
        
        // 超时处理
        setTimeout(() => {
            players.forEach(player => {
                if (player.ws.readyState !== WebSocket.CLOSED) {
                    player.ws.close();
                }
            });
            
            if (testPassed) {
                resolve(true);
            } else {
                reject(new Error('多玩家场景测试失败'));
            }
        }, config.timeout * 3);
    });
}

// 测试客户端HTTP服务
async function testClientHttpService() {
    log('info', '测试客户端HTTP服务...');
    
    return new Promise((resolve, reject) => {
        const url = `${config.clientUrl}/index.html`;
        
        http.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200 && data.includes('<html')) {
                    log('success', '客户端HTTP服务正常');
                    resolve(true);
                } else {
                    reject(new Error('客户端HTTP服务返回异常'));
                }
            });
        }).on('error', (error) => {
            log('error', `HTTP请求错误: ${error.message}`);
            reject(error);
        });
    });
}

// 运行测试
async function runTests() {
    log('info', '开始集成测试...');
    log('info', `测试配置: ${JSON.stringify(config, null, 2)}`);
    
    const tests = [
        { name: 'WebSocket连接测试', func: testWebSocketConnection },
        { name: '用户登录测试', func: testUserLogin },
        { name: '玩家移动测试', func: testPlayerMovement },
        { name: '多玩家场景测试', func: testMultiPlayerScenario },
        { name: '客户端HTTP服务测试', func: testClientHttpService }
    ];
    
    for (const test of tests) {
        try {
            log('info', `运行测试: ${test.name}`);
            await test.func();
            results.passed++;
            results.tests.push({ name: test.name, status: 'PASSED' });
            log('success', `✓ ${test.name} 通过`);
        } catch (error) {
            results.failed++;
            results.tests.push({ name: test.name, status: 'FAILED', error: error.message });
            log('error', `✗ ${test.name} 失败: ${error.message}`);
        }
        
        // 测试间隔
        await delay(1000);
    }
    
    // 显示测试结果
    showTestResults();
}

// 显示测试结果
function showTestResults() {
    console.log('\n' + '='.repeat(50));
    log('info', '测试结果汇总');
    console.log('='.repeat(50));
    
    results.tests.forEach(test => {
        const status = test.status === 'PASSED' ? 
            `${colors.green}✓${colors.reset}` : 
            `${colors.red}✗${colors.reset}`;
        console.log(`${status} ${test.name}`);
        if (test.error) {
            console.log(`  ${colors.red}错误: ${test.error}${colors.reset}`);
        }
    });
    
    console.log('\n' + '-'.repeat(50));
    console.log(`总计: ${results.passed + results.failed} 个测试`);
    console.log(`${colors.green}通过: ${results.passed}${colors.reset}`);
    console.log(`${colors.red}失败: ${results.failed}${colors.reset}`);
    console.log('='.repeat(50));
    
    // 退出码
    process.exit(results.failed > 0 ? 1 : 0);
}

// 主函数
async function main() {
    try {
        // 检查端口
        const serverPortAvailable = await checkPort(config.serverPort);
        const clientPortAvailable = await checkPort(config.clientPort);
        
        if (!serverPortAvailable) {
            log('error', `服务端端口 ${config.serverPort} 被占用`);
            process.exit(1);
        }
        
        if (!clientPortAvailable) {
            log('error', `客户端端口 ${config.clientPort} 被占用`);
            process.exit(1);
        }
        
        // 运行测试
        await runTests();
        
    } catch (error) {
        log('error', `测试运行失败: ${error.message}`);
        process.exit(1);
    }
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = { runTests, config };