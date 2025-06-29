"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Flashcard {
  word: string;
  definition: string;
  example: string;
}

interface Deck {
  name: string;
  cards: Flashcard[];
}

export default function EditDeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckName = decodeURIComponent(params?.deck as string || "");
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [name, setName] = useState(deckName);
  const [success, setSuccess] = useState(false);
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && deckName) {
      const decks: Deck[] = JSON.parse(localStorage.getItem("lingua_decks") || "[]");
      const found = decks.find((d) => d.name === deckName) || null;
      setDeck(found);
      setCards(found?.cards || []);
    }
  }, [deckName]);

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
    const decks: Deck[] = JSON.parse(localStorage.getItem("lingua_decks") || "[]");
    const updated = decks.map((d) => d.name === deckName ? { name, cards } : d);
    localStorage.setItem("lingua_decks", JSON.stringify(updated));
    setSuccess(true);
    setTimeout(() => router.push("/decks"), 1200);
  };

  if (!deck) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Deck no encontrado.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#232323] p-8">
      <h2 className="text-3xl font-bold mb-4 text-primary">Editar deck</h2>
      <div className="w-full max-w-md bg-[#232323] rounded-lg shadow p-6 flex flex-col gap-4 border border-primary">
        <input
          type="text"
          placeholder="Nombre del deck"
          className="border border-primary rounded px-3 py-2 mb-2 bg-[#232323] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <ul className="mb-4 max-h-32 overflow-y-auto">
          {cards.map((c, i) => (
            <li key={i} className="mb-2 text-sm text-primary bg-[#1a2a20] rounded px-2 py-1">
              <span className="font-bold">{c.word}</span>: {c.definition} <span className="italic">({c.example})</span>
              <button onClick={() => deleteCard(i)} className="ml-2 text-xs px-2 py-1 rounded bg-red-200 text-red-900 hover:bg-red-300">Eliminar</button>
            </li>
          ))}
        </ul>
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
          <button
            onClick={addCard}
            className="mt-2 px-4 py-2 rounded bg-[#123624] text-white font-semibold hover:bg-primary-dark transition"
            type="button"
          >
            Agregar tarjeta
          </button>
        </div>
        <button
          onClick={saveDeck}
          className="mt-4 px-4 py-2 rounded bg-[#123624] text-white font-semibold hover:bg-primary-dark transition"
          disabled={!name || cards.length === 0}
        >
          Guardar cambios
        </button>
        {success && <div className="text-green-600 mt-2">¡Deck actualizado!</div>}
      </div>
    </div>
  );
}
