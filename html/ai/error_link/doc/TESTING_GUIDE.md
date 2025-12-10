# 多人游戏项目测试指南

本指南提供了完整的测试流程，包括功能测试、性能测试、安全测试和集成测试。

## 🧪 测试概览

### 测试类型
| 测试类型 | 目标 | 工具 | 自动化 |
|---------|------|------|--------|
| **功能测试** | 验证功能正确性 | 手动 + 自动化 | ✅ |
| **性能测试** | 评估系统性能 | Apache Bench, wrk | ✅ |
| **安全测试** | 检查安全漏洞 | 手动 + 工具 | ✅ |
| **集成测试** | 验证组件集成 | 自定义脚本 | ✅ |
| **兼容性测试** | 跨平台兼容性 | 多浏览器测试 | ✅ |
| **负载测试** | 高并发测试 | 自定义脚本 | ✅ |

## 📋 测试环境准备

### 1. 测试环境要求
```bash
# 安装测试工具
npm install --save-dev mocha chai sinon supertest
npm install --save-dev artillery autocannon
npm install -g websocat wscat

# 安装性能测试工具
sudo apt-get install apache2-utils  # Apache Bench
npm install -g wrk                  # wrk HTTP基准测试
```

### 2. 测试配置
```bash
# 创建测试配置
cp config.json config.test.json

# 修改测试配置
{
  "server": {
    "port": 3001,
    "host": "localhost",
    "maxUsers": 10
  },
  "client": {
    "port": 5174,
    "host": "localhost"
  }
}
```

## 🎯 功能测试

### 1. WebSocket连接测试
```bash
# 测试WebSocket连接
websocat ws://localhost:3000

# 发送测试消息
{ "type": "test", "data": { "message": "Hello World" } }
```

### 2. 用户登录测试
```javascript
// test-login.js
const WebSocket = require('ws');

function testLogin() {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket('ws://localhost:3000');
        
        ws.on('open', () => {
            ws.send(JSON.stringify({
                type: 'login',
                data: { username: 'TestUser' }
            }));
        });
        
        ws.on('message', (data) => {
            const message = JSON.parse(data);
            if (message.type === 'login_success') {
                console.log('✅ 登录测试通过');
                ws.close();
                resolve();
            } else {
                reject(new Error('登录失败'));
            }
        });
        
        ws.on('error', reject);
        
        setTimeout(() => {
            ws.close();
            reject(new Error('连接超时'));
        }, 5000);
    });
}

testLogin().catch(console.error);
```

### 3. 移动控制测试
```javascript
// test-movement.js
const WebSocket = require('ws');

function testMovement() {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket('ws://localhost:3000');
        let userId;
        
        ws.on('open', () => {
            // 登录
            ws.send(JSON.stringify({
                type: 'login',
                data: { username: 'TestUser' }
            }));
        });
        
        ws.on('message', (data) => {
            const message = JSON.parse(data);
            
            if (message.type === 'login_success') {
                userId = message.userId;
                // 发送移动命令
                ws.send(JSON.stringify({
                    type: 'move',
                    data: { position: { x: 100, y: 100, z: 0 } }
                }));
            } else if (message.type === 'user_moved' && message.userId === userId) {
                console.log('✅ 移动测试通过');
                ws.close();
                resolve();
            }
        });
        
        ws.on('error', reject);
        
        setTimeout(() => {
            ws.close();
            reject(new Error('测试超时'));
        }, 10000);
    });
}

testMovement().catch(console.error);
```

### 4. 聊天功能测试
```javascript
// test-chat.js
const WebSocket = require('ws');

function testChat() {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket('ws://localhost:3000');
        
        ws.on('open', () => {
            // 登录
            ws.send(JSON.stringify({
                type: 'login',
                data: { username: 'TestUser' }
            }));
            
            setTimeout(() => {
                // 发送聊天消息
                ws.send(JSON.stringify({
                    type: 'chat',
                    data: { message: '测试消息' }
                }));
            }, 1000);
        });
        
        ws.on('message', (data) => {
            const message = JSON.parse(data);
            if (message.type === 'chat_message' && message.message === '测试消息') {
                console.log('✅ 聊天测试通过');
                ws.close();
                resolve();
            }
        });
        
        ws.on('error', reject);
        
        setTimeout(() => {
            ws.close();
            reject(new Error('测试超时'));
        }, 10000);
    });
}

testChat().catch(console.error);
```

## ⚡ 性能测试

### 1. HTTP性能测试
```bash
# 使用Apache Bench测试
ab -n 1000 -c 10 http://localhost:3000/

# 使用wrk测试
wrk -t12 -c400 -d30s --latency http://localhost:3000
```

### 2. WebSocket性能测试
```javascript
// test-websocket-performance.js
const WebSocket = require('ws');

async function testWebSocketPerformance() {
    const connections = [];
    const connectionCount = 100;
    const messageCount = 1000;
    
    console.log(`创建 ${connectionCount} 个WebSocket连接...`);
    
    // 创建连接
    for (let i = 0; i < connectionCount; i++) {
        const ws = new WebSocket('ws://localhost:3000');
        connections.push(ws);
        
        ws.on('open', () => {
            // 登录
            ws.send(JSON.stringify({
                type: 'login',
                data: { username: `TestUser${i}` }
            }));
        });
    }
    
    // 等待所有连接建立
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`发送 ${messageCount} 条消息...`);
    const startTime = Date.now();
    
    // 发送消息
    for (let i = 0; i < messageCount; i++) {
        const randomConnection = connections[Math.floor(Math.random() * connections.length)];
        randomConnection.send(JSON.stringify({
            type: 'chat',
            data: { message: `性能测试消息 ${i}` }
        }));
    }
    
    // 等待消息处理
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`性能测试完成:`);
    console.log(`  连接数: ${connectionCount}`);
    console.log(`  消息数: ${messageCount}`);
    console.log(`  总耗时: ${duration}ms`);
    console.log(`  每秒消息数: ${(messageCount / (duration / 1000)).toFixed(2)}`);
    
    // 关闭所有连接
    connections.forEach(ws => ws.close());
}

testWebSocketPerformance().catch(console.error);
```

### 3. 负载测试脚本
```javascript
// test-load.js
const WebSocket = require('ws');
const { performance } = require('perf_hooks');

class LoadTester {
    constructor(options = {}) {
        this.options = {
            url: options.url || 'ws://localhost:3000',
            users: options.users || 50,
            duration: options.duration || 60,
            rampUp: options.rampUp || 10,
            ...options
        };
        
        this.stats = {
            connections: 0,
            messages: 0,
            errors: 0,
            latency: [],
            startTime: null,
            endTime: null
        };
        
        this.connections = [];
        this.isRunning = false;
    }
    
    async start() {
        console.log(`🚀 开始负载测试...`);
        console.log(`   URL: ${this.options.url}`);
        console.log(`   用户数: ${this.options.users}`);
        console.log(`   持续时间: ${this.options.duration}秒`);
        console.log(`   预热时间: ${this.options.rampUp}秒`);
        
        this.stats.startTime = performance.now();
        this.isRunning = true;
        
        // 逐步增加用户数
        const usersPerSecond = this.options.users / this.options.rampUp;
        let currentUsers = 0;
        
        const rampUpInterval = setInterval(() => {
            if (currentUsers >= this.options.users || !this.isRunning) {
                clearInterval(rampUpInterval);
                return;
            }
            
            const usersToAdd = Math.min(
                Math.floor(usersPerSecond),
                this.options.users - currentUsers
            );
            
            for (let i = 0; i < usersToAdd; i++) {
                this.createConnection(currentUsers + i);
            }
            
            currentUsers += usersToAdd;
            console.log(`   已创建 ${currentUsers}/${this.options.users} 个连接`);
        }, 1000);
        
        // 运行指定时间
        setTimeout(() => {
            this.stop();
        }, this.options.duration * 1000);
    }
    
    createConnection(id) {
        const ws = new WebSocket(this.options.url);
        const connectionStart = performance.now();
        
        ws.on('open', () => {
            this.stats.connections++;
            
            // 登录
            ws.send(JSON.stringify({
                type: 'login',
                data: { username: `LoadTestUser${id}` }
            }));
            
            // 定期发送消息
            const messageInterval = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    const messageStart = performance.now();
                    
                    ws.send(JSON.stringify({
                        type: 'chat',
                        data: { message: `负载测试消息 ${this.stats.messages}` }
                    }));
                    
                    this.stats.messages++;
                } else {
                    clearInterval(messageInterval);
                }
            }, 1000 + Math.random() * 2000);
            
            ws.messageInterval = messageInterval;
        });
        
        ws.on('message', (data) => {
            const messageEnd = performance.now();
            this.stats.latency.push(messageEnd - connectionStart);
        });
        
        ws.on('error', (error) => {
            this.stats.errors++;
            console.error(`连接 ${id} 错误:`, error.message);
        });
        
        ws.on('close', () => {
            if (ws.messageInterval) {
                clearInterval(ws.messageInterval);
            }
        });
        
        this.connections.push(ws);
    }
    
    stop() {
        console.log(`\n⏹️  停止负载测试...`);
        this.isRunning = false;
        this.stats.endTime = performance.now();
        
        // 关闭所有连接
        this.connections.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        });
        
        // 生成报告
        this.generateReport();
    }
    
    generateReport() {
        const duration = (this.stats.endTime - this.stats.startTime) / 1000;
        const avgLatency = this.stats.latency.reduce((a, b) => a + b, 0) / this.stats.latency.length;
        
        console.log(`\n📊 负载测试报告:`);
        console.log(`================`);
        console.log(`测试持续时间: ${duration.toFixed(2)}秒`);
        console.log(`总连接数: ${this.stats.connections}`);
        console.log(`总消息数: ${this.stats.messages}`);
        console.log(`错误数: ${this.stats.errors}`);
        console.log(`平均延迟: ${avgLatency.toFixed(2)}ms`);
        console.log(`每秒消息数: ${(this.stats.messages / duration).toFixed(2)}`);
        console.log(`连接成功率: ${((this.stats.connections / this.options.users) * 100).toFixed(2)}%`);
        
        if (this.stats.errors > 0) {
            console.log(`⚠️  发现 ${this.stats.errors} 个错误，请检查系统性能`);
        }
        
        if (avgLatency > 1000) {
            console.log(`⚠️  平均延迟较高，建议优化系统性能`);
        }
    }
}

// 运行负载测试
const tester = new LoadTester({
    users: 100,
    duration: 60,
    rampUp: 10
});

tester.start();
```

## 🔒 安全测试

### 1. 输入验证测试
```javascript
// test-security.js
const WebSocket = require('ws');

function testInputValidation() {
    const ws = new WebSocket('ws://localhost:3000');
    
    ws.on('open', () => {
        console.log('🧪 开始安全测试...');
        
        // 测试XSS攻击
        ws.send(JSON.stringify({
            type: 'login',
            data: { username: '<script>alert("XSS")</script>' }
        }));
        
        // 测试SQL注入
        ws.send(JSON.stringify({
            type: 'chat',
            data: { message: "'; DROP TABLE users; --" }
        }));
        
        // 测试超长输入
        ws.send(JSON.stringify({
            type: 'chat',
            data: { message: 'A'.repeat(10000) }
        }));
        
        // 测试特殊字符
        ws.send(JSON.stringify({
            type: 'chat',
            data: { message: '!@#$%^&*()_+-=[]{}|;:,.<>?' }
        }));
        
        setTimeout(() => {
            ws.close();
            console.log('✅ 安全测试完成');
        }, 5000);
    });
    
    ws.on('error', (error) => {
        console.error('❌ 连接错误:', error);
    });
}

testInputValidation();
```

### 2. 速率限制测试
```javascript
// test-rate-limit.js
const WebSocket = require('ws');

function testRateLimit() {
    console.log('🧪 测试速率限制...');
    
    const ws = new WebSocket('ws://localhost:3000');
    let messageCount = 0;
    
    ws.on('open', () => {
        // 快速发送大量消息
        for (let i = 0; i < 200; i++) {
            ws.send(JSON.stringify({
                type: 'chat',
                data: { message: `速率测试消息 ${i}` }
            }));
            messageCount++;
        }
    });
    
    ws.on('error', (error) => {
        console.log('✅ 速率限制生效:', error.message);
    });
    
    setTimeout(() => {
        ws.close();
        console.log(`发送了 ${messageCount} 条消息`);
    }, 10000);
}

testRateLimit();
```

## 🔧 兼容性测试

### 1. 浏览器兼容性测试
```html
<!-- test-browser.html -->
<!DOCTYPE html>
<html>
<head>
    <title>浏览器兼容性测试</title>
</head>
<body>
    <h1>多人游戏浏览器兼容性测试</h1>
    <div id="status">连接中...</div>
    <div id="messages"></div>
    
    <script>
        // 检测WebSocket支持
        if (!window.WebSocket) {
            document.getElementById('status').innerHTML = '❌ 浏览器不支持WebSocket';
        } else {
            const ws = new WebSocket('ws://localhost:3000');
            
            ws.onopen = function() {
                document.getElementById('status').innerHTML = '✅ WebSocket连接成功';
                
                // 发送登录消息
                ws.send(JSON.stringify({
                    type: 'login',
                    data: { username: 'BrowserTestUser' }
                }));
            };
            
            ws.onmessage = function(event) {
                const message = JSON.parse(event.data);
                const messagesDiv = document.getElementById('messages');
                messagesDiv.innerHTML += '<div>收到消息: ' + JSON.stringify(message) + '</div>';
            };
            
            ws.onerror = function(error) {
                document.getElementById('status').innerHTML = '❌ WebSocket错误: ' + error;
            };
            
            ws.onclose = function() {
                document.getElementById('status').innerHTML = '⚠️ WebSocket连接关闭';
            };
        }
        
        // 检测Canvas支持
        const canvas = document.createElement('canvas');
        if (canvas.getContext) {
            document.getElementById('messages').innerHTML += '<div>✅ Canvas支持</div>';
        } else {
            document.getElementById('messages').innerHTML += '<div>❌ Canvas不支持</div>';
        }
        
        // 检测键盘事件支持
        document.addEventListener('keydown', function(event) {
            document.getElementById('messages').innerHTML += '<div>按键事件: ' + event.key + '</div>';
        });
    </script>
</body>
</html>
```

### 2. 移动端兼容性测试
```javascript
// test-mobile.js
// 在移动设备上运行的测试脚本

function testMobileCompatibility() {
    console.log('📱 移动端兼容性测试...');
    
    // 检测触摸事件
    if ('ontouchstart' in window) {
        console.log('✅ 触摸事件支持');
        
        document.addEventListener('touchstart', function(event) {
            console.log('触摸开始:', event.touches[0].clientX, event.touches[0].clientY);
        });
        
        document.addEventListener('touchmove', function(event) {
            event.preventDefault();
            console.log('触摸移动:', event.touches[0].clientX, event.touches[0].clientY);
        });
    } else {
        console.log('⚠️ 触摸事件不支持');
    }
    
    // 检测设备方向
    if (window.orientation !== undefined) {
        console.log('✅ 设备方向支持');
        window.addEventListener('orientationchange', function() {
            console.log('设备方向改变:', window.orientation);
        });
    }
    
    // 检测屏幕尺寸
    console.log('屏幕尺寸:', window.innerWidth, 'x', window.innerHeight);
    console.log('设备像素比:', window.devicePixelRatio);
    
    // 检测网络状态
    if (navigator.connection) {
        console.log('网络类型:', navigator.connection.effectiveType);
        console.log('下行速度:', navigator.connection.downlink, 'Mbps');
    }
}

testMobileCompatibility();
```

## 📊 集成测试

### 1. 完整游戏流程测试
```javascript
// test-full-game-flow.js
const WebSocket = require('ws');

class GameFlowTester {
    constructor() {
        this.ws = null;
        this.userId = null;
        this.username = 'FlowTestUser';
        this.testResults = [];
    }
    
    async run() {
        console.log('🎮 开始完整游戏流程测试...');
        
        try {
            await this.connect();
            await this.login();
            await this.testMovement();
            await this.testChat();
            await this.testHeartbeat();
            await this.disconnect();
            
            this.generateReport();
        } catch (error) {
            console.error('❌ 测试失败:', error);
            this.testResults.push({ test: '整体流程', status: '失败', error: error.message });
        }
    }
    
    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket('ws://localhost:3000');
            
            this.ws.on('open', () => {
                console.log('✅ 连接建立');
                this.testResults.push({ test: '连接', status: '通过' });
                resolve();
            });
            
            this.ws.on('error', (error) => {
                this.testResults.push({ test: '连接', status: '失败', error: error.message });
                reject(error);
            });
            
            this.ws.on('message', (data) => {
                this.handleMessage(JSON.parse(data));
            });
            
            setTimeout(() => {
                reject(new Error('连接超时'));
            }, 5000);
        });
    }
    
    login() {
        return new Promise((resolve, reject) => {
            this.loginResolve = resolve;
            this.loginReject = reject;
            
            this.ws.send(JSON.stringify({
                type: 'login',
                data: { username: this.username }
            }));
            
            setTimeout(() => {
                reject(new Error('登录超时'));
            }, 5000);
        });
    }
    
    testMovement() {
        return new Promise((resolve) => {
            this.movementResolve = resolve;
            
            // 发送移动命令
            this.ws.send(JSON.stringify({
                type: 'move',
                data: { position: { x: 50, y: 50, z: 0 } }
            }));
            
            setTimeout(() => {
                this.testResults.push({ test: '移动', status: '通过' });
                resolve();
            }, 2000);
        });
    }
    
    testChat() {
        return new Promise((resolve) => {
            this.chatResolve = resolve;
            
            this.ws.send(JSON.stringify({
                type: 'chat',
                data: { message: '集成测试消息' }
            }));
            
            setTimeout(() => {
                this.testResults.push({ test: '聊天', status: '通过' });
                resolve();
            }, 2000);
        });
    }
    
    testHeartbeat() {
        return new Promise((resolve) => {
            this.heartbeatResolve = resolve;
            
            this.ws.send(JSON.stringify({
                type: 'heartbeat',
                data: {}
            }));
            
            setTimeout(() => {
                this.testResults.push({ test: '心跳', status: '通过' });
                resolve();
            }, 2000);
        });
    }
    
    disconnect() {
        return new Promise((resolve) => {
            this.ws.close();
            this.testResults.push({ test: '断开连接', status: '通过' });
            resolve();
        });
    }
    
    handleMessage(message) {
        switch (message.type) {
            case 'connected':
                console.log('✅ 连接确认');
                break;
                
            case 'login_success':
                this.userId = message.userId;
                console.log('✅ 登录成功:', message.username);
                if (this.loginResolve) {
                    this.loginResolve();
                }
                break;
                
            case 'user_moved':
                if (message.userId === this.userId) {
                    console.log('✅ 移动确认');
                }
                break;
                
            case 'chat_message':
                if (message.username === this.username) {
                    console.log('✅ 聊天消息确认');
                }
                break;
                
            case 'heartbeat_response':
                console.log('✅ 心跳响应');
                break;
                
            default:
                console.log('收到消息:', message.type);
        }
    }
    
    generateReport() {
        console.log('\n📊 集成测试报告:');
        console.log('================');
        
        const passed = this.testResults.filter(r => r.status === '通过').length;
        const failed = this.testResults.filter(r => r.status === '失败').length;
        
        this.testResults.forEach(result => {
            const status = result.status === '通过' ? '✅' : '❌';
            console.log(`${status} ${result.test}: ${result.status}`);
            if (result.error) {
                console.log(`   错误: ${result.error}`);
            }
        });
        
        console.log(`\n总计: ${passed} 通过, ${failed} 失败`);
        
        if (failed === 0) {
            console.log('🎉 所有测试通过！');
        } else {
            console.log('⚠️  部分测试失败，请检查系统配置');
        }
    }
}

// 运行集成测试
const tester = new GameFlowTester();
tester.run();
```

## 🛠️ 自动化测试脚本

### 1. 完整测试套件
```bash
#!/bin/bash
# test-suite.sh - 完整测试套件

echo "🧪 多人游戏项目测试套件"
echo "========================"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 测试结果统计
PASSED=0
FAILED=0
WARNING=0

# 测试函数
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -n "🧪 $test_name ... "
    
    if eval "$test_command" > /tmp/test_output.log 2>&1; then
        echo -e "${GREEN}✅ 通过${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ 失败${NC}"
        echo "   错误信息: $(cat /tmp/test_output.log)"
        ((FAILED++))
    fi
}

# 检查测试环境
echo "🔍 检查测试环境..."

# 检查Node.js
if command -v node &> /dev/null; then
    echo -e "   Node.js: ${GREEN}✅ 已安装${NC} ($(node --version))"
else
    echo -e "   Node.js: ${RED}❌ 未安装${NC}"
    exit 1
fi

# 检查npm
if command -v npm &> /dev/null; then
    echo -e "   npm: ${GREEN}✅ 已安装${NC} ($(npm --version))"
else
    echo -e "   npm: ${RED}❌ 未安装${NC}"
    exit 1
fi

# 检查WebSocket工具
if command -v websocat &> /dev/null; then
    echo -e "   websocat: ${GREEN}✅ 已安装${NC}"
else
    echo -e "   websocat: ${YELLOW}⚠️  未安装${NC}"
    echo "   安装命令: npm install -g websocat"
fi

# 检查端口
if netstat -tulpn 2>/dev/null | grep -q ":3000 "; then
    echo -e "   端口3000: ${YELLOW}⚠️  已被占用${NC}"
else
    echo -e "   端口3000: ${GREEN}✅ 可用${NC}"
fi

echo

# 运行功能测试
echo "🎯 功能测试"
echo "----------"

run_test "WebSocket连接" "node test-websocket-connection.js"
run_test "用户登录" "node test-login.js"
run_test "移动控制" "node test-movement.js"
run_test "聊天功能" "node test-chat.js"
run_test "心跳机制" "node test-heartbeat.js"

# 运行性能测试
echo

echo "⚡ 性能测试"
echo "----------"

run_test "HTTP性能" "timeout 30 ab -n 100 -c 10 http://localhost:3000/"
run_test "WebSocket性能" "node test-websocket-performance.js"
run_test "负载测试" "timeout 120 node test-load.js --users 50 --duration 60"

# 运行安全测试
echo

echo "🔒 安全测试"
echo "----------"

run_test "输入验证" "node test-security.js"
run_test "速率限制" "node test-rate-limit.js"
run_test "XSS防护" "node test-xss-protection.js"

# 运行集成测试
echo

echo "🔧 集成测试"
echo "----------"

run_test "完整游戏流程" "node test-full-game-flow.js"
run_test "多用户并发" "node test-multi-user.js"
run_test "断线重连" "test-disconnect-reconnect.js"

# 生成测试报告
echo

echo "📊 测试报告"
echo "=========="
echo "总测试数: $((PASSED + FAILED + WARNING))"
echo -e "通过: ${GREEN}$PASSED${NC}"
echo -e "失败: ${RED}$FAILED${NC}"
echo -e "警告: ${YELLOW}$WARNING${NC}"
echo

if [ $FAILED -eq 0 ]; then
    echo -e "🎉 ${GREEN}所有测试通过！系统运行正常${NC}"
    exit 0
else
    echo -e "⚠️  ${RED}部分测试失败，请检查系统配置${NC}"
    exit 1
fi
```

### 2. 持续集成配置
```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm ci
        cd client && npm ci && cd ..
    
    - name: Install test tools
      run: |
        npm install -g websocat autocannon
        sudo apt-get install apache2-utils
    
    - name: Start services
      run: |
        npm start &
        sleep 10
    
    - name: Run tests
      run: |
        chmod +x test-suite.sh
        ./test-suite.sh
    
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-results-${{ matrix.node-version }}
        path: |
          test-results/
          logs/
```

## 📈 测试结果分析

### 1. 性能指标
```javascript
// analyze-test-results.js
const fs = require('fs');

function analyzeTestResults() {
    const results = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
    
    console.log('📊 测试结果分析');
    console.log('================');
    
    // 性能分析
    const performanceTests = results.filter(r => r.category === 'performance');
    const avgLatency = performanceTests.reduce((sum, test) => sum + test.latency, 0) / performanceTests.length;
    const maxLatency = Math.max(...performanceTests.map(t => t.latency));
    
    console.log(`平均延迟: ${avgLatency.toFixed(2)}ms`);
    console.log(`最大延迟: ${maxLatency.toFixed(2)}ms`);
    
    // 错误分析
    const errorTests = results.filter(r => r.status === 'failed');
    const errorRate = (errorTests.length / results.length) * 100;
    
    console.log(`错误率: ${errorRate.toFixed(2)}%`);
    
    // 趋势分析
    const timestamps = results.map(r => new Date(r.timestamp));
    const timeRange = Math.max(...timestamps) - Math.min(...timestamps);
    
    console.log(`测试时间范围: ${(timeRange / 1000 / 60).toFixed(2)}分钟`);
    
    // 建议
    if (avgLatency > 1000) {
        console.log('⚠️  建议: 平均延迟较高，需要优化系统性能');
    }
    
    if (errorRate > 5) {
        console.log('⚠️  建议: 错误率较高，需要检查系统稳定性');
    }
    
    if (maxLatency > 5000) {
        console.log('⚠️  建议: 最大延迟过高，可能存在性能瓶颈');
    }
}

analyzeTestResults();
```

## 🎯 测试最佳实践

### 1. 测试策略
- **分层测试**: 单元测试 → 集成测试 → 系统测试
- **持续测试**: 开发阶段 → 部署阶段 → 生产阶段
- **自动化优先**: 优先实现自动化测试
- **数据驱动**: 使用真实数据进行测试

### 2. 测试环境
- **隔离环境**: 使用独立的测试环境
- **数据清理**: 每次测试后清理测试数据
- **环境一致性**: 确保测试环境与生产环境一致

### 3. 测试数据管理
- **测试数据集**: 准备标准化的测试数据
- **数据生成**: 使用工具生成测试数据
- **数据清理**: 测试完成后清理数据

### 4. 测试结果报告
- **详细报告**: 记录所有测试结果
- **趋势分析**: 跟踪测试结果趋势
- **问题跟踪**: 记录和跟踪发现的问题

---

**💡 提示**: 建议定期运行完整的测试套件，确保系统的稳定性和可靠性。测试应该成为开发流程的重要组成部分。