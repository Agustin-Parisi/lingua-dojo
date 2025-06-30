import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/flashcards - Listar todas las flashcards
export async function GET() {
  try {
    const flashcards = await prisma.flashcard.findMany();
    return NextResponse.json(flashcards);
  } catch {
    return NextResponse.json({ error: 'Error al obtener las flashcards' }, { status: 500 });
  }
}

// POST /api/flashcards - Crear una nueva flashcard
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { word, definition, example, deckId } = data;
    const newFlashcard = await prisma.flashcard.create({
      data: { word, definition, example, deckId },
    });
    return NextResponse.json(newFlashcard, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear la flashcard' }, { status: 500 });
  }
}
