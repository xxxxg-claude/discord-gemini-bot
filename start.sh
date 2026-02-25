#!/bin/bash

# Discord Gemini Bot 启动脚本

echo "🤖 Starting Discord Gemini Bot..."

# 检查 .env 文件是否存在
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure your tokens:"
    echo "  cp .env.example .env"
    exit 1
fi

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# 启动 bot
echo "🚀 Starting bot..."
node bot.js
