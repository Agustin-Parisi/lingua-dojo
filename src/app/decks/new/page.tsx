"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Flashcard {
  word: string;
  definition: string;
  example: string;
}

export default function NewDeckPage() {
  const [deckName, setDeckName] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const addCard = () => {
    if (word && definition && example) {
      setCards([...cards, { word, definition, example }]);
      setWord("");
      setDefinition("");
      setExample("");
    }
  };

  const saveDeck = () => {
    if (deckName && cards.length > 0) {
      // Guardar en localStorage (puede reemplazarse por backend en el futuro)
      const decks = JSON.parse(localStorage.getItem("lingua_decks") || "[]");
      decks.push({ name: deckName, cards });
      localStorage.setItem("lingua_decks", JSON.stringify(decks));
      setSuccess(true);
      setDeckName("");
      setCards([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#232323] p-8">
      <h2 className="text-3xl font-bold mb-4 text-primary">Crear nuevo deck</h2>
      <div className="w-full max-w-md bg-[#232323] rounded-lg shadow p-6 flex flex-col gap-4 border border-primary">
        <input
          type="text"
          placeholder="Nombre del deck"
          className="border border-primary rounded px-3 py-2 mb-2 bg-[#232323] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          value={deckName}
          onChange={e => setDeckName(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Palabra"
            className="border border-primary rounded px-3 py-2 bg-[#232323] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            value={word}
            onChange={e => setWord(e.target.value)}
          />
          <input
            type="text"
            placeholder="Definición"
            className="border border-primary rounded px-3 py-2 bg-[#232323] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            value={definition}
            onChange={e => setDefinition(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ejemplo"
            className="border border-primary rounded px-3 py-2 bg-[#232323] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            value={example}
            onChange={e => setExample(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={addCard}
            className="mt-2 px-4 py-2 rounded bg-[#123624] text-white font-semibold hover:bg-primary-dark transition"
            type="button"
          >
            Agregar tarjeta
          </button>
          <button
            onClick={() => router.push("/decks/ai-page")}
            className="mt-2 px-4 py-2 rounded bg-[#123624] text-white font-semibold hover:bg-primary-dark transition"
            type="button"
          >
            Crear deck automáticamente con IA
          </button>
        </div>
        <ul className="mt-4 max-h-32 overflow-y-auto">
          {cards.map((c, i) => (
            <li key={i} className="mb-2 text-sm text-primary bg-[#1a2a20] rounded px-2 py-1">
              <span className="font-bold">{c.word}</span>: {c.definition} <span className="italic">({c.example})</span>
            </li>
          ))}
        </ul>
        <button
          onClick={saveDeck}
          className="mt-4 px-4 py-2 rounded bg-[#123624] text-white font-semibold hover:bg-primary-dark transition"
          disabled={!deckName || cards.length === 0}
        >
          Guardar deck
        </button>
        {success && <div className="text-green-600 mt-2">¡Deck creado correctamente!</div>}
      </div>
    </div>
  );
}
