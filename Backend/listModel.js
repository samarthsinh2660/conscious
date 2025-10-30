import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Use GEMINI_API_KEY to match your .env file
const apiKey = process.env.GEMINI_API_KEY;

console.log("🔑 API Key loaded:", apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
console.log("");

const genAI = new GoogleGenerativeAI(apiKey);

// Test different model names with different API versions
const modelsToTry = [
  'gemini-pro',
  'gemini-1.0-pro',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-001',
  'gemini-1.5-pro-001',
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite'
];

async function testModels() {
  for (const modelName of modelsToTry) {
    try {
      console.log(`📌 Testing: ${modelName}...`);
      
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'Hello!'");
      const response = result.response.text();
      
      console.log(`✅ SUCCESS! Model "${modelName}" works!`);
      console.log(`📝 Response: ${response}`);
      console.log("");
      break; // Stop after first successful model
      
    } catch (err) {
      console.log(`❌ Failed: ${err.message.split('\n')[0]}`);
      console.log("");
    }
  }
}

testModels();
