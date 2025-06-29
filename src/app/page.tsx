"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#232323] p-6">
      <main className="flex flex-col items-center gap-8 w-full max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary text-center drop-shadow mb-2">
          Lingua Dojo
        </h1>
        <div className="flex justify-center mb-2">
          <Image
            src="/dojo-mascota.png"
            alt="Mascota Lingua Dojo"
            width={120}
            height={120}
            priority
          />
        </div>
        <p className="text-lg sm:text-xl text-primary text-center mb-4">
          ¡Crea tarjetas con la ayuda de nuestro asistente de IA y logra tus objetivos lingüísticos!
        </p>
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => router.push("/decks")}
            className="w-full py-3 px-6 rounded-lg bg-[#123624] text-white font-semibold text-center shadow hover:bg-primary-dark transition"
          >
            Empezar a estudiar
          </button>
          <button
            onClick={() => router.push("/decks/new")}
            className="w-full py-3 px-6 rounded-lg bg-[#123624] text-white font-semibold text-center shadow hover:bg-primary-dark transition"
          >
            Crear nuevo deck
          </button>
        </div>
        <div className="mt-8 text-xs text-primary text-center">
          Proyecto open source — Hecho con Next.js, TypeScript y Tailwind CSS
        </div>
      </main>
    </div>
  );
}
