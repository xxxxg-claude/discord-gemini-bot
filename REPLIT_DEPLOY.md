# Replit 部署指南

## 🚀 部署步骤（超简单）

### 第一步：访问 Replit

打开浏览器访问：https://replit.com

### 第二步：登录

点击右上角 **"Sign up"** 或 **"Log in"**
- 选择 **"Continue with GitHub"**
- 授权 Replit 访问你的 GitHub

### 第三步：创建新 Repl

1. 点击左上角的 **"+ Create Repl"** 按钮
2. 在页面左侧点击 **"Import from GitHub"**
3. 在输入框中粘贴你的仓库地址：
   ```
   https://github.com/xxxxg-claude/discord-gemini-bot
   ```
4. 点击 **"Import"**

### 第四步：配置环境变量

1. 在 Replit 左侧文件列表中找到 **".env"** 文件
2. 如果没有，点击 **"Add file"** 创建 `.env`
3. 填入以下内容：
```
DISCORD_TOKEN=你的Discord_Token
GPTSAPI_KEY=你的GPTSAPI_Key
PREFIX=!
PORT=3000
```

**重要：把"你的Discord_Token"和"你的GPTSAPI_Key"替换成实际的值！**

### 第五步：运行 Bot

1. 点击顶部绿色的 **"Run"** 按钮
2. 查看控制台输出
3. 看到 `✅ Bot 已登录!` 表示成功！

---

## 🎯 验证部署

在 Discord 中发送：
```
/chat 你好
```

或：
```
!你好
```

---

## 🔄 保持 Bot 活跃

**Replit 免费版限制：**
- ⚠️ **30 分钟无活动后休眠**
- ⚠️ **需要手动点击 "Run" 唤醒**

**解决方法：**
1. 定期和 bot 对话（每天至少一次）
2. 使用外部服务 ping 你的 Repl（如 UptimeRobot）
3. 升级到 Replit Core ($20/月，无休眠)

---

## 📊 查看日志

- 在 Replit 的 **Console** 面板可以看到所有日志
- 查看 bot 运行状态和错误信息

---

## ⚙️ 管理你的 Repl

### 停止 Bot
- 点击红色的 **"Stop"** 按钮

### 重启 Bot
- 点击绿色的 **"Run"** 按钮

### 查看文件
- 左侧文件列表可以查看和编辑所有文件

---

## 💡 Replit 优势

- ✅ **完全免费**
- ✅ **不需要信用卡**
- ✅ **每月 1000 小时**
- ✅ **永久免费**
- ✅ **部署超简单**
- ✅ **在线编辑器**
- ✅ **自动保存**

---

## 💡 小技巧

### 保持 Bot 活跃的方法

**方法一：定期对话**
- 每天至少和 bot 对话一次
- 设置定时任务（使用其他服务）

**方法二：使用 UptimeRobot**
1. 访问 https://uptimerobot.com
2. 注册免费账号
3. 添加你的 Replit URL
4. 设置每 5-20 分钟 ping 一次

**方法三：自建 ping 脚本**
在另一个 Replit 中运行一个简单的定时脚本。

---

## 常见问题

### Q: Bot 离线了怎么办？
A:
1. 打开你的 Replit 项目
2. 点击绿色的 "Run" 按钮
3. 等待 bot 重启

### Q: 如何查看错误信息？
A:
- 查看 Console 面板的红色错误信息
- 检查 `.env` 文件是否正确

### Q: 1000 小时够用吗？
A:
- 24/7 运行 = 720 小时/月
- 1000 小时完全够用！

### Q: 为什么 bot 会休眠？
A:
- Replit 免费版 30 分钟无活动后休眠
- 这是免费版的限制
- 可以升级付费版或使用 ping 服务保持活跃

---

## 需要帮助？

查看 Replit 文档：https://docs.replit.com
