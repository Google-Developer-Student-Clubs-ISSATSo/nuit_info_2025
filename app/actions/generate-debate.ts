"use server";

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

export async function generateDebate() {
  try {
    const topics = [
      "Cost savings and licensing fees",
      "Data privacy and GDPR compliance",
      "Security vulnerabilities and patching",
      "Vendor lock-in and long-term sustainability",
      "Customization and flexibility of software",
      "Community support vs paid support",
      "Interoperability and open standards",
      "Planned obsolescence of hardware",
      "Transparency and auditability of code",
      "Digital sovereignty for the organization"
    ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];

    const prompt = `
    Generate a short debate (about 6-8 lines) between two characters:
    1. Alex (speaker: "traditional", emoji: "👨‍💼"): A skeptical IT manager who prefers proprietary software (Windows, Office, etc.) and is worried about change, compatibility, and support.
    2. Sophie (speaker: "freedom", emoji: "👩‍🏫"): An open-source advocate who promotes Linux, LibreOffice, Nextcloud, etc., highlighting cost savings, security, and freedom.

    The debate should be about switching from proprietary software to open source in a company or school.
    
    IMPORTANT: Focus the debate specifically on this topic: "${randomTopic}".
    
    Alex raises concerns related to this topic, and Sophie answers them with benefits of open source regarding this topic.
    
    Return ONLY valid JSON in the following format:
    {
      "debate": [
        {
          "speaker": "traditional",
          "name": "Alex",
          "emoji": "👨‍💼",
          "text": "..."
        },
        {
          "speaker": "freedom",
          "name": "Sophie",
          "emoji": "👩‍🏫",
          "text": "..."
        }
      ]
    }
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    let jsonString = "";
    if (result && typeof result.text === 'function') {
        jsonString = result.text;
    } else if (result && result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        if (typeof text === 'string') {
            jsonString = text;
        } else {
            console.error("Unexpected response format:", JSON.stringify(result, null, 2));
            return null;
        }
    } else {
        console.error("Unexpected response format:", JSON.stringify(result, null, 2));
        return null;
    }

    jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating debate:", error);
    return null;
  }
}
