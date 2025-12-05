import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `Tu es un générateur de quiz éducatif sur les logiciels open source.
Génère un quiz de 5 questions à choix multiples pour tester les connaissances sur un logiciel open source.

Chaque question doit:
1. Être en français
2. Avoir exactement 4 options de réponse
3. Avoir une seule bonne réponse
4. Être pertinente pour quelqu'un qui découvre le logiciel
5. Couvrir: installation, fonctionnalités clés, avantages par rapport aux alternatives propriétaires

Format de sortie JSON strict:
{
  "questions": [
    {
      "id": 1,
      "question": "La question ici ?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Explication courte de la bonne réponse"
    }
  ]
}`;

export async function POST(request: Request) {
  try {
    const { productName, productDescription } = await request.json();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `${SYSTEM_PROMPT}\n\nLogiciel: ${productName}\nDescription: ${productDescription || "Un logiciel open source populaire"}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    const parsed = JSON.parse(text);
    
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Fallback quiz if API fails
    const fallbackQuiz = {
      questions: [
        {
          id: 1,
          question: "Quel est le principal avantage des logiciels open source ?",
          options: ["Prix élevé", "Code source accessible", "Support limité", "Moins de fonctionnalités"],
          correctIndex: 1,
          explanation: "L'open source permet à tous d'accéder, modifier et distribuer le code source."
        },
        {
          id: 2,
          question: "Quelle commande permet généralement d'installer un logiciel sur Linux ?",
          options: ["install.exe", "apt install / dnf install", "download.sh", "setup.msi"],
          correctIndex: 1,
          explanation: "Les gestionnaires de paquets comme apt (Debian/Ubuntu) ou dnf (Fedora) sont utilisés pour installer des logiciels."
        },
        {
          id: 3,
          question: "Qu'est-ce qu'une licence GPL ?",
          options: ["Une licence propriétaire", "Une licence open source copyleft", "Un système de paiement", "Un format de fichier"],
          correctIndex: 1,
          explanation: "La GPL (GNU General Public License) est une licence libre qui garantit les libertés de l'utilisateur."
        },
        {
          id: 4,
          question: "Pourquoi la communauté est-elle importante dans l'open source ?",
          options: ["Pour vendre le logiciel", "Pour le support, les contributions et l'amélioration continue", "Pour créer de la publicité", "Pour limiter l'accès"],
          correctIndex: 1,
          explanation: "La communauté contribue au développement, au support et à l'amélioration des logiciels open source."
        },
        {
          id: 5,
          question: "Quel est l'équivalent open source de Microsoft Office ?",
          options: ["Google Docs", "LibreOffice", "Adobe Suite", "Notepad++"],
          correctIndex: 1,
          explanation: "LibreOffice est une suite bureautique complète et gratuite, alternative à Microsoft Office."
        }
      ]
    };
    
    return NextResponse.json(fallbackQuiz);
  }
}
