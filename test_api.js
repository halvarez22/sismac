import Groq from 'groq-sdk';
import fs from 'fs';

let apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const match = envContent.match(/GROQ_API_KEY=(.+)/);
    if (match) {
      apiKey = match[1];
    }
  } catch (e) {
    console.log('Could not read .env.local');
  }
}

async function testAPI() {
  try {
    const groq = new Groq({ apiKey });
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "Hello, API is working!" in Spanish.' }],
      model: 'llama-3.1-8b-instant',
    });
    console.log('API Response:', chatCompletion.choices[0]?.message?.content);
    console.log('API key is valid!');
  } catch (error) {
    console.error('API Error:', error.message);
    console.log('API key is invalid or there is an issue.');
  }
}

testAPI();