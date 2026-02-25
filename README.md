# Discord Gemini Bot

一个使用 [gptsapi.net](https://gptsapi.net) 提供的 Gemini 2.0 Flash 模型的 Discord 机器人。

## 功能特点

- 支持 Gemini 2.0 Flash 模型
- 支持对话历史记录
- 支持斜杠命令 (/)
- 支持前缀命令 (!)
- 支持 @ 机器人直接对话
- 漂亮的嵌入式消息显示

## 安装步骤

### 1. 创建 Discord 应用

1. 访问 [Discord Developer Portal](https://discord.com/developers/applications)
2. 点击 "New Application" 创建新应用
3. 在 "Bot" 页面创建 Bot 并获取 Token

### 2. 获取 GPTSAPI Key

1. 访问 [gptsapi.net](https://gptsapi.net)
2. 注册账号并获取 API Key

### 3. 配置环境变量

1. 复制 `.env.example` 为 `.env`:
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的密钥:
```env
DISCORD_TOKEN=你的Discord_Bot_Token
GPTSAPI_KEY=你的GPTSAPI_Key
PREFIX=!
```

### 4. 安装依赖

```bash
npm install
```

### 5. 启动 Bot

```bash
node bot.js
```

## 使用方法

### 方式一：斜杠命令

- `/chat 你好` - 与 Gemini 对话
- `/clear` - 清除对话历史
- `/help` - 显示帮助信息

### 方式二：前缀命令

- `!你好` - 使用 ! 前缀与机器人对话

### 方式三：@ 机器人

- `@机器人 你好` - 直接 @ 机器人进行对话

## 邀请 Bot 到服务器

1. 在 Discord Developer Portal 中，进入你的应用
2. 进入 "OAuth2" -> "URL Generator"
3. 选择以下权限:
   - `bot`
   - `applications.commands`
4. 在 Bot Permissions 中选择:
   - `Send Messages`
   - `Read Message History`
   - `Use Slash Commands`
   - `Read Messages/View Channels`
5. 复制生成的链接并在浏览器中打开，选择服务器邀请

## 开机自启动 (使用 PM2)

```bash
# 安装 PM2
npm install -g pm2

# 启动 bot
pm2 start bot.js --name discord-gemini-bot

# 设置开机自启动
pm2 startup
pm2 save

# 查看日志
pm2 logs discord-gemini-bot

# 重启 bot
pm2 restart discord-gemini-bot
```

## 配置说明

| 配置项 | 说明 |
|--------|------|
| `DISCORD_TOKEN` | Discord Bot Token |
| `GPTSAPI_KEY` | gptsapi.net API Key |
| `PREFIX` | 命令前缀，默认为 `!` |

## 注意事项

1. 请妥善保管你的 API Key 和 Token
2. 对话历史存储在内存中，重启 bot 会清空
3. 建议使用 PM2 或 systemd 保持 bot 持续运行
4. 保留最近 20 条对话记录以节省 token

## 故障排除

### Bot 无法启动
- 检查 `.env` 文件配置是否正确
- 确认 Token 和 Key 无多余空格

### 斜杠命令无法使用
- 确保已授予 `applications.commands` 权限
- 重新邀请 bot 到服务器

### API 调用失败
- 检查 gptsapi.net 账户余额
- 确认网络连接正常

## 许可证

ISC
