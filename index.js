const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return;

  const userMsg = message.content.replace(/<@!?\d+>/, "").trim();

  try {
    await message.channel.sendTyping();

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "stepfun/step-3.5-flash:free",
        messages: [{ role: "user", content: userMsg }]
      })
    });

    const data = await res.json();
    const reply = data.choices[0].message.content;
    await message.reply(reply);

  } catch (err) {
    await message.reply("something went wrong lol");
    console.error(err);
  }
});

client.login(process.env.DISCORD_TOKEN);
