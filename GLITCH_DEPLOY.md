# Glitch 部署指南

## 方法一：直接在 Glitch 创建（推荐，最简单）

### 第一步：访问 Glitch

打开浏览器访问：https://glitch.com

### 第二步：登录/注册

- 点击 **"Sign in"**
- 使用 GitHub 账号登录（或使用邮箱注册）

### 第三步：创建新项目

1. 点击右上角的 **"New Project"**
2. 选择 **"glitch-hello-node"** 或 **"Import from GitHub"**

### 第四步：上传代码

**如果选择 "Import from GitHub"：**
1. 输入你的 GitHub 仓库地址：`https://github.com/xxxxg-claude/discord-gemini-bot`
2. 点击 **"Import"**

**如果选择空白项目：**
1. 删除所有默认文件
2. 复制以下文件内容到 Glitch：
   - `package.json`
   - `server.js`
   - `bot-glitch.js`（重命名为 `bot-glitch.js`）
   - `.env`

### 第五步：配置环境变量

在 Glitch 的 `.env` 文件中添加：

```
DISCORD_TOKEN=你的Discord_Token
GPTSAPI_KEY=你的GPTSAPI_Key
PREFIX=!
```

### 第六步：安装依赖并启动

1. 点击 **"Logs"** 查看日志
2. Glitch 会自动运行 `npm install`
3. 看到 `✅ Bot 已登录!` 表示成功

---

## 方法二：从 GitHub 导入（更简单）

### 1. 访问 Glitch
https://glitch.com

### 2. 登录后点击 "New Project"

### 3. 选择 "Import from GitHub"

### 4. 输入仓库地址
```
https://github.com/xxxxg-claude/discord-gemini-bot
```

### 5. 点击 "Import"

### 6. 配置 .env 文件
在 Glitch 编辑器中打开 `.env`，添加：
```
DISCORD_TOKEN=你的Discord_Token
GPTSAPI_KEY=你的GPTSAPI_Key
PREFIX=!
```

### 7. 查看 Logs
点击顶部工具栏的 **"Logs"**，看到 `✅ Bot 已登录!` 即成功

---

## 验证部署

在 Discord 中测试：
```
/chat 你好
```

或发送：
```
!你好
```

---

## Glitch 优势

- ✅ **完全免费**
- ✅ **不需要信用卡**
- ✅ **每月 1000 小时**（24/7 = 720小时/月，够用！）
- ✅ **永久免费**
- ✅ **7 天无活动后休眠**（比 Render 好）
- ✅ **部署超简单**

---

## 常见问题

### Q: Bot 不在线？
A:
1. 检查 `.env` 文件是否正确配置
2. 查看 Logs 是否有错误
3. 等待 1-2 分钟让 Glitch 启动

### Q: 如何保持 bot 活跃？
A:
- Glitch 7 天无活动才休眠
- 定期和 bot 对话即可保持活跃

### Q: 1000 小时够用吗？
A:
- 24/7 运行 = 720 小时/月
- 1000 小时完全够用！

---

## 需要帮助？

查看 Glitch 文档：https://glitch.com/help
