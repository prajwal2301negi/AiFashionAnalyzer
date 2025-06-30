import { GoogleGenerativeAI } from '@google/generative-ai';
import { StyleAnalysis, BodyMeasurements, BodyShape, SkinTone} from '../types/fashion';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  initialize(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async analyzeBodyImage(imageFile: File): Promise<StyleAnalysis> {
    if (!this.model) {
      throw new Error('Gemini AI not initialized. Please provide API key.');
    }

    try {
      // Convert image to base64
      const imageBase64 = await this.fileToBase64(imageFile);
      
      const prompt = `
        Analyze this person's full image and provide comprehensive fashion analysis. Please analyze:

        1. PERSONAL ANALYSIS - Demographics:
           - Gender (male/female/non-binary)
           - Age range (e.g., "25-30", "30-35")
           - Confidence score (0-1)
           - Current style category (casual, formal, trendy, classic, bohemian, etc.)
           - Style description explaining their current aesthetic

        2. CURRENT OUTFIT ANALYSIS:
           - Top wear: type, color, fit (loose/fitted/oversized/tight), material if visible
           - Bottom wear: type, color, fit, material if visible
           - Footwear: type and style
           - Accessories: list all visible accessories
           - Overall fit assessment and style notes
           - How well the current outfit works together

        3. BODY MEASUREMENTS (estimate in cm):
           - Chest/Bust circumference
           - Waist circumference  
           - Hip circumference
           - Shoulder width
           - Approximate height
           - Arm length
           - Leg length
           - Neck size

        4. BODY SHAPE ANALYSIS:
           - Determine body shape type (rectangle, pear, apple, hourglass, inverted-triangle, oval)
           - Provide confidence score (0-1)
           - Explain the reasoning and characteristics
           - Give specific fashion recommendations for this body type

        5. SKIN TONE ANALYSIS:
           - Determine if warm, cool, or neutral undertones
           - Provide specific subcategory
           - Seasonal color palette (Spring, Summer, Autumn, Winter)
           - Recommend best colors
           - Colors to avoid

        6. OUTFIT IMPROVEMENT SUGGESTIONS:
           - Specific suggestions to enhance current look
           - Reasoning for each suggestion
           - Alternative items that would work better
           - Color recommendations for current outfit
           - Accessory tips to elevate the look
           - General styling tips

        7. SIZE RECOMMENDATIONS:
           - Shirt/Top size (XS, S, M, L, XL, XXL)
           - Pants/Bottom size (include US and EU sizes)
           - Dress size
           - Jacket/Blazer size

        Please respond in valid JSON format with this structure:
        {
          "demographics": {
            "gender": "string",
            "ageRange": "string",
            "confidence": number,
            "currentStyle": "string",
            "styleDescription": "string"
          },
          "currentOutfit": {
            "topWear": {
              "type": "string",
              "color": "string",
              "fit": "string",
              "material": "string"
            },
            "bottomWear": {
              "type": "string",
              "color": "string",
              "fit": "string",
              "material": "string"
            },
            "footwear": "string",
            "accessories": ["string"],
            "overallFit": "string",
            "styleNotes": "string"
          },
          "outfitImprovement": {
            "suggestions": ["string"],
            "reasoning": ["string"],
            "alternativeItems": ["string"],
            "colorRecommendations": ["string"],
            "accessoryTips": ["string"],
            "stylingTips": ["string"]
          },
          "measurements": {
            "chest": number,
            "waist": number,
            "hips": number,
            "shoulders": number,
            "armLength": number,
            "legLength": number,
            "neckSize": number,
            "confidence": number,
            "unit": "cm"
          },
          "bodyShape": {
            "type": "string",
            "confidence": number,
            "description": "string",
            "recommendations": ["string"],
            "characteristics": ["string"]
          },
          "skinTone": {
            "category": "string",
            "subcategory": "string", 
            "confidence": number,
            "seasonalPalette": "string",
            "recommendedColors": ["string"],
            "avoidColors": ["string"]
          },
          "recommendations": {
            "sizes": {
              "shirt": "string",
              "pants": "string", 
              "dress": "string",
              "jacket": "string"
            },
            "styles": ["string"],
            "colors": ["string"]
          },
          "confidence": number
        }
      `;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageFile.type
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini AI');
      }

      const analysisData = JSON.parse(jsonMatch[0]);
      
      return {
        ...analysisData,
        analysisDate: new Date()
      };

    } catch (error) {
      console.error('Error analyzing image with Gemini:', error);
      throw new Error('Failed to analyze image. Please try again.');
    }
  }

  async generateOutfitRecommendations(
    bodyShape: BodyShape,
    skinTone: SkinTone,
    measurements: BodyMeasurements,
    occasion: string,
    budget: [number, number],
    preferences: string[]
  ) {
    if (!this.model) {
      throw new Error('Gemini AI not initialized');
    }

    const prompt = `
      Generate personalized outfit recommendations based on:
      
      Body Shape: ${bodyShape.type} (${bodyShape.description})
      Skin Tone: ${skinTone.category} - ${skinTone.subcategory}
      Seasonal Palette: ${skinTone.seasonalPalette}
      Measurements: Chest ${measurements.chest}cm, Waist ${measurements.waist}cm, Hips ${measurements.hips}cm
      Occasion: ${occasion}
      Budget: $${budget[0]} - $${budget[1]}
      Preferences: ${preferences.join(', ')}
      
      Recommended Colors: ${skinTone.recommendedColors.join(', ')}
      Colors to Avoid: ${skinTone.avoidColors.join(', ')}

      Please provide 8-10 specific clothing recommendations with:
      - Exact item names and descriptions
      - Recommended size based on measurements
      - Color that complements skin tone
      - Price estimate within budget
      - Why it works for this body type
      - Occasion suitability
      - Style category
      - Match score (0-1) based on how well it fits the person

      Respond in JSON format:
      {
        "recommendations": [
          {
            "name": "string",
            "category": "string",
            "size": "string", 
            "color": "string",
            "brand": "string",
            "price": number,
            "matchScore": number,
            "reasons": ["string"],
            "occasion": ["string"],
            "styleCategory": "string"
          }
        ]
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  async generateStyleTips(bodyShape: BodyShape, skinTone: SkinTone) {
    if (!this.model) {
      throw new Error('Gemini AI not initialized');
    }

    const prompt = `
      Provide comprehensive style tips for:
      Body Shape: ${bodyShape.type}
      Skin Tone: ${skinTone.category} - ${skinTone.subcategory}
      Seasonal Palette: ${skinTone.seasonalPalette}

      Include:
      1. Do's and Don'ts for this body type
      2. Best silhouettes and cuts
      3. Color coordination tips
      4. Accessory recommendations
      5. Seasonal styling advice
      6. Professional vs casual styling
      7. Shopping tips and what to look for

      Respond in JSON format with organized categories.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating style tips:', error);
      throw error;
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = error => reject(error);
    });
  }
}

export const geminiService = new GeminiService();