const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Replace these with your actual keys from Alibaba Cloud
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const ACCESS_KEY_SECRET = process.env.ACCESS_KEY_SECRET;

app.post("/tts", async (req, res) => {
  const { text, voice = "xiaoyan", format = "mp3" } = req.body;

  const url = "https://nls-gateway-cn-shanghai.aliyuncs.com/stream/v1/services/aegis-voice/audio:synthesizeVoice";

  try {
    const ttsResponse = await axios.post(url, {
      text,
      voice,
      format
    }, {
      auth: {
        username: ACCESS_KEY_ID,
        password: ACCESS_KEY_SECRET
      },
      responseType: "arraybuffer"
    });

    const base64Audio = Buffer.from(ttsResponse.data, 'binary').toString('base64');
    res.json({
      audioUrl: `data:audio/${format};base64,${base64Audio}`
    });
  } catch (error) {
    console.error("TTS Error:", error.message);
    res.status(500).json({ error: "Failed to generate voice." });
  }
});

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
