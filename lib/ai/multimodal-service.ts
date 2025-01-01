import { GoogleGenerativeAI } from "@google/generative-ai";
import imageCompression from 'browser-image-compression';

export class MultimodalService {
  private model: any; // Gemini Pro Vision model

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
    this.model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  }

  private async compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
    };
    return imageCompression(file, options);
  }

  private async fileToGenerativePart(file: File) {
    const compressed = await this.compressImage(file);
    const data = await compressed.arrayBuffer();
    return {
      inlineData: {
        data: Buffer.from(data).toString('base64'),
        mimeType: file.type
      }
    };
  }

  async analyzeImage(image: File, prompt: string) {
    try {
      const imagePart = await this.fileToGenerativePart(image);
      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw new Error('Failed to analyze image');
    }
  }
}