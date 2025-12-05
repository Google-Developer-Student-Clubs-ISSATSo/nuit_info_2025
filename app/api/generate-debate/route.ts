import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `Tu es un générateur de dialogue pour une application éducative sur les logiciels open source.
Génère un débat entre deux personnages:
- Alex (speaker: "traditional"): défend les logiciels propriétaires traditionnels (Google, Microsoft, Adobe, etc.)
- Sophie (speaker: "freedom"): défend les alternatives open source et la liberté numérique (Linux, LibreOffice, GIMP, etc.)

Le débat doit:
1. Être en français
2. Avoir exactement 8 répliques alternées (4 pour chaque personnage)
3. Être engageant et éducatif
4. Mentionner des exemples concrets de logiciels
5. Se terminer avec Sophie qui fait réfléchir sur la liberté de choix

Format de sortie JSON strict:
{
  "debate": [
    {"speaker": "traditional", "text": "...", "emoji": "🤔"},
    {"speaker": "freedom", "text": "...", "emoji": "✨"},
    ...
  ]
}

Emojis suggérés: 🤔💭🔒💡✨🚀🛡️💪🌟🎯`;

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = topic 
      ? `${SYSTEM_PROMPT}\n\nSujet spécifique du débat: ${topic}`
      : SYSTEM_PROMPT;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    const parsed = JSON.parse(text);
    
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Fallback to static content if API fails
    const fallbackDebate = {
      debate: [
        { speaker: "traditional", text: "Google Docs, c'est tellement pratique ! Tout est synchronisé automatiquement.", emoji: "🤔" },
        { speaker: "freedom", text: "Pratique, oui, mais tes documents sont sur leurs serveurs. Avec LibreOffice, tu gardes le contrôle total !", emoji: "✨" },
        { speaker: "traditional", text: "Mais tout le monde utilise Windows et Microsoft Office...", emoji: "💭" },
        { speaker: "freedom", text: "La popularité n'est pas synonyme de liberté. Linux te donne le pouvoir de personnaliser tout ton système !", emoji: "🚀" },
        { speaker: "traditional", text: "Photoshop reste quand même le standard pour les graphistes pro.", emoji: "🎨" },
        { speaker: "freedom", text: "GIMP et Krita sont incroyablement puissants et gratuits. Beaucoup de pros les utilisent !", emoji: "💪" },
        { speaker: "traditional", text: "Hmm, je n'avais jamais vraiment considéré ces alternatives...", emoji: "🤔" },
        { speaker: "freedom", text: "C'est ça la beauté de l'open source : tu as le choix ! Explore et trouve ce qui te convient.", emoji: "🌟" }
      ]
    };
    
    return NextResponse.json(fallbackDebate);
  }
}
