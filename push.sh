#!/bin/bash

echo "=========================================="
echo "   推送代码到 GitHub"
echo "=========================================="
echo ""
echo "仓库地址：https://github.com/xxxxg-claude/discord-gemini-bot"
echo ""

# 检查是否已经创建了远程仓库
echo "⚠️  请先确认已经在 GitHub 创建了仓库"
echo ""
echo "如果还没创建，请："
echo "1. 访问 https://github.com/new"
echo "2. 仓库名称：discord-gemini-bot"
echo "3. 设为 Public 或 Private 都可以"
echo "4. 不要勾选 'Add a README file'"
echo "5. 点击 'Create repository'"
echo ""
read -p "按回车继续（已创建仓库）..." </dev/tty

echo ""
echo "📤 正在推送到 GitHub..."
echo ""

# 尝试推送
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 推送成功！"
    echo ""
    echo "仓库地址：https://github.com/xxxxg-claude/discord-gemini-bot"
    echo ""
    echo "=========================================="
    echo "   下一步：部署到 Railway"
    echo "=========================================="
    echo ""
    echo "1. 访问 https://railway.app"
    echo "2. 点击 'New Project' → 'Deploy from GitHub repo'"
    echo "3. 选择 discord-gemini-bot"
    echo "4. 点击 'Variables' 添加环境变量："
    echo ""
    echo "   DISCORD_TOKEN=你的Discord_Token"
    echo "   GPTSAPI_KEY=你的GPTSAPI_Key"
    echo "   PREFIX=!"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "如果提示需要认证，请选择以下方法之一："
    echo ""
    echo "方法一：使用 Personal Access Token（推荐）"
    echo "1. 访问 https://github.com/settings/tokens"
    echo "2. 点击 'Generate new token' → 'Generate new token (classic)'"
    echo "3. 勾选 'repo' 权限"
    echo "4. 生成 token 并复制"
    echo "5. 推送时输入用户名和粘贴 token 作为密码"
    echo ""
    echo "方法二：使用 SSH（更方便）"
    echo "git remote set-url origin git@github.com:xxxxg-claude/discord-gemini-bot.git"
    echo "git push -u origin main"
    echo ""
fi
