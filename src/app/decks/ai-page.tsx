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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">Crear deck con IA</h2>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col gap-4">
        <textarea
          className="border rounded px-3 py-2 min-h-[80px]"
          placeholder="Ingresa una lista de palabras, separadas por coma, espacio o salto de línea"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
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
              className="border rounded px-3 py-2 mb-2"
              value={deckName}
              onChange={e => setDeckName(e.target.value)}
            />
            <ul className="max-h-48 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-800 mb-2">
              {cards.map((card, i) => (
                <li key={i} className="mb-2">
                  <b>{card.word}</b>: {card.definition} <span className="italic">{card.example}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={saveDeck}
              className="mt-2 px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
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
