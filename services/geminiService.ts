
import { GoogleGenAI } from "@google/genai";
import { PhotoAsset } from "../types";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a photo based on multiple assets and a constructed prompt.
 * 
 * @param assets List of photo assets (Subject, Garments, etc.)
 * @param prompt The main instructional prompt.
 * @returns A promise that resolves to the generated image URL (data URI).
 */
export const generateHeadshot = async (
  assets: PhotoAsset[],
  prompt: string
): Promise<string> => {
  try {
    const ai = getGeminiClient();

    const parts: any[] = [];

    // Add prompt instructions first
    parts.push({ text: prompt });
    parts.push({ text: "REFERENCED ASSETS:" });

    // Iterate through assets and add them to the request
    assets.forEach((asset, index) => {
      // Always include the text description to orient the model
      parts.push({
        text: `[Asset ${index + 1}: ${asset.type.toUpperCase()}] ${asset.description || 'No description provided'}`
      });
      
      // Only attach image data if it exists
      if (asset.image) {
        const cleanBase64 = asset.image.base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: asset.image.mimeType,
          },
        });
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
    });

    // Validate response structure
    const candidate = response.candidates?.[0];

    if (!candidate) {
      throw new Error("No candidates returned from the model.");
    }

    // Check if the model stopped for safety or other reasons
    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
       throw new Error(`Image generation failed. Finish reason: ${candidate.finishReason}. The image might have violated safety policies.`);
    }

    // Check for content parts
    if (!candidate.content?.parts) {
      throw new Error("The model returned no content. Please try again with a different photo.");
    }

    // Extract the image from the response
    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.data) {
        const generatedBase64 = part.inlineData.data;
        const generatedMimeType = part.inlineData.mimeType || 'image/png';
        return `data:${generatedMimeType};base64,${generatedBase64}`;
      }
    }

    throw new Error("No image data found in the response parts.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
