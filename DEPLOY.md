# 部署指南 - Railway

## 方法一：使用 Railway 部署（推荐）

### 第一步：推送到 GitHub

```bash
# 1. 在 GitHub 创建新仓库，名字例如：discord-gemini-bot

# 2. 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/discord-gemini-bot.git

# 3. 提交代码
git add .
git commit -m "Initial commit: Discord Gemini Bot"

# 4. 推送到 GitHub
git branch -M main
git push -u origin main
```

### 第二步：在 Railway 部署

1. **访问 Railway**
   - 打开 https://railway.app
   - 使用 GitHub 账号登录

2. **创建新项目**
   - 点击 "New Project" → "Deploy from GitHub repo"
   - 选择你的 `discord-gemini-bot` 仓库

3. **配置环境变量**
   - 在项目页面点击 "Variables"
   - 添加以下环境变量（从 .env 文件中获取）：
   ```
   DISCORD_TOKEN=你的Discord_Bot_Token
   GPTSAPI_KEY=你的GPTSAPI_Key
   PREFIX=!
   ```

4. **部署**
   - Railway 会自动检测并部署
   - 等待部署完成（约 1-2 分钟）

5. **查看日志**
   - 点击 "View Logs" 查看运行状态
   - 看到 "✅ Bot logged in" 表示成功

### 第三步：邀请 Bot 到 Discord

Railway 的 Bot 和本地是同一个，使用相同的邀请链接。

---

## 方法二：使用 Render 部署

### 访问 https://render.com

1. 注册/登录（使用 GitHub）
2. 点击 "New +" → "Web Service"
3. 连接 GitHub 仓库
4. 配置：
   - **Build Command**: `npm install`
   - **Start Command**: `node bot.js`
5. 添加环境变量（同上）
6. 部署

---

## 方法三：使用 Fly.io 部署

### 安装 Fly CLI

```bash
curl -L https://fly.io/install.sh | sh
```

### 部署

```bash
# 登录
fly auth login

# 启动应用
fly launch

# 设置环境变量
fly secrets set DISCORD_TOKEN=你的Token
fly secrets set GPTSAPI_KEY=你的Key
fly secrets set PREFIX=!

# 部署
fly deploy
```

---

## 管理你的 Bot

### Railway 查看日志
访问 Railway 项目 → View Logs

### 重启 Bot
Railway 项目 → Restart

### 更新代码
```bash
git add .
git commit -m "Update bot"
git push
```
Railway 会自动重新部署。

---

## 注意事项

✅ **优点**
- 免费
- 24/7 持续运行
- 不需要代理
- 自动更新

⚠️ **注意事项**
- Railway 免费额度：$5/月（足够运行一个 bot）
- Render 免费版可能会休眠（15分钟无活动后）
- 环境变量已在配置中，不需要重新输入

---

## 需要帮助？

如果遇到问题：
1. 检查日志查看错误信息
2. 确认环境变量设置正确
3. 确保 Discord Bot Token 有效
4. 确保 GPTSAPI Key 有余额
