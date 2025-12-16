#!/bin/bash

# Node.js登录系统部署脚本
# 自动安装依赖、配置环境、初始化数据库

set -e

echo "🚀 开始部署Node.js登录系统..."

# 检查Node.js版本
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo "✅ Node.js已安装: $NODE_VERSION"
        
        # 检查版本是否 >= 14.0.0
        if [[ "$(printf '%s\n' "14.0.0" "${NODE_VERSION#v}" | sort -V | head -n1)" != "14.0.0" ]]; then
            echo "❌ Node.js版本过低，需要14.0.0或更高版本"
            exit 1
        fi
    else
        echo "❌ Node.js未安装，请先安装Node.js 14.0.0或更高版本"
        exit 1
    fi
}

# 检查npm
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        echo "✅ npm已安装: $NPM_VERSION"
    else
        echo "❌ npm未安装，请安装npm"
        exit 1
    fi
}

# 安装依赖
install_dependencies() {
    echo "📦 正在安装项目依赖..."
    npm install
    echo "✅ 依赖安装完成"
}

# 创建环境配置文件
setup_environment() {
    echo "⚙️  正在配置环境变量..."
    
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo "📝 已创建.env文件，请根据您的环境修改变量"
        echo "📝 需要配置的关键变量:"
        echo "   - DB_HOST: 数据库主机地址"
        echo "   - DB_USER: 数据库用户名"
        echo "   - DB_PASSWORD: 数据库密码"
        echo "   - JWT_SECRET: JWT密钥（建议设置复杂的随机字符串）"
    else
        echo "✅ .env文件已存在，跳过创建"
    fi
}

# 测试数据库连接
test_database() {
    echo "🔄 正在测试数据库连接..."
    
    # 创建测试脚本
    cat > test-db.js << 'TESTEOF'
const { testConnection } = require('./src/config/database');

async function testDB() {
    try {
        await testConnection();
        console.log('✅ 数据库连接测试通过');
        process.exit(0);
    } catch (error) {
        console.error('❌ 数据库连接测试失败:', error.message);
        console.log('📝 请检查您的数据库配置:');
        console.log('   1. 确保MySQL服务正在运行');
        console.log('   2. 检查数据库连接配置');
        console.log('   3. 确认数据库用户有访问权限');
        process.exit(1);
    }
}

testDB();
TESTEOF

    node test-db.js
    rm test-db.js
}

# 创建必要的目录
create_directories() {
    echo "📁 正在创建必要的目录..."
    mkdir -p logs uploads
    echo "✅ 目录创建完成"
}

# 显示下一步操作
show_next_steps() {
    echo ""
    echo "🎉 部署完成！下一步操作："
    echo "1. 编辑 .env 文件，配置您的数据库连接信息"
    echo "2. 执行数据库初始化脚本: mysql -u root -p < sql/init.sql"
    echo "3. 启动应用: npm start"
    echo "4. 或使用开发模式: npm run dev"
    echo ""
    echo "📋 可用的npm脚本："
    echo "   npm start  - 生产模式启动"
    echo "   npm run dev - 开发模式启动（支持热重载）"
    echo ""
    echo "🔗 应用启动后访问："
    echo "   健康检查: http://localhost:3000/health"
    echo "   API接口: http://localhost:3000/api/user/*"
    echo ""
}

# 主函数
main() {
    echo "========================================"
    echo "   Node.js登录系统部署脚本"
    echo "========================================"
    echo ""
    
    check_node
    check_npm
    install_dependencies
    setup_environment
    create_directories
    test_database
    show_next_steps
    
    echo "✅ 部署脚本执行完成！"
}

# 执行主函数
main "$@"
