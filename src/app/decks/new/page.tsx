"use client";
import { useState } from "react";

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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">Crear nuevo deck</h2>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre del deck"
          className="border rounded px-3 py-2 mb-2"
          value={deckName}
          onChange={e => setDeckName(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Palabra"
            className="border rounded px-3 py-2"
            value={word}
            onChange={e => setWord(e.target.value)}
          />
          <input
            type="text"
            placeholder="Definición"
            className="border rounded px-3 py-2"
            value={definition}
            onChange={e => setDefinition(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ejemplo"
            className="border rounded px-3 py-2"
            value={example}
            onChange={e => setExample(e.target.value)}
          />
          <button
            onClick={addCard}
            className="mt-2 px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Agregar tarjeta
          </button>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Tarjetas en el deck:</h3>
          <ul className="list-disc pl-5 text-sm">
            {cards.map((c, i) => (
              <li key={i}><b>{c.word}</b>: {c.definition} <span className="italic">({c.example})</span></li>
            ))}
          </ul>
        </div>
        <button
          onClick={saveDeck}
          className="mt-4 px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          disabled={!deckName || cards.length === 0}
        >
          Guardar deck
        </button>
        {success && <div className="text-green-600 mt-2">¡Deck guardado correctamente!</div>}
      </div>
    </div>
  );
}
