"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <main className="flex flex-col items-center gap-8 w-full max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 dark:text-indigo-300 text-center drop-shadow mb-2">
          Lingua Dojo
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 text-center mb-4">
          Aprende idiomas con tarjetas tipo Anki, importando textos y generando
          definiciones automáticamente.
        </p>
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => router.push("/decks")}
            className="w-full py-3 px-6 rounded-lg bg-indigo-600 text-white font-semibold text-center shadow hover:bg-indigo-700 transition"
          >
            Empezar a estudiar
          </button>
          <button
            onClick={() => router.push("/decks/new")}
            className="w-full py-3 px-6 rounded-lg border border-indigo-400 text-indigo-700 dark:text-indigo-200 font-semibold text-center hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
          >
            Crear nuevo deck
          </button>
          <button
            onClick={() => router.push("/import")}
            className="w-full py-3 px-6 rounded-lg border border-gray-300 text-gray-700 dark:text-gray-200 font-medium text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Importar PDF/EPUB
          </button>
          <a
            onClick={() => router.push("/decks/ai-page")}
            className="w-full py-3 px-6 rounded-lg border border-blue-400 text-blue-700 dark:text-blue-200 font-semibold text-center hover:bg-blue-50 dark:hover:bg-blue-900 transition cursor-pointer"
          >
            Crear deck con IA
          </a>
        </div>
        <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 text-center">
          Proyecto open source — Hecho con Next.js, TypeScript y Tailwind CSS
        </div>
      </main>
    </div>
  );
}
