#!/bin/bash

# Discord Gemini Bot 启动脚本

echo "======================================"
echo "   Discord Gemini Bot 启动"
echo "======================================"
echo ""

# 检查环境变量
if [ ! -f .env ]; then
    echo "❌ .env 文件不存在!"
    echo "请先复制 .env.example 到 .env 并配置"
    exit 1
fi

# 检查依赖
if [ ! -d node_modules ]; then
    echo "📦 安装依赖..."
    npm install
fi

echo "🚀 启动 bot..."
echo ""

# 使用 PM2 启动
pm2 start bot-local.js --name discord-gemini-bot

echo ""
echo "======================================"
echo "   启动完成!"
echo "======================================"
echo ""
echo "查看日志: pm2 logs discord-gemini-bot"
echo "查看状态: pm2 status"
echo "停止 bot: pm2 stop discord-gemini-bot"
echo "重启 bot: pm2 restart discord-gemini-bot"
echo ""
