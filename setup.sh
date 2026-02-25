#!/bin/bash

echo "======================================"
echo "   Discord Gemini Bot 配置向导"
echo "======================================"
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    echo "✅ 依赖安装完成"
    echo ""
fi

# 检查 .env 文件
if [ -f .env ]; then
    echo "⚠️  .env 文件已存在"
    echo ""
    read -p "是否要重新配置? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "跳过配置"
    else
        rm .env
        cp .env.example .env
        echo "✅ 已创建新的 .env 文件"
        echo ""
        echo "请编辑 .env 文件并填入以下信息："
        echo ""
        echo "1. DISCORD_TOKEN - 从 https://discord.com/developers/applications 获取"
        echo "2. GPTSAPI_KEY  - 从 https://gptsapi.net 获取"
        echo ""
        echo "运行以下命令编辑："
        echo "  nano .env"
        echo "  或"
        echo "  open .env"
    fi
else
    cp .env.example .env
    echo "✅ 已创建 .env 文件"
    echo ""
    echo "📝 请编辑 .env 文件并填入："
    echo ""
    echo "   DISCORD_TOKEN=你的Discord_Bot_Token"
    echo "   GPTSAPI_KEY=你的GPTSAPI_Key"
    echo ""
    echo "编辑命令: nano .env 或 open .env"
fi

echo ""
echo "======================================"
echo "   下一步：邀请 Bot 到服务器"
echo "======================================"
echo ""
echo "1. 访问 https://discord.com/developers/applications"
echo "2. 选择你的应用"
echo "3. 进入 OAuth2 > URL Generator"
echo "4. 勾选 Scopes:"
echo "   ☑ bot"
echo "   ☑ applications.commands"
echo ""
echo "5. 勾选 Bot Permissions:"
echo "   ☑ Send Messages"
echo "   ☑ Read Message History"
echo "   ☑ Use Slash Commands"
echo "   ☑ Read Messages/View Channels"
echo ""
echo "6. 复制生成的链接并在浏览器打开"
echo ""
echo "======================================"
