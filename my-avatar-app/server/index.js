import express from 'express';
import fetch from 'node-fetch';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

const ttsClient = new TextToSpeechClient();

app.use(express.json());

app.post('/api/anthropic', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.ANTHROPIC_API_KEY,
        'Anthropic-Beta': 'messages-2023-12-15',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/api/tts', async (req, res) => {
  console.log("Request body received at /api/tts:", req.body);
  try {
    const { text } = req.body;

    if (typeof text !== 'string' || !text) {
      console.error("Invalid or empty text input received at /api/tts");
      return res.status(400).json({ error: "Invalid or empty text input" });
    }

    const [response] = await ttsClient.synthesizeSpeech({
      input: { text: text },
      voice: { languageCode: 'en-NZ', name: 'en-GB-Standard-B' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    console.log("Response from Google Cloud TTS:", response); // Log the response

    res.json({ audioContent: response.audioContent.toString('base64') });
  } catch (error) {
    console.error("Error in /api/tts endpoint handler:", error); // More detailed error logging
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});