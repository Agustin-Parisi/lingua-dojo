"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Flashcard {
  word: string;
  definition: string;
  example: string;
}

interface Deck {
  id: number;
  name: string;
  cards: Flashcard[];
}

export default function UserDeckStudy() {
  const params = useParams();
  const deckId = params?.deck as string;
  const [deck, setDeck] = useState<Deck | null>(null);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (deckId) {
      fetch(`/api/decks/${deckId}`)
        .then((res) => res.json())
        .then((data) => {
          setDeck(data);
        });
    }
  }, [deckId]);

  if (!deck) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Deck no encontrado.</div>;
  }

  const card = deck.cards[current];

  const nextCard = () => {
    setFlipped(false);
    setCurrent((prev) => (prev + 1 < deck.cards.length ? prev + 1 : 0));
  };

  const prevCard = () => {
    setFlipped(false);
    setCurrent((prev) => (prev - 1 >= 0 ? prev - 1 : deck.cards.length - 1));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#232323] p-8">
      <h2 className="text-2xl font-bold mb-4 text-primary">{deck.name}</h2>
      <div className="mb-6 text-gray-400">Tarjeta {current + 1} de {deck.cards.length}</div>
      <div
        className="w-80 h-56 flex flex-col items-center justify-center rounded-xl shadow-lg bg-[#232323] border border-primary cursor-pointer transition-transform duration-300 relative"
        onClick={() => setFlipped((f) => !f)}
        tabIndex={0}
        aria-label={flipped ? `Definición y ejemplo de ${card.word}` : `Palabra: ${card.word}`}
        style={{ perspective: 1000, background: '#232323' }}
      >
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ${flipped ? "rotate-y-180" : ""}`}
          style={{
            backfaceVisibility: "hidden",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            width: "100%",
            height: "100%"
          }}
        >
          {!flipped ? (
            <span className="text-3xl font-bold" style={{ color: '#3f9b0b' }}>{card.word}</span>
          ) : null}
        </div>
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ${flipped ? "" : "rotate-y-180"}`}
          style={{
            backfaceVisibility: "hidden",
            transform: flipped ? "rotateY(0deg)" : "rotateY(180deg)",
            width: "100%",
            height: "100%"
          }}
        >
          {flipped ? (
            <div className="flex flex-col gap-2 text-center">
              <div className="text-base text-primary"><span className="font-bold">Definición:</span> {card.definition}</div>
              <div className="text-base text-white"><span className="font-bold">Ejemplo:</span> <span className="italic">{card.example}</span></div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={prevCard}
          className="px-4 py-2 rounded bg-[#123624] text-white font-semibold hover:bg-primary-dark transition"
        >Anterior</button>
        <button
          onClick={nextCard}
          className="px-4 py-2 rounded bg-[#123624] text-white font-semibold hover:bg-primary-dark transition"
        >Siguiente</button>
      </div>
    </div>
  );
}
