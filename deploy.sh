#!/bin/bash

echo "======================================"
echo "   Discord Bot 快速部署"
echo "======================================"
echo ""

# 检查是否已经有远程仓库
if git remote get-url origin &>/dev/null; then
    echo "⚠️  已存在远程仓库"
    git remote -v
    echo ""
    read -p "是否要更换远程仓库? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
    else
        echo "跳过，使用现有仓库"
        REMOTE_URL=$(git remote get-url origin)
        echo ""
        echo "准备推送到: $REMOTE_URL"
        echo ""
        git push -u origin main
        echo ""
        echo "✅ 代码已推送！"
        echo ""
        echo "下一步："
        echo "1. 访问 https://railway.app"
        echo "2. 点击 'New Project' → 'Deploy from GitHub repo'"
        echo "3. 选择 discord-gemini-bot 仓库"
        echo "4. 添加环境变量："
        echo "   - DISCORD_TOKEN"
        echo "   - GPTSAPI_KEY"
        echo "   - PREFIX=!"
        echo ""
        exit 0
    fi
fi

echo "请按以下步骤操作："
echo ""
echo "1. 访问 https://github.com/new"
echo "2. 创建新仓库，名称：discord-gemini-bot"
echo "3. 不要勾选 'Add a README file'"
echo "4. 点击 'Create repository'"
echo ""
read -p "按回车继续..." </dev/tty

echo ""
echo "请输入你的 GitHub 用户名："
read GITHUB_USERNAME </dev/tty

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ 用户名不能为空"
    exit 1
fi

REMOTE_URL="https://github.com/$GITHUB_USERNAME/discord-gemini-bot.git"

echo ""
echo "将添加远程仓库：$REMOTE_URL"
read -p "确认? (y/n): " -n 1 -r </dev/tty
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消"
    exit 0
fi

git remote add origin $REMOTE_URL
git branch -M main

echo ""
echo "📤 正在推送到 GitHub..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub!"
    echo ""
    echo "=========================================="
    echo "   下一步：部署到 Railway"
    echo "=========================================="
    echo ""
    echo "1. 访问 https://railway.app"
    echo "2. 使用 GitHub 账号登录"
    echo "3. 点击 'New Project'"
    echo "4. 选择 'Deploy from GitHub repo'"
    echo "5. 找到并选择 discord-gemini-bot"
    echo ""
    echo "=========================================="
    echo "   配置环境变量"
    echo "=========================================="
    echo ""
    echo "在 Railway 项目中点击 'Variables'，添加："
    echo ""
    echo "DISCORD_TOKEN=你的Discord_Token"
    echo ""
    echo "GPTSAPI_KEY=你的GPTSAPI_Key"
    echo ""
    echo "PREFIX=!"
    echo ""
    echo "=========================================="
    echo ""
    echo "🎉 配置完成后，Railway 会自动部署！"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的原因："
    echo "1. 仓库名称不对"
    echo "2. 仓库已存在但名称不同"
    echo "3. GitHub 认证问题"
    echo ""
    echo "请检查后重试"
    exit 1
fi
