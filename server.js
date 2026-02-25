// Glitch 需要一个 web server 来保持应用运行
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 简单的健康检查端点
app.get('/', (req, res) => {
  res.send('Discord Gemini Bot is running!');
});

// 启动 web server
app.listen(port, () => {
  console.log(`Web server listening on port ${port}`);
});

// 启动 Discord bot
require('./bot-glitch.js');
