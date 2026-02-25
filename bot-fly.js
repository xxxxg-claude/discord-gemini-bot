require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const OpenAI = require('openai');

console.log('🚀 Discord Gemini Bot 启动中...\n');

// Create Discord client (no proxy needed on Fly.io)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.GPTSAPI_KEY,
    baseURL: 'https://api.gptsapi.net/v1'
});

// Bot configuration
const CONFIG = {
    model: 'gemini-3-flash-preview',
    maxTokens: 4096,
    temperature: 0.7
};

// Conversation memory
const conversations = new Map();

// System prompt
const SYSTEM_PROMPT = `You are a helpful AI assistant powered by Gemini 3 Flash Preview. You are friendly, knowledgeable, and concise in your responses.`;

// When bot is ready
client.once('ready', () => {
    console.log(`\n✅ Bot 已登录!`);
    console.log(`📌 名称: ${client.user.tag}`);
    console.log(`📌 ID: ${client.user.id}`);
    console.log(`📱 服务: ${client.guilds.cache.size} 个服务器`);
    client.user.setActivity('Gemini 3 Flash', { type: 'PLAYING' });
    console.log('\n🎉 Bot 正在运行!\n');
});

// Handle messages
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const prefix = process.env.PREFIX || '!';
    const isMentioned = message.mentions.has(client.user);
    const hasPrefix = message.content.startsWith(prefix);

    if (!isMentioned && !hasPrefix) return;

    let userMessage = message.content;
    if (hasPrefix) {
        userMessage = userMessage.slice(prefix.length).trim();
    } else {
        userMessage = userMessage.replace(new RegExp(`<@!?${client.user.id}>`), '').trim();
    }

    if (!userMessage) return;

    console.log(`\n📨 收到消息: ${userMessage}`);

    try {
        await message.channel.sendTyping();

        const userId = message.author.id;
        if (!conversations.has(userId)) {
            conversations.set(userId, [
                { role: 'system', content: SYSTEM_PROMPT }
            ]);
        }

        const history = conversations.get(userId);
        history.push({ role: 'user', content: userMessage });

        if (history.length > 20) {
            history.splice(0, history.length - 20);
        }

        console.log('🤖 调用 Gemini API...');

        const completion = await openai.chat.completions.create({
            model: CONFIG.model,
            messages: history,
            max_tokens: CONFIG.maxTokens,
            temperature: CONFIG.temperature
        });

        const response = completion.choices[0].message.content;
        history.push({ role: 'assistant', content: response });

        console.log(`✅ 回复: ${response.substring(0, 50)}...`);

        const embed = new EmbedBuilder()
            .setColor(0x00FF99)
            .setDescription(response)
            .setTimestamp()
            .setFooter({ text: `Powered by Gemini 3 Flash | gptsapi.net` });

        await message.reply({ embeds: [embed] });

    } catch (error) {
        console.error('❌ 错误:', error.message);
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('❌ Error')
            .setDescription(error.message || 'Failed to get response from API')
            .setTimestamp();
        await message.reply({ embeds: [errorEmbed] });
    }
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'chat') {
        await interaction.deferReply();
        const userMessage = interaction.options.getString('message');

        try {
            const userId = interaction.user.id;
            if (!conversations.has(userId)) {
                conversations.set(userId, [
                    { role: 'system', content: SYSTEM_PROMPT }
                ]);
            }

            const history = conversations.get(userId);
            history.push({ role: 'user', content: userMessage });

            if (history.length > 20) {
                history.splice(0, history.length - 20);
            }

            const completion = await openai.chat.completions.create({
                model: CONFIG.model,
                messages: history,
                max_tokens: CONFIG.maxTokens,
                temperature: CONFIG.temperature
            });

            const response = completion.choices[0].message.content;
            history.push({ role: 'assistant', content: response });

            const embed = new EmbedBuilder()
                .setColor(0x00FF99)
                .setDescription(response)
                .setTimestamp()
                .setFooter({ text: `Powered by Gemini 3 Flash | gptsapi.net` });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ 错误:', error.message);
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Error')
                .setDescription(error.message || 'Failed to get response')
                .setTimestamp();
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }

    if (commandName === 'clear') {
        conversations.delete(interaction.user.id);
        await interaction.reply({ content: '✅ Conversation history cleared!', ephemeral: true });
    }

    if (commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🤖 Gemini Bot Commands')
            .addFields(
                { name: '/chat <message>', value: 'Chat with Gemini 3 Flash', inline: false },
                { name: '/clear', value: 'Clear your conversation history', inline: false },
                { name: '!<message> or @bot', value: 'Quick chat without slash command', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Powered by gptsapi.net' });
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    }
});

// Register slash commands
client.once('ready', async () => {
    const commands = [
        {
            name: 'chat',
            description: 'Chat with Gemini 3 Flash',
            options: [
                {
                    name: 'message',
                    type: 3,
                    description: 'Your message to Gemini',
                    required: true
                }
            ]
        },
        {
            name: 'clear',
            description: 'Clear your conversation history'
        },
        {
            name: 'help',
            description: 'Show bot commands'
        }
    ];

    try {
        await client.application.commands.set(commands);
        console.log('✅ 斜杠命令已注册\n');
    } catch (error) {
        console.error('⚠️  命令注册失败:', error.message);
    }
});

// Error handling
client.on('error', (error) => {
    console.error('❌ Discord 错误:', error.message);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ 未处理的 Promise 拒绝:', error);
});

// Login
console.log('🔗 正在连接到 Discord...\n');
client.login(process.env.DISCORD_TOKEN);
