import dotenv from "dotenv"
dotenv.config();
import {GoogleGenAI} from "@google/genai";

if (!process.env.GEMINI_API_KEY){ throw new Error("Gemini API key is not set in environment variable file."); }

const geminiBot = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

export default geminiBot;