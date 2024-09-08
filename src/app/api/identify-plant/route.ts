import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const image = data.get('image') as File | null;

  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  try {
    // Convert the image to a base64 string
    const imageBuffer = await image.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    // Set up the model (using the Gemini 1.5 Flash model)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Updated prompt to request more information
    const prompt = `Identify this plant and provide the following information:
    1. Common name
    2. Scientific name
    3. Brief description
    4. Native region
    5. Growth habits
    6. Light requirements
    7. Watering needs
    8. Soil preferences
    9. Temperature range
    10. Common uses
    11. Any notable features or interesting facts`;

    // Generate content
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: image.type,
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    console.log('AI response:', text);

    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const plantData = {
      rawResponse: text, // Add this line to include the raw response
      commonName: extractInfo(lines, '1. Common name:'),
      scientificName: extractInfo(lines, '2. Scientific name:'),
      description: extractInfo(lines, '3. Brief description:'),
      nativeRegion: extractInfo(lines, '4. Native region:'),
      growthHabits: extractInfo(lines, '5. Growth habits:'),
      lightRequirements: extractInfo(lines, '6. Light requirements:'),
      wateringNeeds: extractInfo(lines, '7. Watering needs:'),
      soilPreferences: extractInfo(lines, '8. Soil preferences:'),
      temperatureRange: extractInfo(lines, '9. Temperature range:'),
      commonUses: extractInfo(lines, '10. Common uses:'),
      notableFeatures: extractInfo(lines, '11. Notable features or interesting facts:'),
    };

    console.log('Parsed plant data:', plantData);

    return NextResponse.json(plantData);
  } catch (error) {
    console.error('Error identifying plant:', error);
    return NextResponse.json({ error: 'Failed to identify plant' }, { status: 500 });
  }
}

function extractInfo(lines: string[], label: string): string {
  const index = lines.findIndex(line => line.startsWith(label));
  if (index === -1) return 'No information available';
  return lines[index].substring(label.length).trim();
}

declare global {
  interface Array<T> {
    takeWhile(predicate: (value: T) => boolean): T[];
  }
}

if (!Array.prototype.takeWhile) {
  Array.prototype.takeWhile = function<T>(this: T[], predicate: (value: T) => boolean): T[] {
    const result: T[] = [];
    for (const item of this) {
      if (predicate(item)) {
        result.push(item);
      } else {
        break;
      }
    }
    return result;
  };
}