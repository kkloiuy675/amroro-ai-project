require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios"); // تم إضافة مكتبة axios لجلب البيانات من الـ APIs

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

// 1. أمر فحص سرعة الاستجابة (Ping)
app.command("/amroro-ai-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

// 2. أمر المساعدة (Help Command)
app.command("/amroro-ai-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text: "Available Commands:\n/amroro-ai-ping - Check bot latency\n/amroro-ai-catfact - Get a cat fact\n/amroro-ai-joke - Get a joke"
  });
});

// 3. أمر حقيقة عن القطط (Cat Fact Command)
app.command("/amroro-ai-catfact", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

// 4. أمر نكتة (Joke Command)
app.command("/amroro-ai-joke", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text: `${response.data.setup}\n\n${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

// تشغيل البوت
(async () => {
  await app.start();
  console.log("Bot is running!");
})();