#!/bin/bash

# 多人游戏项目快速启动脚本
# 一键完成项目解压、依赖安装、配置和启动

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_NAME="multiplayer-game-project"
PROJECT_DIR="$(pwd)/${PROJECT_NAME}"
LOG_FILE="/tmp/game-setup.log"
BACKUP_DIR="/tmp/game-backup-$(date +%Y%m%d_%H%M%S)"

# 函数定义
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

# 检查系统要求
check_requirements() {
    log "检查系统要求..."
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js 未安装，请先安装 Node.js >= 14.0.0"
    fi
    
    NODE_VERSION=$(node --version | sed 's/v//')
    if [[ "$(printf '%s\n' "14.0.0" "$NODE_VERSION" | sort -V | head -n1)" != "14.0.0" ]]; then
        error "Node.js 版本过低，需要 >= 14.0.0，当前版本: $NODE_VERSION"
    fi
    success "Node.js 版本: $NODE_VERSION"
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        error "npm 未安装"
    fi
    
    NPM_VERSION=$(npm --version)
    if [[ "$(printf '%s\n' "6.0.0" "$NPM_VERSION" | sort -V | head -n1)" != "6.0.0" ]]; then
        error "npm 版本过低，需要 >= 6.0.0，当前版本: $NPM_VERSION"
    fi
    success "npm 版本: $NPM_VERSION"
    
    # 检查端口可用性
    if netstat -tulpn 2>/dev/null | grep -q ":3000 "; then
        warning "端口 3000 已被占用"
        read -p "是否使用端口 3001? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            SERVER_PORT=3001
        else
            error "请手动释放端口 3000 或修改配置"
        fi
    else
        SERVER_PORT=3000
    fi
    
    if netstat -tulpn 2>/dev/null | grep -q ":5173 "; then
        warning "端口 5173 已被占用"
        read -p "是否使用端口 5174? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            CLIENT_PORT=5174
        else
            error "请手动释放端口 5173 或修改配置"
        fi
    else
        CLIENT_PORT=5173
    fi
    
    success "系统要求检查通过"
}

# 备份现有项目
backup_existing() {
    if [ -d "$PROJECT_DIR" ]; then
        log "发现现有项目，创建备份..."
        mkdir -p "$BACKUP_DIR"
        cp -r "$PROJECT_DIR" "$BACKUP_DIR/"
        success "项目已备份到: $BACKUP_DIR"
    fi
}

# 解压项目包
extract_project() {
    log "解压项目包..."
    
    # 查找项目包
    if [ -f "${PROJECT_NAME}.zip" ]; then
        PROJECT_PACKAGE="${PROJECT_NAME}.zip"
    elif [ -f "${PROJECT_NAME}-v*.zip" ]; then
        PROJECT_PACKAGE=$(ls ${PROJECT_NAME}-v*.zip | head -1)
    else
        error "未找到项目包文件"
    fi
    
    # 解压
    unzip -q "$PROJECT_PACKAGE" -d .
    
    if [ ! -d "$PROJECT_DIR" ]; then
        error "项目解压失败"
    fi
    
    success "项目解压完成"
}

# 安装依赖
install_dependencies() {
    log "安装项目依赖..."
    cd "$PROJECT_DIR"
    
    # 安装主项目依赖
    log "安装主项目依赖..."
    npm install --production=false
    
    # 安装客户端依赖
    if [ -d "client" ]; then
        log "安装客户端依赖..."
        cd client
        npm install --production=false
        cd ..
    fi
    
    success "依赖安装完成"
}

# 配置项目
configure_project() {
    log "配置项目..."
    cd "$PROJECT_DIR"
    
    # 复制环境配置模板
    if [ -f ".env.example" ]; then
        cp .env.example .env
        success "创建环境配置文件"
    fi
    
    # 修改配置文件
    if [ -f "config.json" ]; then
        # 使用临时文件修改配置
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/\"port\": 3000/\"port\": $SERVER_PORT/" config.json
            sed -i '' "s/\"port\": 5173/\"port\": $CLIENT_PORT/" config.json
        else
            # Linux
            sed -i "s/\"port\": 3000/\"port\": $SERVER_PORT/" config.json
            sed -i "s/\"port\": 5173/\"port\": $CLIENT_PORT/" config.json
        fi
        success "更新配置文件"
    fi
    
    # 创建日志目录
    mkdir -p logs
    success "创建日志目录"
}

# 运行测试
run_tests() {
    log "运行项目测试..."
    cd "$PROJECT_DIR"
    
    if [ -f "test-integration.js" ]; then
        log "运行集成测试..."
        node test-integration.js || warning "集成测试失败，但继续部署"
    fi
    
    success "测试完成"
}

# 启动服务
start_services() {
    log "启动服务..."
    cd "$PROJECT_DIR"
    
    # 启动服务端
    log "启动服务端 (端口: $SERVER_PORT)..."
    nohup node start-server.js > logs/server.log 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > logs/server.pid
    
    # 等待服务启动
    sleep 3
    
    # 检查服务状态
    if kill -0 $SERVER_PID 2>/dev/null; then
        success "服务端启动成功 (PID: $SERVER_PID)"
    else
        error "服务端启动失败，请检查日志: logs/server.log"
    fi
    
    # 启动客户端
    log "启动客户端 (端口: $CLIENT_PORT)..."
    nohup node start-client.js > logs/client.log 2>&1 &
    CLIENT_PID=$!
    echo $CLIENT_PID > logs/client.pid
    
    # 等待服务启动
    sleep 3
    
    # 检查服务状态
    if kill -0 $CLIENT_PID 2>/dev/null; then
        success "客户端启动成功 (PID: $CLIENT_PID)"
    else
        warning "客户端启动失败，请检查日志: logs/client.log"
    fi
}

# 验证部署
verify_deployment() {
    log "验证部署..."
    cd "$PROJECT_DIR"
    
    # 等待服务完全启动
    sleep 5
    
    # 检查服务端
    if curl -s "http://localhost:$SERVER_PORT" > /dev/null; then
        success "服务端响应正常"
    else
        warning "服务端无响应"
    fi
    
    # 检查客户端
    if curl -s "http://localhost:$CLIENT_PORT" > /dev/null; then
        success "客户端响应正常"
    else
        warning "客户端无响应"
    fi
    
    # 检查WebSocket
    if command -v websocat &> /dev/null; then
        timeout 5 websocat "ws://localhost:$SERVER_PORT" 2>/dev/null || warning "WebSocket连接测试失败"
    fi
    
    success "部署验证完成"
}

# 显示部署信息
show_deployment_info() {
    echo
    echo "=========================================="
    echo "🎮 多人游戏项目部署完成！"
    echo "=========================================="
    echo
    echo "📋 部署信息："
    echo "  项目目录: $PROJECT_DIR"
    echo "  服务端地址: http://localhost:$SERVER_PORT"
    echo "  客户端地址: http://localhost:$CLIENT_PORT"
    echo "  WebSocket地址: ws://localhost:$SERVER_PORT"
    echo
    echo "📁 重要文件："
    echo "  服务端日志: $PROJECT_DIR/logs/server.log"
    echo "  客户端日志: $PROJECT_DIR/logs/client.log"
    echo "  配置文件: $PROJECT_DIR/config.json"
    echo "  环境变量: $PROJECT_DIR/.env"
    echo
    echo "🛠️  管理命令："
    echo "  停止服务端: kill \$(cat $PROJECT_DIR/logs/server.pid)"
    echo "  停止客户端: kill \$(cat $PROJECT_DIR/logs/client.pid)"
    echo "  查看日志: tail -f $PROJECT_DIR/logs/server.log"
    echo "  重启服务: cd $PROJECT_DIR && node start-server.js"
    echo
    echo "🧪 测试命令："
    echo "  测试服务端: curl http://localhost:$SERVER_PORT"
    echo "  测试客户端: curl http://localhost:$CLIENT_PORT"
    echo "  测试WebSocket: websocat ws://localhost:$SERVER_PORT"
    echo
    echo "📖 文档："
    echo "  项目说明: $PROJECT_DIR/README.md"
    echo "  运行指南: $PROJECT_DIR/RUN_GUIDE.md"
    echo "  部署指南: $PROJECT_DIR/DEPLOYMENT_GUIDE.md"
    echo
    echo "=========================================="
    echo "🎉 现在您可以访问游戏了！"
    echo "=========================================="
    echo
}

# 创建快捷命令
create_shortcuts() {
    log "创建快捷命令..."
    
    # 创建管理脚本
    cat > "$PROJECT_DIR/manage.sh" << EOF
#!/bin/bash
# 项目管理脚本

PROJECT_DIR="$PROJECT_DIR"
SERVER_PID_FILE="\$PROJECT_DIR/logs/server.pid"
CLIENT_PID_FILE="\$PROJECT_DIR/logs/client.pid"

case "\$1" in
    start)
        echo "启动服务..."
        cd "\$PROJECT_DIR"
        nohup node start-server.js > logs/server.log 2>&1 &
        echo \$! > \$SERVER_PID_FILE
        nohup node start-client.js > logs/client.log 2>&1 &
        echo \$! > \$CLIENT_PID_FILE
        echo "服务已启动"
        ;;
    stop)
        echo "停止服务..."
        if [ -f "\$SERVER_PID_FILE" ]; then
            kill \$(cat \$SERVER_PID_FILE) 2>/dev/null
            rm \$SERVER_PID_FILE
        fi
        if [ -f "\$CLIENT_PID_FILE" ]; then
            kill \$(cat \$CLIENT_PID_FILE) 2>/dev/null
            rm \$CLIENT_PID_FILE
        fi
        echo "服务已停止"
        ;;
    restart)
        \$0 stop
        sleep 2
        \$0 start
        ;;
    status)
        if [ -f "\$SERVER_PID_FILE" ] && kill -0 \$(cat \$SERVER_PID_FILE) 2>/dev/null; then
            echo "服务端运行中 (PID: \$(cat \$SERVER_PID_FILE))"
        else
            echo "服务端未运行"
        fi
        if [ -f "\$CLIENT_PID_FILE" ] && kill -0 \$(cat \$CLIENT_PID_FILE) 2>/dev/null; then
            echo "客户端运行中 (PID: \$(cat \$CLIENT_PID_FILE))"
        else
            echo "客户端未运行"
        fi
        ;;
    logs)
        tail -f \$PROJECT_DIR/logs/server.log
        ;;
    *)
        echo "用法: \$0 {start|stop|restart|status|logs}"
        exit 1
        ;;
esac
EOF
    
    chmod +x "$PROJECT_DIR/manage.sh"
    success "创建管理脚本: $PROJECT_DIR/manage.sh"
    
    # 创建系统服务（可选）
    if command -v systemctl &> /dev/null; then
        log "创建系统服务..."
        sudo tee /etc/systemd/system/multiplayer-game.service > /dev/null << EOF
[Unit]
Description=Multiplayer Game Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/node start-server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
        
        sudo systemctl daemon-reload
        success "创建系统服务: multiplayer-game"
        warning "使用 'sudo systemctl enable multiplayer-game' 启用开机自启"
    fi
}

# 清理函数
cleanup() {
    log "清理临时文件..."
    rm -f "$LOG_FILE"
}

# 主函数
main() {
    echo "🚀 多人游戏项目快速启动脚本"
    echo "=========================================="
    
    # 设置陷阱，确保清理函数在脚本退出时执行
    trap cleanup EXIT
    
    # 执行步骤
    check_requirements
    backup_existing
    extract_project
    install_dependencies
    configure_project
    run_tests
    start_services
    verify_deployment
    create_shortcuts
    show_deployment_info
    
    success "🎉 快速启动完成！"
}

# 处理命令行参数
case "${1:-}" in
    --help|-h)
        echo "多人游戏项目快速启动脚本"
        echo "用法: $0 [选项]"
        echo "选项:"
        echo "  --help, -h     显示帮助信息"
        echo "  --version, -v  显示版本信息"
        echo "  --clean        清理并重新部署"
        exit 0
        ;;
    --version|-v)
        echo "快速启动脚本 v1.0.0"
        exit 0
        ;;
    --clean)
        log "执行清理部署..."
        if [ -d "$PROJECT_DIR" ]; then
            log "删除现有项目..."
            rm -rf "$PROJECT_DIR"
        fi
        main
        ;;
    "")
        main
        ;;
    *)
        error "未知选项: $1"
        echo "使用 --help 查看帮助信息"
        exit 1
        ;;
esac