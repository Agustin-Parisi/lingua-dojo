"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Deck {
  id: number;
  name: string;
  language: string;
  cards: { word: string; definition: string; example: string }[];
}

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/decks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDecks(data);
        } else {
          setError(data?.error || "Error al cargar los decks");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error de red o del servidor");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-primary mt-10">Cargando decks...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#232323] p-8">
      <h2 className="text-3xl font-bold mb-4 text-primary">Selecciona un deck</h2>
      <ul className="w-full max-w-md flex flex-col gap-4">
        {decks.map((deck) => (
          <li key={deck.id} className="relative group">
            <Link href={deck.name === "Deck de prueba" ? "/decks/sample" : `/decks/user/${deck.id}`}>
              <div className="rounded-lg border border-primary bg-[#232323] p-6 shadow cursor-pointer hover:bg-primary hover:text-white transition">
                <div className="text-lg font-semibold text-primary">{deck.name}</div>
                <div className="text-gray-400 text-sm">{deck.cards.length} tarjetas</div>
              </div>
            </Link>
            {deck.name !== "Deck de prueba" && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <Link href={`/decks/user/${deck.id}/edit`} className="text-xs px-2 py-1 rounded bg-yellow-200 text-yellow-900 hover:bg-yellow-300">Editar</Link>
                {/* Aquí podrías agregar botón de eliminar si lo deseas */}
              </div>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={() => window.location.href = "/"}
        className="mt-8 px-4 py-2 rounded bg-gray-700 text-white font-semibold hover:bg-gray-900 transition"
        type="button"
      >
        Volver al inicio
      </button>
    </div>
  );
}
