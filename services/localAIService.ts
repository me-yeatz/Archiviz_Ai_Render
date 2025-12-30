import { EnvironmentPreset, RenderSettings } from "../types";

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

// Configuration types
type AIProvider = 'ollama' | 'lmstudio' | 'huggingface' | 'gemini';

interface AIConfig {
  provider: AIProvider;
  baseUrl: string;
  model: string;
  apiKey?: string; // Only needed for Hugging Face or Gemini
}

/**
 * Get AI Configuration from localStorage or environment variables
 */
const getAIConfig = (): AIConfig => {
  // Try to load from localStorage first (browser settings)
  const savedSettings = localStorage.getItem('archiviz-ai-settings');
  if (savedSettings) {
    const parsed = JSON.parse(savedSettings);
    // Ensure provider is valid
    const provider = parsed.provider as AIProvider;
    return {
      provider: provider,
      baseUrl: parsed.baseUrl,
      model: parsed.model,
      apiKey: parsed.apiKey || undefined,
    };
  }

  // Fallback to environment variables
  const provider = (import.meta.env.VITE_AI_PROVIDER || 'huggingface').toLowerCase() as AIProvider;

  // Default configurations for each provider
  const defaults = {
    ollama: {
      baseUrl: import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434',
      model: import.meta.env.VITE_OLLAMA_MODEL || 'llava:7b',
    },
    lmstudio: {
      baseUrl: import.meta.env.VITE_LMSTUDIO_BASE_URL || 'http://localhost:1234',
      model: import.meta.env.VITE_LMSTUDIO_MODEL || 'llava-v1.6-34b',
    },
    huggingface: {
      baseUrl: import.meta.env.VITE_HF_BASE_URL || 'https://router.huggingface.co/hf-inference/models',
      model: import.meta.env.VITE_HF_MODEL || 'black-forest-labs/FLUX.1-schnell',
      apiKey: import.meta.env.VITE_HF_API_KEY,
    },
    gemini: {
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
      model: 'gemini-1.5-flash',
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    }
  };

  const config = defaults[provider] || defaults.gemini;

  if (!config) {
    throw new Error(`Unsupported AI provider: ${provider}. Use 'ollama', 'lmstudio', 'huggingface', or 'gemini'.`);
  }

  return {
    provider,
    ...config
  };
};

/**
 * Generate render using Ollama (Vision models like LLaVA)
 */
const generateWithOllama = async (
  base64Image: string,
  prompt: string,
  config: AIConfig,
  settings: RenderSettings
): Promise<string> => {
  const cleanData = cleanBase64(base64Image);

  const response = await fetch(`${config.baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      prompt: prompt,
      images: [cleanData],
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ollama API Error: ${error}`);
  }

  const data = await response.json();

  // Ollama vision models return text descriptions, not images
  throw new Error('Ollama currently supports vision analysis but not image generation. Please use LM Studio with image generation models or Hugging Face.');
};

/**
 * Generate render using LM Studio (OpenAI-compatible API)
 */
const generateWithLMStudio = async (
  base64Image: string,
  prompt: string,
  config: AIConfig,
  settings: RenderSettings
): Promise<string> => {
  const cleanData = cleanBase64(base64Image);
  const mimeType = getMimeType(base64Image);

  // LM Studio uses OpenAI-compatible API format
  const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${cleanData}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LM Studio API Error: ${error}`);
  }

  const data = await response.json();
  const description = data.choices?.[0]?.message?.content;

  if (!description) {
    throw new Error('No response from LM Studio');
  }

  throw new Error('LM Studio vision models can analyze images but not generate new renders. Consider using Hugging Face with Stable Diffusion models.');
};

/**
 * Generate render using Gemini API
 */
const generateWithGemini = async (
  base64Image: string,
  prompt: string,
  config: AIConfig,
  settings: RenderSettings
): Promise<string> => {
  if (!config.apiKey) {
    throw new Error('Gemini API key is required. Go to Settings and add your Google API key.');
  }

  const cleanData = cleanBase64(base64Image);
  const mimeType = getMimeType(base64Image);

  // 1. The "Architectural Core" System Prompt
  const systemInstruction = `
System Role: You are a Professional Architectural Visualizer and Building Consultant.

Objective: Your task is to perform "Image-to-Image" rendering. You must take the user's uploaded 3D wireframe or basic massing model and transform it into a photorealistic architectural render.

Constraints:

Geometry Lock: Do not move columns, walls, or rooflines. Maintain the exact perspective of the input image.

Material Accuracy: Apply high-quality textures (e.g., Fair-faced concrete, Low-E glass, Timber cladding) based on the Malaysian tropical climate.

Lighting: Use Global Illumination. Default to "Golden Hour" lighting unless specified otherwise.

Safety: If the user's design shows structural instability (like the tilted column from my past experience), subtly highlight it or ensure the render shows the corrected, safe version.
    `.trim();

  // Clean URL
  const baseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;
  const url = `${baseUrl}/${config.model}:generateContent?key=${config.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [{
        role: "user",
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: mimeType,
              data: cleanData
            }
          }
        ]
      }],
      // 2. The API Configuration
      generationConfig: {
        temperature: 1.0,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseModalities: ["IMAGE"],
      },
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = errorText;
    try {
      const errorJson = JSON.parse(errorText);
      errorMsg = errorJson.error?.message || errorText;
    } catch { }
    throw new Error(`Gemini API Error: ${errorMsg}`);
  }

  const data = await response.json();

  // Check for candidates
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("Gemini returned no candidates.");
  }

  // Logic to extract image from response
  const parts = data.candidates[0].content?.parts;
  if (!parts) {
    throw new Error("Gemini returned no content parts.");
  }

  const imagePart = parts.find((p: any) => p.inline_data || p.inlineData);

  if (imagePart) {
    const imgData = imagePart.inline_data || imagePart.inlineData;
    return `data:${imgData.mime_type};base64,${imgData.data}`;
  }

  const textPart = parts.find((p: any) => p.text);
  if (textPart) {
    throw new Error(`Gemini generated text instead of an image. Ensure you are using a model that supports image generation (like Imagen 3 on Gemini). Response: ${textPart.text.substring(0, 100)}...`);
  }

  throw new Error("Gemini response did not contain an image.");
};

/**
 * Generate render using Hugging Face Inference API
 */
const generateWithHuggingFace = async (
  base64Image: string,
  prompt: string,
  config: AIConfig,
  settings: RenderSettings
): Promise<string> => {
  if (!config.apiKey) {
    throw new Error('Hugging Face API key is required. Go to Settings and add your API key.');
  }

  const cleanData = cleanBase64(base64Image);
  const isImg2Img = config.model.includes('img2img') || config.model.includes('instruct-pix2pix');

  try {
    let response: Response;

    if (isImg2Img) {
      // Image-to-image model
      const binaryString = atob(cleanData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const imageBlob = new Blob([bytes], { type: getMimeType(base64Image) });

      response = await fetch(`${config.baseUrl}/${config.model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            image: cleanData,
            prompt: prompt,
          },
          parameters: {
            negative_prompt: settings.negativePrompt || 'low quality, blurry, distorted, text, watermark, sketch lines',
            num_inference_steps: 30,
            guidance_scale: 7.5,
            strength: settings.creativityStrength,
          }
        })
      });
    } else {
      // Text-to-image model
      response = await fetch(`${config.baseUrl}/${config.model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: settings.negativePrompt || 'low quality, blurry, distorted, text, watermark, sketch lines, line drawing',
            num_inference_steps: 30,
            guidance_scale: 7.5,
            seed: settings.seed !== -1 ? settings.seed : undefined,
          }
        })
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.error || errorJson.message || errorText;
      } catch { }

      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Hugging Face API key in Settings.');
      } else if (response.status === 503) {
        throw new Error('Model is loading. Please wait a moment and try again.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      throw new Error(`Hugging Face Error: ${errorMsg}`);
    }

    const imageBlob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });
  } catch (error: any) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Network error. Check your internet connection or try a different model.');
    }
    throw error;
  }
};

/**
 * Main function to generate architectural render using local AI
 */
export const generateRender = async (
  base64Image: string,
  environment: EnvironmentPreset,
  settings: RenderSettings
): Promise<string> => {
  const config = getAIConfig();

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
- Professional architectural photography style
- Do not add text or watermarks.
  `.trim();

  try {
    console.log(`🤖 Using ${config.provider.toUpperCase()} for AI rendering...`);
    console.log(`📍 API Endpoint: ${config.baseUrl}`);
    console.log(`🎨 Model: ${config.model}`);

    switch (config.provider) {
      case 'ollama':
        return await generateWithOllama(base64Image, prompt, config, settings);

      case 'lmstudio':
        return await generateWithLMStudio(base64Image, prompt, config, settings);

      case 'huggingface':
        return await generateWithHuggingFace(base64Image, prompt, config, settings);

      case 'gemini':
        return await generateWithGemini(base64Image, prompt, config, settings);

      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  } catch (error: any) {
    console.error(`❌ ${config.provider.toUpperCase()} API Error:`, error);
    throw new Error(error.message || `Failed to generate render with ${config.provider}`);
  }
};

/**
 * Check if AI service is available
 */
export const checkAIHealth = async (): Promise<{ available: boolean; provider: string; message: string }> => {
  try {
    const config = getAIConfig();

    if (config.provider === 'ollama') {
      const response = await fetch(`${config.baseUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        const hasVisionModel = data.models?.some((m: any) =>
          m.name.includes('llava') || m.name.includes('vision')
        );
        return {
          available: true,
          provider: 'Ollama',
          message: hasVisionModel
            ? `Connected to Ollama (${data.models?.length || 0} models available)`
            : 'Ollama running but no vision models found. Install llava:7b or similar.'
        };
      }
    } else if (config.provider === 'lmstudio') {
      const response = await fetch(`${config.baseUrl}/v1/models`);
      if (response.ok) {
        return {
          available: true,
          provider: 'LM Studio',
          message: 'Connected to LM Studio'
        };
      }
    } else if (config.provider === 'huggingface') {
      if (config.apiKey && config.apiKey !== 'your_huggingface_token_here') {
        return {
          available: true,
          provider: 'Hugging Face',
          message: 'Hugging Face API configured'
        };
      } else {
        return {
          available: false,
          provider: 'Hugging Face',
          message: 'Hugging Face API key not configured'
        };
      }
    } else if (config.provider === 'gemini') {
      if (config.apiKey) {
        return {
          available: true,
          provider: 'Gemini',
          message: 'Gemini API configured'
        };
      } else {
        return {
          available: false,
          provider: 'Gemini',
          message: 'Gemini API key not configured'
        };
      }
    }

    return {
      available: false,
      provider: config.provider,
      message: `Cannot connect to ${config.provider}`
    };
  } catch (error: any) {
    return {
      available: false,
      provider: 'Unknown',
      message: error.message
    };
  }
};
