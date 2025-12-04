require('dotenv').config();
const { Telegraf } = require('telegraf');
const { getAvailableGifts } = require('./getAvailableGifts');

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('gifts', async (ctx) => {
  try {
    const gifts = await getAvailableGifts();


    if (!gifts?.length) {
      return ctx.reply('目前没有可用的礼物。');
    }

    const messageLines = gifts.map(g => {
      const emoji = g.sticker?.emoji || '🎁';
      const price = `${g.star_count}⭐`;
      
      const isUpgradable = (g.remaining_count != null && g.total_count != null);
      const suffix = isUpgradable ? ' 可升级' : '';

      return `${emoji} ${price} ${suffix}`;
    });

    // 发送消息
    await ctx.reply(messageLines.join('\n'));

  } catch (error) {
    console.error('Error in /gifts command:', error);
    await ctx.reply('获取礼物列表失败，请稍后再试。');
  }
});

bot.launch().then(() => {
  console.log('Bot is running...');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
