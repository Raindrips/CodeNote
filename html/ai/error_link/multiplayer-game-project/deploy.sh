#!/bin/bash

# 多人游戏项目部署脚本
# 支持多种部署方式：本地、Docker、远程服务器

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认配置
DEPLOY_TYPE="local"
ENVIRONMENT="development"
PORT=3000
CLIENT_PORT=5173
HOST="localhost"
SERVER_HOST="localhost"
PM2_NAME="multiplayer-game"
DOCKER_IMAGE="multiplayer-game"
DOCKER_CONTAINER="multiplayer-game-container"

# 函数：显示帮助信息
show_help() {
    echo -e "${BLUE}多人游戏项目部署脚本${NC}"
    echo
    echo -e "${YELLOW}用法:${NC} ./deploy.sh [选项]"
    echo
    echo -e "${YELLOW}部署类型:${NC}"
    echo "  --local                 本地部署 (默认)"
    echo "  --docker                Docker容器部署"
    echo "  --pm2                   使用PM2进程管理"
    echo "  --remote <服务器地址>    远程服务器部署"
    echo
    echo -e "${YELLOW}环境选项:${NC}"
    echo "  --dev                   开发环境 (默认)"
    echo "  --prod                  生产环境"
    echo
    echo -e "${YELLOW}端口配置:${NC}"
    echo "  --port <端口>           服务端端口 (默认: 3000)"
    echo "  --client-port <端口>    客户端端口 (默认: 5173)"
    echo "  --host <主机>           主机地址 (默认: localhost)"
    echo
    echo -e "${YELLOW}其他选项:${NC}"
    echo "  --help                  显示帮助信息"
    echo "  --clean                 清理构建文件"
    echo "  --build                 仅构建项目"
    echo "  --start                 仅启动服务"
    echo "  --stop                  停止服务"
    echo "  --restart               重启服务"
    echo "  --status                查看服务状态"
    echo
    echo -e "${YELLOW}示例:${NC}"
    echo "  ./deploy.sh --local --dev"
    echo "  ./deploy.sh --docker --prod"
    echo "  ./deploy.sh --pm2 --prod --port 8080"
    echo "  ./deploy.sh --remote user@server.com --prod"
    echo
}

# 函数：输出日志
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

# 函数：检查依赖
check_dependencies() {
    log info "检查依赖..."
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        log error "未找到Node.js，请先安装Node.js"
        exit 1
    fi
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        log error "未找到npm，请先安装npm"
        exit 1
    fi
    
    # 检查端口是否被占用
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log warn "端口 $PORT 已被占用，将尝试使用其他端口"
        PORT=$((PORT + 1))
    fi
    
    if lsof -Pi :$CLIENT_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log warn "端口 $CLIENT_PORT 已被占用，将尝试使用其他端口"
        CLIENT_PORT=$((CLIENT_PORT + 1))
    fi
    
    log success "依赖检查通过"
}

# 函数：安装依赖
install_dependencies() {
    log info "安装项目依赖..."
    
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    
    if [ -d "client" ] && [ ! -d "client/node_modules" ]; then
        cd client && npm install && cd ..
    fi
    
    log success "依赖安装完成"
}

# 函数：构建项目
build_project() {
    log info "构建项目..."
    
    # 构建客户端
    if [ -d "client" ]; then
        cd client
        if [ -f "package.json" ]; then
            npm run build 2>/dev/null || log warn "客户端构建失败，使用开发版本"
        fi
        cd ..
    fi
    
    log success "项目构建完成"
}

# 函数：清理构建文件
clean_build() {
    log info "清理构建文件..."
    
    rm -rf client/dist
    rm -rf client/node_modules/.cache
    rm -rf logs/*.log
    
    log success "清理完成"
}

# 函数：本地部署
local_deploy() {
    log info "开始本地部署..."
    
    check_dependencies
    install_dependencies
    
    if [ "$BUILD_ONLY" = "true" ]; then
        build_project
        return 0
    fi
    
    if [ "$START_ONLY" = "true" ]; then
        start_local_services
        return 0
    fi
    
    build_project
    start_local_services
}

# 函数：启动本地服务
start_local_services() {
    log info "启动本地服务..."
    
    # 启动服务端
    log info "启动服务端 (端口: $PORT)"
    NODE_ENV=$ENVIRONMENT PORT=$PORT node start-server.js &
    SERVER_PID=$!
    
    sleep 3
    
    # 启动客户端
    log info "启动客户端 (端口: $CLIENT_PORT)"
    CLIENT_PORT=$CLIENT_PORT SERVER_PORT=$PORT node start-client.js &
    CLIENT_PID=$!
    
    # 保存PID
    echo $SERVER_PID > server.pid
    echo $CLIENT_PID > client.pid
    
    log success "服务启动完成"
    log info "服务端地址: http://$HOST:$PORT"
    log info "客户端地址: http://$HOST:$CLIENT_PORT"
    log info "按 Ctrl+C 停止服务"
    
    # 等待信号
    trap 'stop_local_services' INT TERM
    wait
}

# 函数：停止本地服务
stop_local_services() {
    log info "停止本地服务..."
    
    if [ -f "server.pid" ]; then
        SERVER_PID=$(cat server.pid)
        if kill -0 $SERVER_PID 2>/dev/null; then
            kill $SERVER_PID
            log info "服务端已停止"
        fi
        rm -f server.pid
    fi
    
    if [ -f "client.pid" ]; then
        CLIENT_PID=$(cat client.pid)
        if kill -0 $CLIENT_PID 2>/dev/null; then
            kill $CLIENT_PID
            log info "客户端已停止"
        fi
        rm -f client.pid
    fi
    
    log success "服务已停止"
}

# 函数：PM2部署
pm2_deploy() {
    log info "使用PM2进行部署..."
    
    # 检查PM2是否安装
    if ! command -v pm2 &> /dev/null; then
        log info "安装PM2..."
        npm install -g pm2
    fi
    
    check_dependencies
    install_dependencies
    build_project
    
    # 停止现有进程
    pm2 stop $PM2_NAME-server 2>/dev/null || true
    pm2 stop $PM2_NAME-client 2>/dev/null || true
    pm2 delete $PM2_NAME-server 2>/dev/null || true
    pm2 delete $PM2_NAME-client 2>/dev/null || true
    
    # 启动服务端
    log info "启动PM2服务端进程"
    pm2 start start-server.js --name "$PM2_NAME-server" --env NODE_ENV=$ENVIRONMENT --env PORT=$PORT
    
    # 启动客户端
    log info "启动PM2客户端进程"
    pm2 start start-client.js --name "$PM2_NAME-client" --env NODE_ENV=$ENVIRONMENT --env CLIENT_PORT=$CLIENT_PORT --env SERVER_PORT=$PORT
    
    # 保存PM2配置
    pm2 save
    
    log success "PM2部署完成"
    pm2 status
}

# 函数：Docker部署
docker_deploy() {
    log info "使用Docker进行部署..."
    
    # 检查Docker是否安装
    if ! command -v docker &> /dev/null; then
        log error "未找到Docker，请先安装Docker"
        exit 1
    fi
    
    # 构建Docker镜像
    log info "构建Docker镜像..."
    docker build -t $DOCKER_IMAGE .
    
    # 停止现有容器
    docker stop $DOCKER_CONTAINER 2>/dev/null || true
    docker rm $DOCKER_CONTAINER 2>/dev/null || true
    
    # 启动容器
    log info "启动Docker容器..."
    docker run -d \
        --name $DOCKER_CONTAINER \
        -p $PORT:3000 \
        -p $CLIENT_PORT:5173 \
        -e NODE_ENV=$ENVIRONMENT \
        -e PORT=3000 \
        -e CLIENT_PORT=5173 \
        --restart unless-stopped \
        $DOCKER_IMAGE
    
    log success "Docker部署完成"
    log info "容器状态:"
    docker ps | grep $DOCKER_CONTAINER
}

# 函数：远程部署
remote_deploy() {
    local remote_host=$1
    
    if [ -z "$remote_host" ]; then
        log error "远程主机地址不能为空"
        exit 1
    fi
    
    log info "部署到远程服务器: $remote_host"
    
    # 打包项目
    log info "打包项目文件..."
    tar -czf multiplayer-game.tar.gz \
        --exclude=node_modules \
        --exclude=client/node_modules \
        --exclude=logs \
        --exclude=.git \
        --exclude=*.tar.gz \
        .
    
    # 复制到远程服务器
    log info "复制文件到远程服务器..."
    scp multiplayer-game.tar.gz $remote_host:~/
    
    # 在远程服务器上执行部署
    log info "在远程服务器上执行部署..."
    ssh $remote_host << EOF
        cd ~
        tar -xzf multiplayer-game.tar.gz
        cd multiplayer-game-project
        ./deploy.sh --pm2 --prod --port $PORT --client-port $CLIENT_PORT
        rm ~/multiplayer-game.tar.gz
EOF
    
    # 清理本地打包文件
    rm -f multiplayer-game.tar.gz
    
    log success "远程部署完成"
}

# 函数：查看服务状态
show_status() {
    log info "服务状态:"
    
    # 检查本地服务
    if [ -f "server.pid" ] && kill -0 $(cat server.pid) 2>/dev/null; then
        log success "服务端运行中 (PID: $(cat server.pid))"
    else
        log warn "服务端未运行"
    fi
    
    if [ -f "client.pid" ] && kill -0 $(cat client.pid) 2>/dev/null; then
        log success "客户端运行中 (PID: $(cat client.pid))"
    else
        log warn "客户端未运行"
    fi
    
    # 检查PM2进程
    if command -v pm2 &> /dev/null; then
        log info "PM2进程状态:"
        pm2 status | grep $PM2_NAME || log warn "无PM2进程"
    fi
    
    # 检查Docker容器
    if command -v docker &> /dev/null; then
        log info "Docker容器状态:"
        docker ps | grep $DOCKER_CONTAINER || log warn "无Docker容器"
    fi
}

# 函数：停止所有服务
stop_all_services() {
    log info "停止所有服务..."
    
    # 停止本地服务
    stop_local_services
    
    # 停止PM2进程
    if command -v pm2 &> /dev/null; then
        pm2 stop $PM2_NAME-server 2>/dev/null || true
        pm2 stop $PM2_NAME-client 2>/dev/null || true
        log info "PM2进程已停止"
    fi
    
    # 停止Docker容器
    if command -v docker &> /dev/null; then
        docker stop $DOCKER_CONTAINER 2>/dev/null || true
        log info "Docker容器已停止"
    fi
    
    log success "所有服务已停止"
}

# 函数：重启服务
restart_services() {
    log info "重启服务..."
    stop_all_services
    sleep 2
    local_deploy
}

# 主函数
main() {
    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            --local)
                DEPLOY_TYPE="local"
                shift
                ;;
            --docker)
                DEPLOY_TYPE="docker"
                shift
                ;;
            --pm2)
                DEPLOY_TYPE="pm2"
                shift
                ;;
            --remote)
                DEPLOY_TYPE="remote"
                REMOTE_HOST="$2"
                shift 2
                ;;
            --dev)
                ENVIRONMENT="development"
                shift
                ;;
            --prod)
                ENVIRONMENT="production"
                shift
                ;;
            --port)
                PORT="$2"
                shift 2
                ;;
            --client-port)
                CLIENT_PORT="$2"
                shift 2
                ;;
            --host)
                HOST="$2"
                shift 2
                ;;
            --clean)
                CLEAN_ONLY="true"
                shift
                ;;
            --build)
                BUILD_ONLY="true"
                shift
                ;;
            --start)
                START_ONLY="true"
                shift
                ;;
            --stop)
                STOP_ONLY="true"
                shift
                ;;
            --restart)
                RESTART_ONLY="true"
                shift
                ;;
            --status)
                STATUS_ONLY="true"
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                log error "未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 执行相应操作
    if [ "$CLEAN_ONLY" = "true" ]; then
        clean_build
        exit 0
    fi
    
    if [ "$STOP_ONLY" = "true" ]; then
        stop_all_services
        exit 0
    fi
    
    if [ "$RESTART_ONLY" = "true" ]; then
        restart_services
        exit 0
    fi
    
    if [ "$STATUS_ONLY" = "true" ]; then
        show_status
        exit 0
    fi
    
    # 执行部署
    case $DEPLOY_TYPE in
        local)
            local_deploy
            ;;
        docker)
            docker_deploy
            ;;
        pm2)
            pm2_deploy
            ;;
        remote)
            remote_deploy "$REMOTE_HOST"
            ;;
        *)
            log error "未知的部署类型: $DEPLOY_TYPE"
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"