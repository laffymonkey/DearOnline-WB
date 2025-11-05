
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const luckyNumberSchema = {
    type: Type.OBJECT,
    properties: {
        numbers: {
            type: Type.ARRAY,
            description: "An array of 6 unique lucky lottery numbers. Each number should be a 5-digit string.",
            items: {
                type: Type.STRING,
                description: "A 5-digit lucky number as a string, e.g., '12345'."
            }
        },
        reasoning: {
            type: Type.STRING,
            description: "A short, creative, and positive explanation for why these numbers were chosen based on the user's prompt."
        }
    },
    required: ["numbers", "reasoning"]
};


export const generateLuckyNumbers = async (prompt: string): Promise<{ numbers: string[], reasoning: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following user prompt, generate a set of 6 unique 5-digit lucky lottery numbers. Provide a creative and positive reasoning for your choices. User prompt: "${prompt}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: luckyNumberSchema,
            },
        });

        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText);

        if (Array.isArray(data.numbers) && data.numbers.length > 0 && typeof data.reasoning === 'string') {
            return data;
        } else {
            throw new Error("Invalid format received from AI.");
        }
    } catch (error) {
        console.error("Error generating lucky numbers:", error);
        throw new Error("Failed to generate lucky numbers. Please try again.");
    }
};
