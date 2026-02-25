#!/bin/bash

# Discord Gemini Bot 启动脚本（带代理支持）

echo "======================================"
echo "   Discord Gemini Bot 启动中..."
echo "======================================"
echo ""

# 设置代理环境变量
export HTTP_PROXY=http://192.168.10.204:16699
export HTTPS_PROXY=http://192.168.10.204:16699
export NODE_TLS_REJECT_UNAUTHORIZED=0

echo "🔧 代理已设置: $HTTP_PROXY"
echo ""

# 启动 bot
node bot.js
