"use client";
import { useState } from "react";

async function getAIFlashcards(words: string[]): Promise<{ word: string; definition: string; example: string }[]> {
  const res = await fetch("/api/ai-flashcards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ words })
  });
  if (!res.ok) throw new Error("Error al generar tarjetas con IA");
  const data = await res.json();
  return data.cards;
}

export default function AIDeckPage() {
  const [input, setInput] = useState("");
  const [deckName, setDeckName] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<{ word: string; definition: string; example: string }[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);
    const words = input
      .split(/[\s,;\n]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0);
    if (words.length === 0) {
      setError("Debes ingresar al menos una palabra.");
      setLoading(false);
      return;
    }
    try {
      const generated = await getAIFlashcards(words);
      setCards(generated);
    } catch {
      setError("Error generando tarjetas con IA.");
    }
    setLoading(false);
  };

  const saveDeck = () => {
    if (!deckName || cards.length === 0) return;
    const decks = JSON.parse(localStorage.getItem("lingua_decks") || "[]");
    decks.push({ name: deckName, cards });
    localStorage.setItem("lingua_decks", JSON.stringify(decks));
    setSuccess(true);
    setDeckName("");
    setCards([]);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#232323] p-8">
      <h2 className="text-3xl font-bold mb-4 text-primary">Crear deck con IA</h2>
      <div className="w-full max-w-md bg-[#232323] rounded-lg shadow p-6 flex flex-col gap-4 border border-primary">
        <textarea
          className="border border-primary rounded px-3 py-2 min-h-[80px] bg-[#232323] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ingresa una lista de palabras, separadas por coma, espacio o salto de línea"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          className="px-4 py-2 rounded bg-[#123624] text-white font-semibold hover:bg-primary-dark transition"
          disabled={loading || !input.trim()}
        >
          {loading ? "Generando..." : "Generar tarjetas con IA"}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {cards.length > 0 && (
          <>
            <input
              type="text"
              placeholder="Nombre del deck"
              className="border border-primary rounded px-3 py-2 mb-2 bg-[#232323] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              value={deckName}
              onChange={e => setDeckName(e.target.value)}
            />
            <ul className="max-h-48 overflow-y-auto border border-primary rounded p-2 bg-[#1a2a20] mb-2">
              {cards.map((card, i) => (
                <li key={i} className="mb-2 text-primary">
                  <span className="font-bold text-[#3f9b0b]">{card.word}</span>: {card.definition} <span className="italic text-white">{card.example}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={saveDeck}
              className="mt-2 px-4 py-2 rounded bg-[#123624] text-white font-semibold hover:bg-primary-dark transition"
              disabled={!deckName}
            >
              Guardar deck
            </button>
            {success && <div className="text-green-600 mt-2">¡Deck guardado correctamente!</div>}
          </>
        )}
      </div>
    </div>
  );
}
