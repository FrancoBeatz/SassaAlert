import { GoogleGenAI } from "@google/genai";
import { GrantType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

export const generatePersonalizedSms = async (name: string, grantType: GrantType): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Write a short, friendly SMS notification (max 160 chars) for a SASSA beneficiary named ${name} who receives the ${grantType}. 
      The SMS should confirm they have subscribed to payday alerts. 
      Use South African English slang or tone slightly if appropriate but keep it professional. 
      Do not include quotes in the output.`,
    });
    return response.text || "You are now subscribed to SASSA Alerts.";
  } catch (error) {
    console.error("Gemini SMS generation failed:", error);
    return `Hello ${name}, you are confirmed for ${grantType} alerts.`;
  }
};

export const getFinancialTip = async (grantType: GrantType): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Provide a single, short, practical, and empathetic financial tip (max 2 sentences) specifically for someone in South Africa receiving the ${grantType}. 
      Focus on stretching the rand, safety at ATMs, or grocery saving.`,
    });
    return response.text || "Keep your SASSA card safe and never share your PIN.";
  } catch (error) {
    console.error("Gemini Tip generation failed:", error);
    return "Remember to keep your card safe and check balance via USSD.";
  }
};