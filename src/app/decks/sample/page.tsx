"use client";
import { useState } from "react";
import { sampleDeck } from "../sample-deck";

export default function SampleDeckStudy() {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = sampleDeck[current];

  const nextCard = () => {
    setFlipped(false);
    setCurrent((prev) => (prev + 1 < sampleDeck.length ? prev + 1 : 0));
  };
  const prevCard = () => {
    setFlipped(false);
    setCurrent((prev) => (prev - 1 >= 0 ? prev - 1 : sampleDeck.length - 1));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">Deck de prueba</h2>
      <div className="mb-6 text-gray-500 dark:text-gray-400">Palabra {current + 1} de {sampleDeck.length}</div>
      <div
        className="w-80 h-56 flex flex-col items-center justify-center rounded-xl shadow-lg bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-700 cursor-pointer transition-transform duration-300 relative"
        onClick={() => setFlipped((f) => !f)}
        tabIndex={0}
        aria-label={flipped ? `Definición y ejemplo de ${card.word}` : `Palabra: ${card.word}`}
        style={{ perspective: 1000 }}
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
            <span className="text-3xl font-bold text-indigo-700 dark:text-indigo-200">{card.word}</span>
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
              <div className="text-base text-gray-700 dark:text-gray-200"><span className="font-bold">Definición:</span> {card.definition}</div>
              <div className="text-base text-gray-600 dark:text-gray-400"><span className="font-bold">Ejemplo:</span> <span className="italic">{card.example}</span></div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <button onClick={prevCard} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">Anterior</button>
        <button onClick={nextCard} className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">Siguiente</button>
      </div>
      <div className="mt-4 text-xs text-gray-400">Haz clic en la tarjeta para ver la definición y ejemplo</div>
    </div>
  );
}
