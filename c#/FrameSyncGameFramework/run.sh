#!/bin/bash

# FrameSync Game Framework 运行脚本

echo "=== FrameSync Game Framework 运行 ==="

# 检查.NET SDK
if ! command -v dotnet &> /dev/null; then
    echo "错误: .NET SDK 未安装"
    echo "请先安装 .NET 6.0 SDK 或更高版本"
    exit 1
fi

# 检查是否已构建
if [ ! -d "bin/Release/net7.0" ]; then
    echo "未找到构建文件，请先运行构建脚本..."
    ./build.sh
    if [ $? -ne 0 ]; then
        exit 1
    fi
fi

# 运行程序
echo "启动演示程序..."
dotnet run --configuration Release

echo "程序运行完成"