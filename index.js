require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.use(cors());
app.use(express.json()); // Парсим JSON

app.post("/send", async (req, res) => {
  try {
    const { name, contact, message, budget } = req.body;

    if (!name || !contact) {
      return res.status(400).json({ error: "Имя и способ связи обязательны" });
    }

    const text = `
📩 **Новая заявка**
👤 Имя: ${name}
📞 Связь: ${contact}
💰 Бюджет: ${budget || "Не указан"}
📝 Сообщение: ${message || "Нет сообщения"}
`;

    await axios.post(TELEGRAM_API, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: "Markdown",
    });

    res.status(200).json({ success: true, message: "Отправлено в Telegram!" });
  } catch (error) {
    console.error("Ошибка при отправке:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.post("/visit", async (req, res) => {
  try {
    const text = `👀 Новый визит на сайт! Кто-то только что открыл страницу.`;

    await axios.post(TELEGRAM_API, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: "Markdown",
    });

    res.status(200).json({ success: true, message: "Уведомление отправлено!" });
  } catch (error) {
    console.error("Ошибка при отправке уведомления:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
