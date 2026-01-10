# 多人游戏项目Docker镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache \
    bash \
    curl \
    git \
    python3 \
    make \
    g++

# 复制包管理文件
COPY package*.json ./
COPY client/package*.json ./client/

# 安装服务端依赖
RUN npm ci --only=production

# 安装客户端依赖
RUN cd client && npm ci --only=production

# 复制项目文件
COPY . .

# 创建必要的目录
RUN mkdir -p logs tmp

# 设置文件权限
RUN chmod +x start-server.js start-client.js deploy.sh

# 创建非root用户
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# 更改文件所有权
RUN chown -R nodejs:nodejs /app

# 切换到非root用户
USER nodejs

# 暴露端口
EXPOSE 3000 5173

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000
ENV CLIENT_PORT=5173
ENV HOST=0.0.0.0

# 启动脚本
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

# 默认命令
CMD ["npm", "start"]