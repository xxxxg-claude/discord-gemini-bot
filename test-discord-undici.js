require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { ProxyAgent } = require('undici');

console.log('🔍 测试 Discord Bot 连接 (使用 undici ProxyAgent)\n');

// Configure proxy
let clientOptions = {
    intents: [GatewayIntentBits.Guilds]
};

if (process.env.PROXY_URL) {
    const agent = new ProxyAgent(process.env.PROXY_URL);
    clientOptions.agent = agent;
    clientOptions.options = { agent };
    console.log(`✅ 代理配置: ${process.env.PROXY_URL}\n`);
} else {
    console.log('⚠️  未配置代理\n');
}

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
    }

    console.log('\n🎉 可以启动 bot 了: npm start\n');
    client.destroy();
    process.exit(0);
});

client.on('error', (error) => {
    console.error('❌ Discord 连接错误:', error.message);
    process.exit(1);
});

client.login(process.env.DISCORD_TOKEN);

setTimeout(() => {
    console.error('\n❌ 连接超时');
    process.exit(1);
}, 30000);
