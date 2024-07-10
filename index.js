const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const CHATGPT_CHAT_COMPLETIONS_URL =
  "https://api.openai.com/v1/chat/completions";

const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;

let chatGptPromptHeader =
  "check if there are any grammar mistakes, including case sensitivity. as a response, just type the revised version, nothing else";

app.post("/api/v1/grammar-check", async function (req, res) {
  const input = req.body.input;

  if (!req.body || !req.body.input) {
    return res.status(500).json({
      message: "Please provide 'input' field in request body.",
    });
  }

  try {
    let inputText = chatGptPromptHeader + "\n\n" + input;

    const chatGptResponse = await axios({
      method: "POST",
      url: CHATGPT_CHAT_COMPLETIONS_URL,
      data: {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: inputText }],
        temperature: 0.7,
      },
      headers: {
        Authorization: `Bearer ${CHATGPT_API_KEY}`,
      },
    });

    return res.status(200).json(chatGptResponse.data);
  } catch (e) {
    return res.status(500).json({
      message: "Unexpected error.",
    });
  }
});

app.use(express.static("assets"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
