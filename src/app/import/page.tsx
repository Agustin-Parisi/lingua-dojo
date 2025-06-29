"use client";
import { useState } from "react";

const STOPWORDS = [
  "the","and","a","to","of","in","that","is","was","he","for","it","with","as","his","on","be","at","by","i","this","had","not","are","but","from","or","have","an","they","which","one","you","were","her","all","she","there","would","their","we","him","been","has","when","who","will","no","more","if","out","so","said","what","up","its","about","into","than","them","can","only","other","new","some","could","time","these","two","may","then","do","first","any","my","now","such","like","our","over","man","me","even","most","made","after","also","did","many","before","must","through","back","years","where","much","your","way","well","down","should","because","each","just","those","people"
];

function extractWords(text: string) {
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter(w => w && !STOPWORDS.includes(w));
  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({ word, count }));
}

async function readPDF(file: File): Promise<string> {
  try {
    // @ts-ignore
    const pdfjsLib = await import("pdfjs-dist/build/pdf");
    // @ts-ignore
    pdfjsLib.GlobalWorkerOptions.workerSrc = "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const arrayBuffer = await file.arrayBuffer();
    // @ts-ignore
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + " ";
    }
    return text;
  } catch {
    throw new Error("No se pudo leer el PDF. Intenta con otro archivo.");
  }
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [words, setWords] = useState<{ word: string; count: number }[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [deckName, setDeckName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccess(false);
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    let text = "";
    if (f.type === "application/pdf" || f.name.endsWith(".pdf")) {
      try {
        text = await readPDF(f);
      } catch (err: any) {
        setError(err.message);
        return;
      }
    } else {
      setError("Solo se aceptan archivos PDF.");
      return;
    }
    const extracted = extractWords(text);
    setWords(extracted);
    setSelected(extracted.slice(0, 20).map(w => w.word));
  };

  const toggleWord = (word: string) => {
    setSelected(sel => sel.includes(word) ? sel.filter(w => w !== word) : [...sel, word]);
  };

  const saveDeck = () => {
    if (!deckName || selected.length === 0) return;
    const cards = selected.map(word => ({ word, definition: "", example: "" }));
    const decks = JSON.parse(localStorage.getItem("lingua_decks") || "[]");
    decks.push({ name: deckName, cards });
    localStorage.setItem("lingua_decks", JSON.stringify(decks));
    setSuccess(true);
    setDeckName("");
    setFile(null);
    setWords([]);
    setSelected([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">Importar PDF</h2>
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col gap-4">
        <input type="file" accept=".pdf,application/pdf" onChange={handleFile} />
        {error && <div className="text-red-600">{error}</div>}
        {words.length > 0 && (
          <>
            <input
              type="text"
              placeholder="Nombre del deck"
              className="border rounded px-3 py-2 mb-2"
              value={deckName}
              onChange={e => setDeckName(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-800">
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">Selecciona las palabras para tu deck:</div>
              <ul className="grid grid-cols-2 gap-2">
                {words.slice(0, 60).map(({ word, count }) => (
                  <li key={word}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selected.includes(word)}
                        onChange={() => toggleWord(word)}
                      />
                      <span>{word} <span className="text-xs text-gray-400">({count})</span></span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={saveDeck}
              className="mt-4 px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              disabled={!deckName || selected.length === 0}
            >
              Crear deck
            </button>
          </>
        )}
        {success && <div className="text-green-600 mt-2">¡Deck creado correctamente!</div>}
      </div>
    </div>
  );
}
