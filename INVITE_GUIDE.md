# Discord Bot 邀请链接生成指南

## 步骤详解

### 1️⃣ 访问 Discord Developer Portal
```
https://discord.com/developers/applications
```

### 2️⃣ 选择你的应用
在列表中点击你刚创建的应用（如 "Gemini Bot"）

### 3️⃣ 生成邀请链接

#### A. 进入 OAuth2 页面
- 点击左侧菜单 **"OAuth2"**
- 再点击 **"URL Generator"**

#### B. 勾选 Scopes（授权范围）
在 "Scopes" 区域勾选以下两项：
```
☑ bot
☑ applications.commands
```

#### C. 勾选 Bot Permissions（机器人权限）
在 "Bot Permissions" 区域勾选：
```
☑ Send Messages           - 发送消息
☑ Read Message History    - 读取消息历史
☑ Use Slash Commands      - 使用斜杠命令
☑ Read Messages/View Channels - 读取消息/查看频道
```

### 4️⃣ 复制并使用邀请链接
- 页面底部会自动生成一个链接
- 复制整个链接
- 在浏览器新标签页中打开
- 选择你要添加 Bot 的服务器
- 点击 **"授权"** 按钮
- 完成人机验证（如有）

### 5️⃣ 配置并启动 Bot

#### 编辑 .env 文件
```bash
cd discord-gemini-bot
nano .env
```

填入你的密钥：
```env
DISCORD_TOKEN=你的Discord_Token
GPTSAPI_KEY=你的GPTSAPI_Key
```

#### 启动 Bot
```bash
npm start
```

### ✅ 验证 Bot 是否在线

启动成功后，你会看到：
```
✅ Bot logged in as YourBot#1234
📱 Serving 1 servers
✅ Slash commands registered
```

在 Discord 中检查：
1. 服务器成员列表中应该能看到 Bot
2. Bot 状态显示为在线
3. Bot 的活动显示 "Playing Gemini 3 Flash"

### 🎮 测试 Bot

在 Discord 频道中尝试：
```
/chat 你好
!介绍一下你自己
@你的机器人名字 帮我写一首诗
```

## 常见问题

### ❌ "Invalid Token" 错误
→ 检查 .env 文件中的 DISCORD_TOKEN 是否正确（没有多余空格）

### ❌ "403 Forbidden" 错误
→ Bot 没有权限，重新邀请并确保勾选了所有需要的权限

### ❌ 斜杠命令不显示
→ 等待 1-2 分钟让 Discord 同步，或重新发送邀请链接

### ❌ Bot 不回复消息
→ 检查 gptsapi.net 账户余额和 API Key 是否正确

## 邀请链接示例格式

生成后的链接类似：
```
https://discord.com/oauth2/authorize?client_id=123456789012345678&permissions=274878024768&scope=bot%20applications.commands
```

其中的 `client_id` 是你的应用 ID，`permissions` 是权限编码。
