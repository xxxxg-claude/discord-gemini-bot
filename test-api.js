require('dotenv').config();
const OpenAI = require('openai');

console.log('🔍 测试 GPTSAPI 连接...\n');

// 检查环境变量
if (!process.env.GPTSAPI_KEY) {
    console.error('❌ 错误: GPTSAPI_KEY 未设置');
    process.exit(1);
}

console.log('✅ GPTSAPI_KEY 已设置');
console.log('📝 API Key 前10位:', process.env.GPTSAPI_KEY.substring(0, 10) + '...\n');

// 初始化 OpenAI 客户端
const openai = new OpenAI({
    apiKey: process.env.GPTSAPI_KEY,
    baseURL: 'https://api.gptsapi.net/v1'
});

console.log('🚀 发送测试请求到 Gemini 3 Flash Preview...\n');

// 测试 API 调用
async function testAPI() {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gemini-3-flash-preview',
            messages: [
                { role: 'system', content: '你是一个简洁的AI助手。' },
                { role: 'user', content: '用一句话介绍你自己。' }
            ],
            max_tokens: 100
        });

        console.log('✅ API 调用成功!\n');
        console.log('📌 模型:', completion.model);
        console.log('💬 回复:', completion.choices[0].message.content);
        console.log('\n🎉 GPTSAPI 配置正确，可以启动 Discord Bot!');

    } catch (error) {
        console.error('❌ API 调用失败!\n');
        console.error('错误信息:', error.message);

        if (error.message.includes('401')) {
            console.error('\n💡 可能的原因:');
            console.error('   - API Key 不正确');
            console.error('   - API Key 已过期');
            console.error('   - 账户余额不足');
        } else if (error.message.includes('model')) {
            console.error('\n💡 可能的原因:');
            console.error('   - 模型名称不正确');
            console.error('   - 账户无权访问此模型');
        }

        process.exit(1);
    }
}

testAPI();
