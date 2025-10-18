

import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Defensive check to prevent crash if response is empty or blocked
    if (response?.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
    }
    
    // If we reach here, no image was found. Check for block reason.
    const blockReason = response?.promptFeedback?.blockReason;
    if (blockReason) {
      throw new Error(`Image generation failed due to safety settings: ${blockReason}. Please adjust your prompt or image.`);
    }

    throw new Error("No image data found in the API response. The request may have been blocked or resulted in an empty response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Re-throw the error to be handled by the caller, preserving specific messages.
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("An unknown error occurred while processing the image with the Gemini API.");
  }
};


export const generateVideoFromImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        // Fix: Create a new instance for Veo models to ensure the latest API key is used.
        const videoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
        let operation = await videoAi.models.generateVideos({
            // Fix: Use the recommended model for general video generation.
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: {
                imageBytes: base64ImageData,
                mimeType: mimeType,
            },
            config: {
                numberOfVideos: 1,
                // Fix: Add required config parameters for video generation from an image.
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            // Fix: Use the new instance to poll the operation.
            operation = await videoAi.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("Video generation succeeded but no download link was found.");
        }
        
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        return URL.createObjectURL(videoBlob);

    } catch (error) {
        console.error("Error calling Veo API:", error);
        // Fix: Rethrow the original error to allow for specific error handling in the UI.
        throw error;
    }
};