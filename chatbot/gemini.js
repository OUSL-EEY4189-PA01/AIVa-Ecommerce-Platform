import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
import { productInfoTool } from "./product_tool.js";
import { faqTool } from "./faq_tool.js";

export const tools = [productInfoTool, faqTool];

export const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0.2,
    maxRetries: 2,
    apiKey: process.env.GOOGLE_API_KEY,
});