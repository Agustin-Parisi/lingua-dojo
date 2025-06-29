"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Flashcard {
  word: string;
  definition: string;
  example: string;
}

export default function EditDeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckName = decodeURIComponent(params?.deck as string || "");
  const [deck, setDeck] = useState<{ name: string; cards: Flashcard[] } | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [name, setName] = useState(deckName);
  const [success, setSuccess] = useState(false);
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && deckName) {
      const decks = JSON.parse(localStorage.getItem("lingua_decks") || "[]");
      const found = decks.find((d: any) => d.name === deckName);
      setDeck(found || null);
      setCards(found?.cards || []);
    }
  }, [deckName]);

  const updateCard = (idx: number, field: keyof Flashcard, value: string) => {
    setCards(cards => cards.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const deleteCard = (idx: number) => {
    setCards(cards => cards.filter((_, i) => i !== idx));
  };

  const addCard = () => {
    if (word && definition && example) {
      setCards([...cards, { word, definition, example }]);
      setWord("");
      setDefinition("");
      setExample("");
    }
  };

  const saveDeck = () => {
    if (!name || cards.length === 0) return;
    const decks = JSON.parse(localStorage.getItem("lingua_decks") || "[]");
    const updated = decks.map((d: any) => d.name === deckName ? { name, cards } : d);
    localStorage.setItem("lingua_decks", JSON.stringify(updated));
    setSuccess(true);
    setTimeout(() => router.push("/decks"), 1200);
  };

  if (!deck) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Deck no encontrado.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-3xl font-bold mb-4 text-yellow-700 dark:text-yellow-300">Editar deck</h2>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col gap-4">
        <input
          type="text"
          className="border rounded px-3 py-2 mb-2"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div className="flex flex-col gap-4">
          {cards.map((card, idx) => (
            <div key={idx} className="border rounded p-3 flex flex-col gap-2 bg-gray-50 dark:bg-gray-800">
              <input
                type="text"
                className="border rounded px-2 py-1"
                value={card.word}
                onChange={e => updateCard(idx, "word", e.target.value)}
                placeholder="Palabra"
              />
              <input
                type="text"
                className="border rounded px-2 py-1"
                value={card.definition}
                onChange={e => updateCard(idx, "definition", e.target.value)}
                placeholder="Definición"
              />
              <input
                type="text"
                className="border rounded px-2 py-1"
                value={card.example}
                onChange={e => updateCard(idx, "example", e.target.value)}
                placeholder="Ejemplo"
              />
              <button onClick={() => deleteCard(idx)} className="text-xs px-2 py-1 rounded bg-red-200 text-red-900 hover:bg-red-300 w-fit self-end">Eliminar tarjeta</button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 mt-4 border-t pt-4">
          <input
            type="text"
            placeholder="Palabra"
            className="border rounded px-2 py-1"
            value={word}
            onChange={e => setWord(e.target.value)}
          />
          <input
            type="text"
            placeholder="Definición"
            className="border rounded px-2 py-1"
            value={definition}
            onChange={e => setDefinition(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ejemplo"
            className="border rounded px-2 py-1"
            value={example}
            onChange={e => setExample(e.target.value)}
          />
          <button
            onClick={addCard}
            className="mt-2 px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Agregar nueva tarjeta
          </button>
        </div>
        <button
          onClick={saveDeck}
          className="mt-4 px-4 py-2 rounded bg-yellow-600 text-white font-semibold hover:bg-yellow-700 transition"
          disabled={!name || cards.length === 0}
        >
          Guardar cambios
        </button>
        {success && <div className="text-green-600 mt-2">¡Deck actualizado!</div>}
      </div>
    </div>
  );
}
