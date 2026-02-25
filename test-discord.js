require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { HttpsProxyAgent } = require('https-proxy-agent');

console.log('🔍 测试 Discord Bot 连接...\n');

// 检查环境变量
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ 错误: DISCORD_TOKEN 未设置');
    process.exit(1);
}

// Configure proxy
let clientOptions = {
    intents: [GatewayIntentBits.Guilds]
};

if (process.env.PROXY_URL) {
    const proxyAgent = new HttpsProxyAgent(process.env.PROXY_URL);
    clientOptions.agent = proxyAgent;
    console.log(`✅ 代理配置: ${process.env.PROXY_URL}\n`);
} else {
    console.log('⚠️  未配置代理\n');
}

console.log('✅ DISCORD_TOKEN 已设置\n');
console.log('🚀 正在连接到 Discord...\n');

const client = new Client(clientOptions);

client.once('ready', () => {
    console.log('✅ Discord Bot 连接成功!\n');
    console.log('📌 Bot 名称:', client.user.tag);
    console.log('📌 Bot ID:', client.user.id);
    console.log('📱 服务服务器数量:', client.guilds.cache.size);

    if (client.guilds.cache.size > 0) {
        console.log('\n📋 Bot 所在服务器:');
        client.guilds.cache.forEach(guild => {
            console.log(`   - ${guild.name} (ID: ${guild.id})`);
        });
    } else {
        console.log('\n⚠️  Bot 还未加入任何服务器');
        console.log('💡 请访问 https://discord.com/developers/applications');
        console.log('   进入 OAuth2 > URL Generator 生成邀请链接\n');
    }

    console.log('🎉 配置完成！可以启动 bot 了: npm start\n');
    client.destroy();
    process.exit(0);
});

client.on('error', (error) => {
    console.error('❌ Discord 连接错误:', error.message);
    process.exit(1);
});

client.login(process.env.DISCORD_TOKEN);

setTimeout(() => {
    console.error('❌ 连接超时');
    console.error('💡 请检查代理设置');
    process.exit(1);
}, 30000);
