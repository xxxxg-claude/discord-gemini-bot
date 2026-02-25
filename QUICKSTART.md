# 快速配置指南

## 第一步：获取 Discord Bot Token

### 1. 创建 Discord 应用
1. 访问 https://discord.com/developers/applications
2. 点击 "New Application" 按钮
3. 输入应用名称（如：Gemini Bot）
4. 点击 "Create"

### 2. 创建 Bot
1. 在左侧菜单点击 "Bot"
2. 点击 "Reset Token" 或 "Add Bot"
3. 点击 "Yes, do it!"
4. **复制 Token**（只显示一次，请妥善保管）

## 第二步：获取 GPTSAPI Key

### 1. 注册账号
1. 访问 https://gptsapi.net
2. 注册账号
3. 登录后进入控制台

### 2. 获取 API Key
1. 在控制台找到 "API Key" 或 "令牌" 区域
2. 复制你的 API Key

## 第三步：配置 Bot

### 1. 创建配置文件
```bash
cd discord-gemini-bot
cp .env.example .env
```

### 2. 编辑 .env 文件
```bash
# macOS/Linux
nano .env

# 或使用任何文本编辑器
```

填入你的密钥：
```env
DISCORD_TOKEN=你复制的Discord_Token
GPTSAPI_KEY=你复制的GPTSAPI_Key
PREFIX=!
```

保存并退出（nano按 Ctrl+X，然后Y，再按回车）

## 第四步：邀请 Bot 到服务器

### 1. 生成邀请链接
1. 回到 Discord Developer Portal
2. 进入你的应用
3. 点击 "OAuth2" -> "URL Generator"
4. 勾选以下 Scopes：
   - `bot`
   - `applications.commands`

5. 在 Bot Permissions 中勾选：
   - ✅ Send Messages
   - ✅ Read Message History
   - ✅ Use Slash Commands
   - ✅ Read Messages/View Channels

6. 复制底部生成的链接

### 2. 邀请 Bot
1. 在浏览器中打开复制的链接
2. 选择你的服务器
3. 点击 "授权"
4. 完成人机验证（如果需要）

## 第五步：启动 Bot

```bash
# 安装依赖（首次运行）
npm install

# 启动 bot
npm start

# 或使用启动脚本
./start.sh
```

## 测试 Bot

在你的 Discord 服务器中尝试以下命令：

1. `/chat 你好`
2. `!介绍一下你自己`
3. `@你的机器人名字 帮我写一首诗`

## 常见问题

### Q: Bot 不回复消息？
A: 检查以下几点：
- Bot 是否在线（Discord 服务器列表中应该能看到）
- `.env` 文件配置是否正确
- Token 和 Key 是否有多余的空格

### Q: 斜杠命令不工作？
A:
- 确保邀请时勾选了 `applications.commands` 权限
- 重新邀请 Bot 到服务器
- 等 1-2 分钟让 Discord 同步命令

### Q: API 调用失败？
A:
- 检查 gptsapi.net 账户余额
- 确认网络连接正常
- 查看 bot 运行日志

### Q: 如何保持 bot 持续运行？
A: 使用 PM2：

```bash
# 安装 PM2
npm install -g pm2

# 启动 bot
pm2 start bot.js --name discord-gemini-bot

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs discord-gemini-bot

# 查看状态
pm2 status
```

## 需要帮助？

查看完整文档：[README.md](README.md)
