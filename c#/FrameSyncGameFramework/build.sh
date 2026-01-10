#!/bin/bash

# FrameSync Game Framework 构建脚本

echo "=== FrameSync Game Framework 构建 ==="

# 检查.NET SDK
if ! command -v dotnet &> /dev/null; then
    echo "错误: .NET SDK 未安装"
    echo "请安装 .NET 6.0 SDK 或更高版本:"
    echo "  Ubuntu/Debian: sudo apt-get install dotnet-sdk-6.0"
    echo "  Windows: 从 https://dotnet.microsoft.com/download 下载"
    echo "  macOS: brew install dotnet"
    exit 1
fi

# 显示.NET版本
echo ".NET SDK 版本:"
dotnet --version

# 清理旧的构建
echo "清理旧的构建..."
dotnet clean

# 还原依赖
echo "还原NuGet包..."
dotnet restore

# 构建项目
echo "构建项目..."
dotnet build --configuration Release

# 检查构建结果
if [ $? -eq 0 ]; then
    echo "✅ 构建成功!"
    echo "运行程序: dotnet run --configuration Release"
else
    echo "❌ 构建失败!"
    exit 1
fi