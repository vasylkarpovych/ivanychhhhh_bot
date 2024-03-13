require("dotenv").config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");

const bot = new Bot(process.env.BOT_API_KEY);

// ==== меню, внизу, удобно пользоваться, команды ниже
bot.api.setMyCommands([
  {
    command: "start",
    description: "Запускаємо бота",
  },
  {
    command: "hello",
    description: "Отримати привітання",
  },
  {
    command: "hello_ksu",
    description: "Для Ксюші",
  },
  {
    command: "mood",
    description: "Як настрій?",
  },
  {
    command: "share",
    description: "Контакти або опросник?",
  },
  {
    command: "inline_keyboard",
    description: "Інлайн клавіатура",
  },
]);

// узнать информацию о себе ctx.msg или же об отправитиеле ctx.from или же об боте ctx.me
// bot.on("msg", async (ctx) => {
//   console.log(ctx.from);
// });

// ======= бот отвечает на команди, что мы задали
bot.command("start", async (ctx) => {
  await ctx.react("👍");
  await ctx.reply(
    "Та я не ігнорю тебе, просто *ще не дуже багато* тут навчився робити\\. _Я ще молодий Bot_ [ось краще тримай посилання на свою сторінку](https://t.me/xxenia22)",
    { parse_mode: "MarkdownV2" }
  );
});

// //======клавіатура 1 спосіб
// bot.command("mood", async (ctx) => {
//   const moodKeyboard = new Keyboard()
//     .text("Взагалі супер")
//     .row()
//     .text("Все добре")
//     .text("Та норм, нічого")
//     .resized()
//     .oneTime()
//     .row()
//     .text("Погано");
//   await ctx.reply("Як настрій?", {
//     reply_markup: moodKeyboard,
//   });
// });

//======клавіатура 2 спосіб
bot.command("mood", async (ctx) => {
  const moodLabels = [
    "Взагалі супер",
    "Все добре",
    "Та норм, нічого",
    "Погано",
  ];
  const rows = moodLabels.map((label) => {
    return [Keyboard.text(label)];
  });
  const moodKeyboard2 = Keyboard.from(rows)
    .resized()
    .oneTime()
    .placeholder("Ю тач мі талалай");

  await ctx.reply("Як настрій?", {
    reply_markup: moodKeyboard2,
  });
});

bot.command("share", async (ctx) => {
  const shareKeyboard = new Keyboard()
    .requestLocation("Геолокація")
    .requestContact("Контакт")
    .requestPoll("Опросник")
    .resized();

  await ctx.reply("Ну давай, почнемо", {
    reply_markup: shareKeyboard,
  });
});

bot.command("inline_keyboard", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("1", "button-1")
    .text("2", "button-2")
    .text("3", "button-3");

  await ctx.reply("Оберіть цифру", {
    reply_markup: inlineKeyboard,
  });
});

bot.callbackQuery(/button-[1-3]/, async (ctx) => {
  // ctx.answerCallbackQuery("Ви обрали цифру!!!");
  // await ctx.reply(`Ви обрали цифру ${ctx.callbackQuery}`);
  await ctx.answerCallbackQuery();
  await ctx.reply(`Ви обрали цифру: ${ctx.callbackQuery.data}`);
});

// bot.on("callback_query:data", async (ctx) => {
//   await ctx.answerCallbackQuery();
//   await ctx.reply(`Ви обрали цифру: ${ctx.callbackQuery.data}`);
// });

//================
bot.hears("Взагалі супер", async (ctx) => {
  await ctx.reply("Обожнюю, що в тебе завжди гарний настрій!");
});

bot.command(["say_hello", "hello", "hi", "say_hi"], async (ctx) => {
  await ctx.reply("Привіт мала, як справи? Лежиш? Серіал дивишся?");
});

bot.command(["hello_ksu"], async (ctx) => {
  await ctx.react("🔥");
  await ctx.reply("Ого яка ти сьогодні вродлива <3", {
    reply_parameters: { message_id: ctx.msg.message_id },
  });
});

// =============== если етсь ругательство бля, то бот отвечает что не нужно ругаться
bot.hears(/бля/, async (ctx) => {
  await ctx.reply("Сваримось? Не треба.");
});

bot.hears(["id", "ID", "Id"], async (ctx) => {
  await ctx.reply(`Ваш ID:${ctx.from.id}`);
});

//======================= ответы на текст, фото и голос
bot.on(":text", async (ctx) => {
  await ctx.reply("Цікаво написала, але реба трохи подумати...");
});
bot.on(":photo", async (ctx) => {
  await ctx.reply("Оце я розумію малюнок, оце фотокарточка)))");
});
bot.on(":voice", async (ctx) => {
  await ctx.reply(
    "Слухай, зараз не дуже зручно ото слухати це все, давай трохи пізніше, ок?"
  );
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = e.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
