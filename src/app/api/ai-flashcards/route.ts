import { NextRequest, NextResponse } from "next/server";

// Reemplaza esto por tu clave real de OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log("OPENAI_API_KEY:", OPENAI_API_KEY ? OPENAI_API_KEY.slice(0, 8) + "..." : "NO DEFINIDA");

interface Card {
  word: string;
  definition: string;
  example: string;
}

export async function POST(req: NextRequest) {
  const { words, language } = await req.json();
  if (!Array.isArray(words) || words.length === 0) {
    return NextResponse.json({ error: "Lista de palabras inválida" }, { status: 400 });
  }

  // Idioma para el prompt
  const langLabel: Record<string, string> = {
    en: "inglés",
    es: "español",
    fr: "francés",
    de: "alemán",
    it: "italiano",
    pt: "portugués",
    ru: "ruso",
    zh: "chino",
    ja: "japonés",
    ar: "árabe"
  };
  const lang = langLabel[language] || "inglés";

  const prompt = `Para cada palabra de la lista, dame una definición clara y un ejemplo de uso en ${lang}. Formato JSON: [{word, definition, example}]. Lista: ${words.join(", ")}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente que responde solo en JSON válido." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 1024
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI API error:", errorText); // Log detallado
    return NextResponse.json({ error: "Error en la API de OpenAI" }, { status: 500 });
  }

  const data = await response.json();
  // Extraer el JSON de la respuesta del modelo
  let cards: Card[] = [];
  try {
    const text = data.choices[0].message.content;
    cards = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "No se pudo parsear la respuesta de la IA" }, { status: 500 });
  }
  return NextResponse.json({ cards });
}
