#!/bin/bash

# Docker入口脚本
# 处理容器启动时的初始化工作

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        info)
            echo -e "${BLUE}[$timestamp] INFO${NC} $message"
            ;;
        success)
            echo -e "${GREEN}[$timestamp] SUCCESS${NC} $message"
            ;;
        warn)
            echo -e "${YELLOW}[$timestamp] WARN${NC} $message"
            ;;
        error)
            echo -e "${RED}[$timestamp] ERROR${NC} $message"
            ;;
    esac
}

# 检查环境变量
check_environment() {
    log info "检查环境变量..."
    
    # 设置默认值
    export NODE_ENV=${NODE_ENV:-production}
    export PORT=${PORT:-3000}
    export CLIENT_PORT=${CLIENT_PORT:-5173}
    export HOST=${HOST:-0.0.0.0}
    export MAX_USERS=${MAX_USERS:-100}
    export LOG_LEVEL=${LOG_LEVEL:-info}
    
    log info "环境配置:"
    log info "  NODE_ENV: $NODE_ENV"
    log info "  PORT: $PORT"
    log info "  CLIENT_PORT: $CLIENT_PORT"
    log info "  HOST: $HOST"
    log info "  MAX_USERS: $MAX_USERS"
    log info "  LOG_LEVEL: $LOG_LEVEL"
}

# 创建必要的目录
create_directories() {
    log info "创建必要的目录..."
    
    mkdir -p logs
    mkdir -p tmp
    mkdir -p data
    
    # 设置权限
    chmod 755 logs tmp data
}

# 检查端口可用性
check_ports() {
    log info "检查端口可用性..."
    
    # 检查端口是否被占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log warn "端口 $PORT 已被占用，尝试使用其他端口"
        export PORT=$((PORT + 1))
    fi
    
    if lsof -Pi :$CLIENT_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log warn "端口 $CLIENT_PORT 已被占用，尝试使用其他端口"
        export CLIENT_PORT=$((CLIENT_PORT + 1))
    fi
}

# 健康检查端点
setup_health_check() {
    log info "设置健康检查端点..."
    
    # 创建简单的健康检查脚本
    cat > /tmp/health_check.js << 'EOF'
const http = require('http');
const port = process.env.PORT || 3000;

const options = {
    hostname: 'localhost',
    port: port,
    path: '/health',
    method: 'GET',
    timeout: 5000
};

const req = http.request(options, (res) => {
    if (res.statusCode === 200) {
        process.exit(0);
    } else {
        process.exit(1);
    }
});

req.on('error', () => {
    process.exit(1);
});

req.on('timeout', () => {
    req.destroy();
    process.exit(1);
});

req.end();
EOF
}

# 信号处理
setup_signal_handlers() {
    log info "设置信号处理..."
    
    # 处理退出信号
    trap 'graceful_shutdown' SIGTERM SIGINT
    
    log info "信号处理已设置"
}

# 优雅关闭
graceful_shutdown() {
    log info "收到关闭信号，开始优雅关闭..."
    
    # 停止服务端
    if [ -n "$SERVER_PID" ]; then
        log info "停止服务端进程 (PID: $SERVER_PID)"
        kill -TERM "$SERVER_PID" 2>/dev/null || true
        wait "$SERVER_PID" 2>/dev/null || true
    fi
    
    # 停止客户端
    if [ -n "$CLIENT_PID" ]; then
        log info "停止客户端进程 (PID: $CLIENT_PID)"
        kill -TERM "$CLIENT_PID" 2>/dev/null || true
        wait "$CLIENT_PID" 2>/dev/null || true
    fi
    
    log success "优雅关闭完成"
    exit 0
}

# 启动服务端
start_server() {
    log info "启动服务端..."
    
    if [ "$START_SERVER" != "false" ]; then
        node start-server.js &
        SERVER_PID=$!
        log info "服务端启动完成 (PID: $SERVER_PID)"
        
        # 等待服务端启动
        sleep 3
        
        # 检查服务端是否正常运行
        if ! kill -0 $SERVER_PID 2>/dev/null; then
            log error "服务端启动失败"
            exit 1
        fi
    else
        log info "跳过服务端启动"
    fi
}

# 启动客户端
start_client() {
    log info "启动客户端..."
    
    if [ "$START_CLIENT" != "false" ]; then
        node start-client.js &
        CLIENT_PID=$!
        log info "客户端启动完成 (PID: $CLIENT_PID)"
        
        # 等待客户端启动
        sleep 2
        
        # 检查客户端是否正常运行
        if ! kill -0 $CLIENT_PID 2>/dev/null; then
            log error "客户端启动失败"
            exit 1
        fi
    else
        log info "跳过客户端启动"
    fi
}

# 等待进程
wait_for_processes() {
    log info "等待进程运行..."
    
    # 如果服务端在运行，等待它
    if [ -n "$SERVER_PID" ]; then
        log info "等待服务端进程 (PID: $SERVER_PID)"
        wait "$SERVER_PID"
    fi
    
    # 如果客户端在运行，等待它
    if [ -n "$CLIENT_PID" ]; then
        log info "等待客户端进程 (PID: $CLIENT_PID)"
        wait "$CLIENT_PID"
    fi
}

# 主函数
main() {
    log info "开始Docker容器初始化..."
    
    # 环境检查
    check_environment
    create_directories
    check_ports
    setup_health_check
    setup_signal_handlers
    
    # 启动服务
    start_server
    start_client
    
    log success "容器初始化完成"
    log info "服务运行中，按 Ctrl+C 停止"
    
    # 等待进程
    wait_for_processes
}

# 运行主函数
main "$@"