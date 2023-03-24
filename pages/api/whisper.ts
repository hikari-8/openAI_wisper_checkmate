const FormData = require('form-data');
import { withFileUpload } from 'next-multiparty';
import { createReadStream } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default withFileUpload(async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).send('No file uploaded');
    return;
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', createReadStream(file.filepath), 'audio.wav');
  formData.append('model', 'whisper-1');
  const response = await fetch(
    'https://api.openai.com/v1/audio/transcriptions',
    {
      method: 'POST',
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    }
  );

  const { text, error } = await response.json();
  if (response.ok) {
    //テキストから宿泊番号を抽出する
    const reservationNumber = extractReservationNumber(text);
    // 宿泊番号があれば、次のフェーズへ
    if (reservationNumber) {
      console.log('reservationNumber', reservationNumber);
    }
    res.status(200).json({ text: text });
  } else {
    console.log('OPEN AI ERROR:');
    console.log(error.message);
    res.status(400).send(new Error());
  }
});

// reservation numberの正規表現パターンを定義する
const RESERVATION_NUMBER_PATTERN = /[0-9a-zA-Z]{4}/;
function extractReservationNumber(text: string) {
  const match = text.match(RESERVATION_NUMBER_PATTERN);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}
