import { GoogleGenAI } from "@google/genai";
import { EnvironmentPreset } from "../types";

// Helper to remove data:image/jpeg;base64, prefix if present
const cleanBase64 = (base64Data: string) => {
  return base64Data.split(',')[1] || base64Data;
};

// Helper to detect mime type from base64 string
const getMimeType = (base64Data: string) => {
  if (base64Data.startsWith('data:image/png')) return 'image/png';
  if (base64Data.startsWith('data:image/jpeg')) return 'image/jpeg';
  if (base64Data.startsWith('data:image/webp')) return 'image/webp';
  return 'image/jpeg'; // Default
};

export const generateRender = async (
  base64Image: string,
  environment: EnvironmentPreset
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing via process.env.API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const mimeType = getMimeType(base64Image);
  const cleanData = cleanBase64(base64Image);

  const prompt = `
    Act as a professional architectural visualization artist.
    Transform the attached architectural sketch/model (SketchUp style) into a High-Fidelity Photorealistic Render.
    
    Environment Requirements:
    ${environment.promptModifier}

    Technical Requirements:
    - 8k resolution details
    - Raytraced lighting and reflections
    - Realistic materials (glass, concrete, wood, metal)
    - Correct perspective and scale
    - Maintain the exact geometry of the original building but replace sketch textures with realistic ones.
    - Do not add text or watermarks.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using the standard image editing model
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanData,
            },
          },
        ],
      },
    });

    // Extract image from response
    // The response might contain text and image parts. We need to find the inlineData.
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated.");
    }

    let generatedImageBase64 = '';

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        break; 
      }
    }

    if (!generatedImageBase64) {
      // Sometimes models might refuse and return text explaining why
      const textPart = parts.find(p => p.text)?.text;
      if (textPart) {
        throw new Error(`Generation failed with message: ${textPart}`);
      }
      throw new Error("No image data found in response.");
    }

    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate render.");
  }
};