require('dotenv').config();
const { bootstrap } = require('global-agent');

// Bootstrap global proxy
bootstrap();
console.log('✅ 全局代理已启用');

const { Client, GatewayIntentBits } = require('discord.js');

console.log('🔍 测试 Discord Bot 连接...\n');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
    console.log('\n✅ Discord Bot 连接成功!\n');
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

    console.log('🎉 配置完成！可以启动 bot 了\n');
    client.destroy();
    process.exit(0);
});

client.on('error', (error) => {
    console.error('❌ Discord 连接错误:', error.message);
    process.exit(1);
});

console.log('🚀 正在连接到 Discord...\n');
client.login(process.env.DISCORD_TOKEN);

setTimeout(() => {
    console.error('\n❌ 连接超时');
    console.error('💡 请检查:');
    console.error('   1. 火烧云 VPN 是否开启');
    console.error('   2. 是否是全局代理模式');
    process.exit(1);
}, 30000);
