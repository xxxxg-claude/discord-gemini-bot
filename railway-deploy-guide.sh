#!/bin/bash

echo "=========================================="
echo "   Railway 自动部署脚本"
echo "=========================================="
echo ""

# 检查是否已登录
echo "📋 第一步：登录 Railway"
echo "----------------------------------------"
echo "运行以下命令会打开浏览器进行登录："
echo ""
echo "  railway login"
echo ""
read -p "按回车继续（已在浏览器完成登录）..." </dev/tty

# 登录后检查
if ! railway whoami &>/dev/null; then
    echo ""
    echo "❌ 未登录，请先运行: railway login"
    exit 1
fi

echo ""
echo "✅ 已登录到 Railway"
USER=$(railway whoami)
echo "用户: $USER"
echo ""

# 初始化项目
echo "📋 第二步：创建或连接 Railway 项目"
echo "----------------------------------------"
echo ""
read -p "是否创建新项目? (y/n): " -n 1 -r </dev/tty
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "正在创建项目..."
    railway init --name discord-gemini-bot
else
    echo "连接现有项目..."
    railway init
fi

echo ""
echo "✅ 项目已创建/连接"
echo ""

# 设置环境变量
echo "📋 第三步：配置环境变量"
echo "----------------------------------------"
echo ""
echo "正在添加环境变量..."
echo ""

railway variables set DISCORD_TOKEN=你的Discord_Token
railway variables set GPTSAPI_KEY=你的GPTSAPI_Key
railway variables set PREFIX=!

echo "✅ 环境变量已设置"
echo ""

# 部署
echo "📋 第四步：部署到 Railway"
echo "----------------------------------------"
echo ""
echo "正在部署..."
echo ""

railway up

echo ""
echo "=========================================="
echo "   部署完成！"
echo "=========================================="
echo ""
echo "查看日志: railway logs"
echo "查看状态: railway status"
echo "打开项目: railway open"
echo ""
