#!/bin/bash

export PATH="/Users/xxxxg/.fly/bin:$PATH"

echo "=========================================="
echo "   Fly.io 部署脚本"
echo "=========================================="
echo ""

# 检查是否已登录
if ! flyctl auth whoami &>/dev/null; then
    echo "📋 第一步：登录 Fly.io"
    echo "----------------------------------------"
    echo "运行以下命令会打开浏览器进行登录："
    echo ""
    echo "  flyctl auth login"
    echo ""
    read -p "按回车继续（已在浏览器完成登录）..." </dev/tty

    if ! flyctl auth whoami &>/dev/null; then
        echo ""
        echo "❌ 未登录，请先运行: flyctl auth login"
        exit 1
    fi

    echo ""
    echo "✅ 已登录到 Fly.io"
    USER=$(flyctl auth whoami)
    echo "用户: $USER"
    echo ""
fi

# 检查是否已有 Fly.io 应用
if flyctl status --app discord-gemini-bot &>/dev/null; then
    echo "📱 应用已存在，更新部署..."
    echo ""
else
    echo "📋 第二步：创建 Fly.io 应用"
    echo "----------------------------------------"
    echo ""

    # 创建应用
    flyctl apps create discord-gemini-bot --org personal

    echo ""
    echo "✅ 应用已创建"
    echo ""
fi

# 设置环境变量
echo "📋 第三步：配置环境变量"
echo "----------------------------------------"
echo ""
echo "正在添加环境变量..."
echo ""

flyctl secrets set DISCORD_TOKEN=你的Discord_Token --app discord-gemini-bot
flyctl secrets set GPTSAPI_KEY=你的GPTSAPI_Key --app discord-gemini-bot
flyctl secrets set PREFIX=! --app discord-gemini-bot

echo ""
echo "✅ 环境变量已设置"
echo ""

# 部署
echo "📋 第四步：部署到 Fly.io"
echo "----------------------------------------"
echo ""
echo "正在部署（这可能需要几分钟）..."
echo ""

flyctl deploy --app discord-gemini-bot

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "   部署完成！"
    echo "=========================================="
    echo ""
    echo "查看日志: flyctl logs --app discord-gemini-bot"
    echo "查看状态: flyctl status --app discord-gemini-bot"
    echo "打开面板: flyctl dashboard --app discord-gemini-bot"
    echo ""
    echo "🎉 Bot 已上线，24/7 运行中！"
    echo ""
else
    echo ""
    echo "❌ 部署失败，请检查错误信息"
    exit 1
fi
