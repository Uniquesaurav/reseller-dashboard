import { GoogleGenAI, Type } from "@google/genai";
import { Account, ChatMessage } from '../types';

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const calculateExpiry = (date: Date, duration: string): Date => {
  const newDate = new Date(date);
  switch (duration) {
    case '1 Month': newDate.setMonth(newDate.getMonth() + 1); break;
    case '3 Months': newDate.setMonth(newDate.getMonth() + 3); break;
    case '6 Months': newDate.setMonth(newDate.getMonth() + 6); break;
    case '1 Year': newDate.setFullYear(newDate.getFullYear() + 1); break;
    default: newDate.setMonth(newDate.getMonth() + 1);
  }
  return newDate;
};

export const generateMockAccounts = async (
  quantity: number,
  region: string,
  plan: string,
  duration: string,
  service: string
): Promise<Account[]> => {
  const ai = getClient();
  
  // For large quantities, we simulate generation locally for performance after getting a template or just generate a few and replicate pattern
  // However, for the purpose of this mock, we will generate a batch.
  
  // Safety prompt to ensure we only generate fictional data for the demo
  const prompt = `Generate ${Math.min(quantity, 5)} fictional, realistic-looking user accounts for a mock dashboard demo. 
  Service: ${service}. Region: ${region}. Plan: ${plan}.
  Fields required: email (must end with @accountbot.shop), password (random alphanumeric string, 8-12 chars).
  DO NOT use real credentials. These are for a UI simulation only.`;

  try {
    let rawData = [];
    
    // Only call AI if quantity is small to save latency, otherwise use fallback pattern generator for speed on 10000 items
    if (quantity <= 5) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                email: { type: Type.STRING },
                password: { type: Type.STRING },
              },
              required: ["email", "password"],
            },
          },
        },
      });
      rawData = JSON.parse(response.text || "[]");
    }

    const now = new Date();
    const expiryDate = calculateExpiry(now, duration).toISOString();
    
    // If we need more than AI returned (or strictly using fallback for speed), fill the rest
    const results: Account[] = [];
    
    // Add AI generated ones
    rawData.forEach((item: any) => {
      results.push({
        id: crypto.randomUUID(),
        service,
        email: item.email.endsWith('@accountbot.shop') ? item.email : `${item.email.split('@')[0]}@accountbot.shop`,
        password: item.password,
        plan: plan as any,
        region: region,
        duration: duration as any,
        generatedAt: now.toISOString(),
        expiresAt: expiryDate,
        status: 'Active',
      });
    });

    // Fill the remainder
    const remaining = quantity - results.length;
    for (let i = 0; i < remaining; i++) {
      results.push({
        id: crypto.randomUUID(),
        service,
        email: `${service.toLowerCase().replace(/\s/g, '')}.${Math.floor(Math.random() * 1000000)}@accountbot.shop`,
        password: Math.random().toString(36).slice(-10),
        plan: plan as any,
        region: region,
        duration: duration as any,
        generatedAt: now.toISOString(),
        expiresAt: expiryDate,
        status: 'Active',
      });
    }

    return results;

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    const now = new Date();
    const expiryDate = calculateExpiry(now, duration).toISOString();
    // Fallback if API fails
    return Array.from({ length: quantity }).map(() => ({
      id: crypto.randomUUID(),
      service,
      email: `${service.toLowerCase().replace(/\s/g, '')}.${Math.floor(Math.random() * 1000000)}@accountbot.shop`,
      password: Math.random().toString(36).slice(-10),
      plan: plan as any,
      region: region,
      duration: duration as any,
      generatedAt: now.toISOString(),
      expiresAt: expiryDate,
      status: 'Active',
    }));
  }
};

export const sendSupportMessage = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  const ai = getClient();
  
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "You are AccountBot Support, a helpful assistant for a digital reseller dashboard. You help users with pricing strategies, how to use the dashboard, and general troubleshooting. Keep answers concise and professional. Do not encourage illegal acts, focus on the software functionality."
    },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  const result = await chat.sendMessage({ message: newMessage });
  return result.text || "I'm having trouble connecting to the server. Please try again.";
};