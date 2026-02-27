require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const OpenAI = require('openai');

// ==================== 配置 ====================

// Discord 配置
let discordOptions = {
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
};

const client = new Client(discordOptions);

// OpenAI 客户端
const openai = new OpenAI({
    apiKey: process.env.GPTSAPI_KEY,
    baseURL: 'https://api.gptsapi.net/v1'
});

const CONFIG = {
    model: 'gemini-3-flash-preview',
    maxTokens: 4096,
    temperature: 0.7
};

// ==================== 对话存储 ====================

// 普通对话
const conversations = new Map();

// 心理对话（独立存储）
const psychConversations = new Map();
const psychUserData = new Map(); // 用户心理档案

// ==================== 系统提示词 ====================

// 普通助手的提示词
const SYSTEM_PROMPT = `You are a helpful AI assistant powered by Gemini 3 Flash Preview. You are friendly, knowledgeable, and concise in your responses.`;

// 心理助手的提示词（基于CBT）
const PSYCH_SYSTEM_PROMPT = `你是一位基于认知行为疗法(CBT)的AI心理咨询助手。

【你的角色】
你是心理咨询师的"练习伙伴"，在两次咨询之间陪伴用户，帮助完成练习。

【核心原则】
1. **温暖共情**：先理解和接纳情绪，再分析问题
2. **引导而非说教**：用苏格拉底式提问让用户自己发现
3. **聚焦当下**：关注"此时此地"的具体问题
4. **循序渐进**：每次对话解决1-2个具体问题
5. **安全第一**：遇到危机信号立即引导求助

【对话流程】
当用户分享问题时：
第1步 - 情绪确认："我听到了，你现在感到[情绪]，是因为[情境]，对吗？"
第2步 - 识别想法："当时你脑中闪过的想法是什么？"
第3步 - 挑战想法（如果是不合理信念）："这个想法有证据吗？有没有反面证据？"
第4步 - 生成替代想法："考虑到这些证据，有没有更平衡的想法？"
第5步 - 布置行动："这周你可以尝试[具体行动]，好吗？"

【常见的认知扭曲类型】
- 非黑即白：用极端方式看待事物
- 灾难化：预设最坏的结果
- 过度概括：基于单一事件做普遍结论
- 心灵过滤：只关注负面，忽略正面
- 个人化：把不是你的责任揽到自己身上
- 应该陈述：用"应该"严格要求自己或他人

【危机识别】
如果用户提到以下内容，立即启动危机干预：
- 自杀、自伤、不想活等词汇
- 绝望感（"没有意义""坚持下去没意思"）
- 具体伤害计划

危机处理：
"我非常担心你现在的状态。你现在的安全对我来说重要。
请立即联系心理援助热线：400-161-9995（24小时）
或前往最近医院急诊科"

【重要提醒】
- 不要给出诊断或治疗方案
- 不要声称能"治愈"任何问题
- 保持专业边界
- 定期建议用户和真人咨询师沟通
`;

// ==================== 辅助函数 ====================

// 检测危机信号
function detectCrisis(message) {
    const crisisKeywords = [
        '自杀', '自伤', '不想活', '结束生命',
        '死了算了', '没有意义', '活着没意思',
        '想死', '怎么死', '自杀方法'
    ];

    const msgLower = message.toLowerCase();
    return crisisKeywords.some(keyword => msgLower.includes(keyword));
}

// 获取情绪评分（从消息中提取数字）
function extractEmotionScore(message) {
    const match = message.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
}

// ==================== Bot 启动 ====================

client.once('ready', () => {
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    console.log(`📱 Serving ${client.guilds.cache.size} servers`);
    client.user.setActivity('Gemini 3 Flash | /psych 开启心理助手', { type: 'PLAYING' });
});

// ==================== 消息处理 ====================

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

    await message.channel.sendTyping();

    try {
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

        await message.reply({ embeds: [embed] });

    } catch (error) {
        console.error('API Error:', error.message);
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('❌ Error')
            .setDescription(error.message || 'Failed to get response from API')
            .setTimestamp();
        await message.reply({ embeds: [errorEmbed] });
    }
});

// ==================== 斜杠命令 ====================

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    // ========== /chat 命令 ==========
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
            console.error('API Error:', error.message);
            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Error')
                .setDescription(error.message || 'Failed to get response')
                .setTimestamp();
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }

    // ========== /clear 命令 ==========
    if (commandName === 'clear') {
        conversations.delete(interaction.user.id);
        psychConversations.delete(interaction.user.id);
        await interaction.reply({ content: '✅ Conversation history cleared!', ephemeral: true });
    }

    // ========== /help 命令 ==========
    if (commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🤖 Gemini Bot Commands')
            .addFields(
                { name: '/chat <message>', value: 'Chat with Gemini 3 Flash', inline: false },
                { name: '/psych', value: '开启/关闭心理助手模式', inline: false },
                { name: '/mood <score>', value: '记录今日心情 (1-10分)', inline: false },
                { name: '/my-progress', value: '查看你的情绪进度', inline: false },
                { name: '/clear', value: 'Clear your conversation history', inline: false },
                { name: '!<message> or @bot', value: 'Quick chat without slash command', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Powered by gptsapi.net' });
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    }

    // ========== /psych 命令（心理助手） ==========
    if (commandName === 'psych') {
        const action = interaction.options.getString('action');
        const userId = interaction.user.id;

        if (action === 'start') {
            // 开启心理助手模式
            if (!psychConversations.has(userId)) {
                psychConversations.set(userId, [
                    { role: 'system', content: PSYCH_SYSTEM_PROMPT }
                ]);

                // 初始化用户档案
                if (!psychUserData.has(userId)) {
                    psychUserData.set(userId, {
                        username: interaction.user.username,
                        moodHistory: [],
                        startTime: new Date(),
                        lastCheckIn: null
                    });
                }
            }

            const welcomeEmbed = new EmbedBuilder()
                .setColor(0x9B59B6) // 紫色代表心理
                .setTitle('🧠 心理助手模式已开启')
                .setDescription('你好！我是你的心理陪伴助手。\n\n我可以帮助你：\n✦ 聊聊你的感受和困扰\n✦ 一起练习认知重构\n✦ 追踪你的情绪变化\n✦ 完成咨询布置的练习\n\n有什么想聊的吗？')
                .addFields(
                    { name: '📝 命令', value: '/mood <分数> - 记录心情\n/my-progress - 查看进度\n/psych stop - 退出模式', inline: false }
                )
                .setFooter({ text: '⚠️ 我是辅助工具，不能替代专业心理咨询' })
                .setTimestamp();

            await interaction.reply({ embeds: [welcomeEmbed] });

        } else if (action === 'stop') {
            // 关闭心理助手模式
            psychConversations.delete(userId);

            const stopEmbed = new EmbedBuilder()
                .setColor(0x9B59B6)
                .setTitle('👋 心理助手模式已关闭')
                .setDescription('感谢你的信任。记得照顾好自己 😊\n\n如果需要帮助，随时可以再来！')
                .setTimestamp();

            await interaction.reply({ embeds: [stopEmbed] });
        }
    }

    // ========== /mood 命令（记录心情） ==========
    if (commandName === 'mood') {
        const score = interaction.options.getInteger('score');
        const note = interaction.options.getString('note') || '';
        const userId = interaction.user.id;

        if (!psychUserData.has(userId)) {
            await interaction.reply({ content: '⚠️ 请先使用 /psych start 开启心理助手模式', ephemeral: true });
            return;
        }

        if (score < 1 || score > 10) {
            await interaction.reply({ content: '⚠️ 心情分数必须是 1-10 之间的数字', ephemeral: true });
            return;
        }

        const userData = psychUserData.get(userId);
        userData.moodHistory.push({
            score: score,
            note: note,
            timestamp: new Date()
        });
        userData.lastCheckIn = new Date();

        // 根据分数给出不同回应
        let response = '';
        if (score >= 7) {
            response = `✅ 太好了！你今天心情不错（${score}分）。\n\n继续保持！有什么让你感到开心的事想分享吗？`;
        } else if (score >= 4) {
            response = `📊 记录了，你今天心情${score}分。\n\n还可以但有些困扰对吗？愿意和我说说吗？`;
        } else {
            response = `💙 我看到你今天心情不太好（${score}分）。\n\n我在这里陪着你。想聊聊发生了什么吗？`;
        }

        const moodEmbed = new EmbedBuilder()
            .setColor(score >= 7 ? 0x00FF00 : score >= 4 ? 0xFFFF00 : 0xFF6B6B)
            .setTitle(`📊 心情已记录：${score}/10`)
            .setDescription(response)
            .setFooter({ text: note ? `备注: ${note}` : '' })
            .setTimestamp();

        await interaction.reply({ embeds: [moodEmbed] });
    }

    // ========== /my-progress 命令（查看进度） ==========
    if (commandName === 'progress') {
        const userId = interaction.user.id;

        if (!psychUserData.has(userId)) {
            await interaction.reply({ content: '⚠️ 请先使用 /psych start 开启心理助手模式', ephemeral: true });
            return;
        }

        const userData = psychUserData.get(userId);
        const moodHistory = userData.moodHistory;

        if (moodHistory.length === 0) {
            await interaction.reply({ content: '⚠️ 你还没有记录过心情，先用 /mood 命令记录吧！', ephemeral: true });
            return;
        }

        // 计算统计数据
        const avgMood = moodHistory.reduce((sum, m) => sum + m.score, 0) / moodHistory.length;
        const latestMood = moodHistory[moodHistory.length - 1].score;
        const daysTracked = moodHistory.length;

        // 趋势分析
        let trend = '稳定';
        if (moodHistory.length >= 3) {
            const recent = moodHistory.slice(-3);
            const recentAvg = recent.reduce((sum, m) => sum + m.score, 0) / 3;
            if (recentAvg > avgMood + 1) trend = '改善 📈';
            else if (recentAvg < avgMood - 1) trend = '需要关注 📉';
        }

        const progressEmbed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setTitle(`📊 ${interaction.user.username} 的情绪进度`)
            .addFields(
                { name: '追踪天数', value: `${daysTracked} 天`, inline: true },
                { name: '平均心情', value: `${avgMood.toFixed(1)}/10`, inline: true },
                { name: '最新心情', value: `${latestMood}/10`, inline: true },
                { name: '趋势', value: trend, inline: false }
            )
            .setFooter({ text: '继续记录，观察自己的变化！' })
            .setTimestamp();

        await interaction.reply({ embeds: [progressEmbed] });
    }
});

// ==================== 心理模式消息处理 ====================

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const userId = message.author.id;

    // 只处理心理模式下的消息
    if (!psychConversations.has(userId)) return;

    // 获取用户的档案数据
    const userData = psychUserData.get(userId);
    if (!userData) return;

    await message.channel.sendTyping();

    try {
        // 检测危机
        if (detectCrisis(message.content)) {
            const crisisEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🚨 我非常担心你')
                .setDescription('你现在的安全对我来说很重要。\n\n请立即寻求帮助：\n\n📞 心理援助热线：400-161-9995（24小时）\n🏥 前往最近医院急诊科\n👥 联系你信任的人\n\n我会一直在这里陪着你，请现在就联系他们好吗？')
                .setFooter({ text: '你很重要，你的生命很重要' })
                .setTimestamp();

            await message.reply({ embeds: [crisisEmbed] });
            return;
        }

        // 获取对话历史
        const history = psychConversations.get(userId);

        // 添加用户消息
        history.push({ role: 'user', content: message.content });

        // 添加用户档案信息到系统消息
        const moodInfo = userData.moodHistory.length > 0
            ? `\n用户情绪记录：${userData.moodHistory.length}次，平均${(userData.moodHistory.reduce((sum, m) => sum + m.score, 0) / userData.moodHistory.length).toFixed(1)}分`
            : '';

        // 更新系统消息（加入用户档案）
        history[0] = {
            role: 'system',
            content: PSYCH_SYSTEM_PROMPT + moodInfo
        };

        // 限制历史长度
        if (history.length > 20) {
            history.splice(0, history.length - 20);
        }

        // 调用API
        const completion = await openai.chat.completions.create({
            model: CONFIG.model,
            messages: history,
            max_tokens: CONFIG.maxTokens,
            temperature: CONFIG.temperature
        });

        const response = completion.choices[0].message.content;
        history.push({ role: 'assistant', content: response });

        // 创建回复
        const psychEmbed = new EmbedBuilder()
            .setColor(0x9B59B6)
            .setDescription(response)
            .setFooter({ text: '🧠 心理助手 | 不能替代专业咨询' })
            .setTimestamp();

        await message.reply({ embeds: [psychEmbed] });

    } catch (error) {
        console.error('Psych API Error:', error.message);
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('❌ 出错了')
            .setDescription('抱歉，我遇到了一些问题。请稍后再试，或者联系你的咨询师。')
            .setTimestamp();
        await message.reply({ embeds: [errorEmbed] });
    }
});

// ==================== 注册斜杠命令 ====================

client.once('ready', async () => {
    const commands = [
        {
            name: 'chat',
            description: 'Chat with Gemini 3 Flash',
            options: [
                {
                    name: 'message',
                    type: 3, // STRING
                    description: 'Your message to Gemini',
                    required: true
                }
            ]
        },
        {
            name: 'psych',
            description: '心理助手模式',
            options: [
                {
                    name: 'action',
                    type: 3, // STRING
                    description: '开启或关闭心理助手',
                    required: true,
                    choices: [
                        { name: '开启', value: 'start' },
                        { name: '关闭', value: 'stop' }
                    ]
                }
            ]
        },
        {
            name: 'mood',
            description: '记录今日心情',
            options: [
                {
                    name: 'score',
                    type: 4, // INTEGER
                    description: '心情分数 (1-10)',
                    required: true,
                    min_value: 1,
                    max_value: 10
                },
                {
                    name: 'note',
                    type: 3, // STRING
                    description: '备注（可选）',
                    required: false
                }
            ]
        },
        {
            name: 'progress',
            description: '查看情绪进度'
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
        console.log('✅ Slash commands registered');
    } catch (error) {
        console.error('Failed to register commands:', error.message);
    }
});

// ==================== 登录 ====================

client.login(process.env.DISCORD_TOKEN);
