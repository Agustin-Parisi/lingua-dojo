"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Deck {
  name: string;
  cards: { word: string; definition: string; example: string }[];
}

export default function DecksPage() {
  const [userDecks, setUserDecks] = useState<Deck[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const decks = JSON.parse(localStorage.getItem("lingua_decks") || "[]");
      setUserDecks(decks);
    }
  }, []);

  const deleteDeck = (name: string) => {
    if (window.confirm(`¿Eliminar el deck "${name}"?`)) {
      const decks = userDecks.filter((d) => d.name !== name);
      setUserDecks(decks);
      localStorage.setItem("lingua_decks", JSON.stringify(decks));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#232323] p-8">
      <h2 className="text-3xl font-bold mb-4 text-primary">Selecciona un deck</h2>
      <ul className="w-full max-w-md flex flex-col gap-4">
        <li>
          <Link href="/decks/sample">
            <div className="rounded-lg border border-primary bg-[#232323] p-6 shadow cursor-pointer hover:bg-primary hover:text-white transition">
              <div className="text-lg font-semibold text-primary">Deck de prueba (Inglés)</div>
              <div className="text-gray-400 text-sm">10 palabras en inglés con definiciones y ejemplos</div>
            </div>
          </Link>
        </li>
        {userDecks.map((deck, idx) => (
          <li key={deck.name + idx} className="relative group">
            <Link href={`/decks/user/${encodeURIComponent(deck.name)}`}>
              <div className="rounded-lg border border-primary bg-[#232323] p-6 shadow cursor-pointer hover:bg-primary hover:text-white transition">
                <div className="text-lg font-semibold text-primary">{deck.name}</div>
                <div className="text-gray-400 text-sm">{deck.cards.length} tarjetas</div>
              </div>
            </Link>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <Link href={`/decks/user/${encodeURIComponent(deck.name)}/edit`} className="text-xs px-2 py-1 rounded bg-yellow-200 text-yellow-900 hover:bg-yellow-300">Editar</Link>
              <button onClick={() => deleteDeck(deck.name)} className="text-xs px-2 py-1 rounded bg-red-200 text-red-900 hover:bg-red-300">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
