
import { RoadAnalysis } from "../types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export class RoadAnalysisService {
  private backendUrl: string;

  constructor(backendUrl: string = BACKEND_URL) {
    this.backendUrl = backendUrl;
  }

  async analyzeRoadCondition(base64Data: string, mimeType: string): Promise<RoadAnalysis> {
    const isVideo = mimeType.startsWith('video/');

    // Resize image if it's not a video to save backend memory
    let dataToSend = base64Data;
    if (!isVideo) {
      try {
        dataToSend = await this.resizeImage(base64Data, 1024); // Max 1024px width/height
        console.log("Image resized for optimization");
      } catch (e) {
        console.warn("Image resize failed, sending original", e);
      }
    }

    try {
      // Check backend health first
      const healthResponse = await fetch(`${this.backendUrl}/health`);
      if (!healthResponse.ok) {
        throw new Error("Analysis backend is unavailable. Please ensure the backend server is running on port 5000.");
      }

      const endpoint = isVideo ? `${this.backendUrl}/analyze/video` : `${this.backendUrl}/analyze`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 min timeout for large videos 

      let response;
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: isVideo ? undefined : dataToSend,
            video: isVideo ? dataToSend : undefined,
            mimeType: mimeType
          }),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Analysis failed: ${response.status} ${response.statusText} - ${errorText}`);
      }


      const analysis = (await response.json()) as RoadAnalysis;
      return analysis;
    } catch (error: any) {
      console.error("Road Condition Analysis Error:", error);

      if (error.message?.includes('backend')) {
        throw new Error(error.message);
      }

      if (error.message?.includes('Network')) {
        throw new Error("Network Error: Cannot connect to analysis backend. Ensure it's running on port 5000.");
      }

      throw new Error(error.message || "Failed to analyze road condition. Check backend connection.");
    }
  }

  // Helper to resize images client-side
  private resizeImage(base64Str: string, maxWidth: number = 1024): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8)); // 80% quality JPEG
      };
      img.onerror = () => resolve(base64Str); // Fail safe
    });
  }
}

export const geminiService = new RoadAnalysisService();
