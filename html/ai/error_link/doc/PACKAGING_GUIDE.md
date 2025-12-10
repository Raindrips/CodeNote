# 项目打包指南

本文档详细说明了如何将多人游戏项目打包成可分发的压缩包，以及相关的打包命令和最佳实践。

## 📦 打包目标

创建包含以下内容的完整项目包：
- ✅ 完整的源代码
- ✅ 所有依赖配置
- ✅ 构建脚本和工具
- ✅ 部署文档
- ✅ 运行指南
- ✅ 测试脚本
- ✅ Docker配置
- ✅ 环境配置模板

## 🛠️ 打包命令

### 基础打包命令

```bash
# 进入项目目录
cd /home/workspace/packaging_results/multiplayer-game-project

# 创建完整项目压缩包
zip -r multiplayer-game-project-v1.0.0.zip . \
  -x "node_modules/*" \
  -x "logs/*" \
  -x "*.log" \
  -x ".git/*" \
  -x ".DS_Store" \
  -x "Thumbs.db"

# 或者使用tar打包
tar -czf multiplayer-game-project-v1.0.0.tar.gz \
  --exclude=node_modules \
  --exclude=logs \
  --exclude=*.log \
  --exclude=.git \
  --exclude=.DS_Store \
  .
```

### 分平台打包

#### Windows平台
```bash
# 创建Windows友好的压缩包
zip -r multiplayer-game-project-win-v1.0.0.zip . \
  -x "node_modules/*" \
  -x "logs/*" \
  -x "*.log" \
  -x ".git/*" \
  -x ".DS_Store" \
  -x "*.sh" \
  -x "docker-*" \
  -x "Dockerfile" \
  -x "docker-compose.yml"
```

#### Linux/macOS平台
```bash
# 创建Unix友好的压缩包
zip -r multiplayer-game-project-unix-v1.0.0.zip . \
  -x "node_modules/*" \
  -x "logs/*" \
  -x "*.log" \
  -x ".git/*" \
  -x ".DS_Store" \
  -x "*.bat" \
  -x "*.cmd"
```

### 最小化打包
```bash
# 仅包含核心文件
zip -r multiplayer-game-project-minimal.zip . \
  -i "server/*" \
  -i "client/*" \
  -i "docs/*" \
  -i "*.json" \
  -i "*.js" \
  -i "*.md" \
  -i "*.html" \
  -i "*.yml" \
  -i "*.yaml"
```

## 📋 打包清单

### 必需文件
```
✅ server/                    # 服务端代码
  ├── index.js              # 主服务器文件
  └── modules/              # 核心模块
✅ client/                    # 客户端代码
  ├── index.html            # 主HTML文件
  ├── package.json          # 客户端依赖配置
  └── vite.config.js        # Vite构建配置
✅ docs/                      # 项目文档
✅ start-server.js           # 服务端启动脚本
✅ start-client.js           # 客户端启动脚本
✅ config.json               # 项目配置文件
✅ package.json              # 项目依赖配置
✅ README.md                 # 项目说明文档
✅ RUN_GUIDE.md              # 运行指南
✅ PROJECT_STRUCTURE.md      # 项目结构文档
✅ PACKAGE_SUMMARY.md        # 打包摘要
✅ deploy.sh                 # 部署脚本
✅ Dockerfile                # Docker配置
✅ docker-compose.yml        # Docker Compose配置
✅ docker-entrypoint.sh      # Docker入口脚本
✅ test-integration.js       # 集成测试脚本
✅ .env.example              # 环境变量模板
```

### 可选文件
```
📁 logs/                     # 日志目录（运行时生成）
📁 node_modules/            # 依赖包（安装时生成）
📁 dist/                    # 构建输出（构建时生成）
📁 build/                   # 构建目录（构建时生成）
📄 ecosystem.config.js       # PM2配置
📄 nginx.conf                # Nginx配置
📄 ssl/                      # SSL证书
📄 scripts/                  # 额外脚本
```

## 🔧 打包前准备

### 1. 清理项目
```bash
# 删除构建产物
rm -rf dist/
rm -rf build/
rm -rf .next/
rm -rf out/

# 删除日志文件
rm -rf logs/
rm -f *.log

# 删除临时文件
rm -rf .cache/
rm -rf .temp/
rm -rf coverage/
rm -rf .nyc_output/

# 删除依赖包（重新安装）
rm -rf node_modules/
rm -f package-lock.json
rm -f yarn.lock
```

### 2. 代码检查
```bash
# 运行代码检查
npm run lint

# 运行类型检查（如果有）
npm run type-check

# 运行测试
npm test

# 运行集成测试
node test-integration.js
```

### 3. 更新版本
```bash
# 更新package.json版本
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 4. 生成文档
```bash
# 更新项目结构文档
node scripts/generate-project-structure.js

# 生成API文档
node scripts/generate-api-docs.js

# 生成变更日志
node scripts/generate-changelog.js
```

## 📦 打包脚本

### 完整打包脚本
创建 `scripts/package.sh`：
```bash
#!/bin/bash

# 打包脚本
set -e

# 配置
PROJECT_NAME="multiplayer-game-project"
VERSION=$(node -p "require('./package.json').version")
BUILD_DIR="build"
PACKAGE_NAME="${PROJECT_NAME}-v${VERSION}"

echo "🚀 开始打包项目 ${PROJECT_NAME} v${VERSION}"

# 1. 清理项目
echo "🧹 清理项目..."
rm -rf ${BUILD_DIR}
rm -rf dist/ build/ logs/ *.log .cache/ .temp/ coverage/ .nyc_output/
rm -rf node_modules/ package-lock.json yarn.lock

# 2. 代码检查
echo "🔍 代码检查..."
npm run lint || { echo "❌ 代码检查失败"; exit 1; }
npm test || { echo "❌ 测试失败"; exit 1; }

# 3. 安装依赖
echo "📦 安装依赖..."
npm install --production=false

# 4. 构建项目
echo "🏗️ 构建项目..."
npm run build || { echo "❌ 构建失败"; exit 1; }

# 5. 创建构建目录
mkdir -p ${BUILD_DIR}

# 6. 复制文件
echo "📁 复制文件..."
cp -r server ${BUILD_DIR}/
cp -r client ${BUILD_DIR}/
cp -r docs ${BUILD_DIR}/
cp *.js ${BUILD_DIR}/
cp *.json ${BUILD_DIR}/
cp *.md ${BUILD_DIR}/
cp *.yml ${BUILD_DIR}/
cp *.sh ${BUILD_DIR}/
cp Dockerfile ${BUILD_DIR}/
cp docker-compose.yml ${BUILD_DIR}/
cp .env.example ${BUILD_DIR}/

# 7. 创建压缩包
echo "📦 创建压缩包..."
cd ${BUILD_DIR}
zip -r "../${PACKAGE_NAME}.zip" . \
  -x "node_modules/*" \
  -x "logs/*" \
  -x "*.log" \
  -x ".git/*" \
  -x ".DS_Store" \
  -x "Thumbs.db"

tar -czf "../${PACKAGE_NAME}.tar.gz" \
  --exclude=node_modules \
  --exclude=logs \
  --exclude=*.log \
  --exclude=.git \
  --exclude=.DS_Store \
  .

cd ..

# 8. 生成校验和
echo "🔐 生成校验和..."
sha256sum "${PACKAGE_NAME}.zip" > "${PACKAGE_NAME}.zip.sha256"
sha256sum "${PACKAGE_NAME}.tar.gz" > "${PACKAGE_NAME}.tar.gz.sha256"

# 9. 生成包信息
echo "📋 生成包信息..."
cat > "${PACKAGE_NAME}-info.txt" << EOF
项目名称: ${PROJECT_NAME}
版本: ${VERSION}
打包时间: $(date '+%Y-%m-%d %H:%M:%S')
文件大小:
  ZIP: $(du -h "${PACKAGE_NAME}.zip" | cut -f1)
  TAR.GZ: $(du -h "${PACKAGE_NAME}.tar.gz" | cut -f1)
校验和:
  ZIP: $(cat "${PACKAGE_NAME}.zip.sha256")
  TAR.GZ: $(cat "${PACKAGE_NAME}.tar.gz.sha256")
EOF

echo "✅ 打包完成！"
echo "📦 生成的文件:"
ls -la ${PACKAGE_NAME}.*
```

### 自动化打包
创建 `.github/workflows/package.yml`：
```yaml
name: Package

on:
  push:
    tags:
      - 'v*'

jobs:
  package:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
    
    - name: Create package
      run: |
        chmod +x scripts/package.sh
        ./scripts/package.sh
    
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: packages
        path: |
          *.zip
          *.tar.gz
          *.sha256
          *-info.txt
    
    - name: Create Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        draft: false
        prerelease: false
    
    - name: Upload Release Assets
      uses: actions/upload-release-asset@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        upload_url: ${{ steps.create_release.outputs.upload_url }}
        asset_path: ./multiplayer-game-project-*.zip
        asset_name: multiplayer-game-project-${{ github.ref }}.zip
        asset_content_type: application/zip
```

## 📊 包大小优化

### 分析包大小
```bash
# 使用webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/static/js/*.js

# 使用source-map-explorer
npm install --save-dev source-map-explorer
npx source-map-explorer dist/static/js/*.js
```

### 优化策略
1. **代码分割**: 使用动态导入
2. **Tree Shaking**: 移除未使用代码
3. **压缩优化**: 启用Gzip压缩
4. **图片优化**: 压缩图片文件
5. **CDN使用**: 使用外部CDN

### 依赖优化
```bash
# 检查未使用依赖
npm install --save-dev depcheck
npx depcheck

# 检查重复依赖
npm install --save-dev npm-duplicate-checker
npx npm-duplicate-checker

# 优化依赖
npm prune
npm dedupe
```

## 🔐 安全检查

### 依赖安全扫描
```bash
# 使用npm audit
npm audit

# 使用Snyk
npm install --save-dev snyk
npx snyk test

# 使用OWASP依赖检查
npm install --save-dev owasp-dependency-check
npx owasp-dependency-check
```

### 代码安全扫描
```bash
# 使用ESLint安全插件
npm install --save-dev eslint-plugin-security

# 使用SonarQube
npm install --save-dev sonarqube-scanner
```

## 📤 分发部署

### 上传到服务器
```bash
# 使用scp上传
scp multiplayer-game-project-v1.0.0.zip user@server:/path/to/deploy/

# 使用rsync上传
rsync -avz multiplayer-game-project-v1.0.0.zip user@server:/path/to/deploy/

# 使用sftp上传
sftp user@server
put multiplayer-game-project-v1.0.0.zip /path/to/deploy/
```

### 云存储上传
```bash
# AWS S3
aws s3 cp multiplayer-game-project-v1.0.0.zip s3://your-bucket/releases/

# Google Cloud Storage
gsutil cp multiplayer-game-project-v1.0.0.zip gs://your-bucket/releases/

# Azure Blob Storage
az storage blob upload \
  --container-name releases \
  --name multiplayer-game-project-v1.0.0.zip \
  --file multiplayer-game-project-v1.0.0.zip
```

## 📋 打包验证

### 完整性检查
```bash
# 验证压缩包
unzip -t multiplayer-game-project-v1.0.0.zip

# 验证tar包
tar -tzf multiplayer-game-project-v1.0.0.tar.gz

# 检查文件列表
unzip -l multiplayer-game-project-v1.0.0.zip
```

### 校验和验证
```bash
# 计算校验和
sha256sum multiplayer-game-project-v1.0.0.zip

# 验证校验和
sha256sum -c multiplayer-game-project-v1.0.0.zip.sha256
```

### 测试部署
```bash
# 解压测试
cd /tmp
unzip /path/to/multiplayer-game-project-v1.0.0.zip

# 安装依赖
npm install

# 运行测试
npm test

# 启动服务
npm start
```

## 🎯 最佳实践

### 1. 版本管理
- 使用语义化版本控制
- 创建发布标签
- 维护变更日志
- 提供升级指南

### 2. 文档完整
- 提供详细的README
- 包含安装指南
- 提供API文档
- 包含故障排除

### 3. 测试覆盖
- 运行单元测试
- 执行集成测试
- 进行性能测试
- 验证部署流程

### 4. 安全考虑
- 扫描依赖漏洞
- 检查代码安全
- 验证配置文件
- 保护敏感信息

### 5. 性能优化
- 压缩构建产物
- 优化依赖包
- 使用CDN加速
- 启用缓存机制

## 📞 技术支持

如果在打包过程中遇到问题：

1. **查看日志**: 检查打包脚本输出
2. **验证环境**: 确保Node.js和npm版本正确
3. **检查依赖**: 确认所有依赖都能正常安装
4. **测试运行**: 验证打包后的项目能正常运行
5. **寻求帮助**: 联系技术支持或查看文档

---

**💡 提示**: 建议在每次发布前都进行完整的打包测试，确保最终用户能够顺利部署和运行项目。