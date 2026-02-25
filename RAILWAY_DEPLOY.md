# Railway 部署指南

## 方法一：使用命令行部署（推荐）

### 第一步：安装并登录 Railway CLI

```bash
# 1. 登录 Railway（会打开浏览器）
railway login

# 2. 确认登录成功
railway whoami
```

### 第二步：初始化项目

```bash
# 进入项目目录
cd discord-gemini-bot

# 初始化 Railway 项目
railway init
```

### 第三步：配置环境变量

```bash
railway variables set DISCORD_TOKEN=你的Discord_Token
railway variables set GPTSAPI_KEY=你的GPTSAPI_Key
railway variables set PREFIX=!
```

### 第四步：部署

```bash
railway up
```

等待部署完成（约 1-2 分钟）

### 第五步：查看状态

```bash
# 查看日志
railway logs

# 打开项目面板
railway open
```

---

## 方法二：使用网页部署

### 1. 访问 Railway
打开 https://railway.app，使用 GitHub 账号登录

### 2. 创建新项目
点击 **"New Project"** → **"Deploy from GitHub repo"**

### 3. 选择仓库
找到并选择 `discord-gemini-bot`

### 4. 配置环境变量
点击 **"Variables"**，添加：
```
DISCORD_TOKEN=你的Discord_Token
GPTSAPI_KEY=你的GPTSAPI_Key
PREFIX=!
```

### 5. 部署
Railway 会自动检测并部署

### 6. 查看日志
点击 **"View Logs"** 查看 bot 运行状态

---

## 常用命令

```bash
# 查看日志
railway logs

# 查看项目状态
railway status

# 打开项目面板
railway open

# 重新部署
railway up

# 查看环境变量
railway variables list
```

---

## 验证部署

部署成功后，在 Discord 中：
1. 确认 bot 在线（服务器成员列表中可见）
2. 发送 `/chat 你好` 测试
3. 或发送 `!你好`

---

## 常见问题

### Q: 部署失败？
A:
1. 检查环境变量是否正确
2. 查看日志：`railway logs`

### Q: Bot 不在线？
A:
1. 确认部署成功
2. 检查 bot 是否已邀请到服务器
3. 查看日志确认是否有错误

### Q: 如何更新 bot？
A:
```bash
git add .
git commit -m "Update"
git push
railway up
```
