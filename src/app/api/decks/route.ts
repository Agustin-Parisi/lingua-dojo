import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// Tipos explícitos para mayor seguridad
interface Flashcard {
  word: string;
  definition: string;
  example: string;
}
interface Deck {
  id: number;
  name: string;
  language: string;
  cards: Flashcard[];
}

// GET /api/decks - Listar decks del usuario autenticado y el deck de prueba
export async function GET() {
  const session = await getServerSession(authOptions);
  try {
    let decks;
    if (session?.user?.id) {
      decks = await prisma.deck.findMany({
        where: {
          OR: [
            { userId: session.user.id },
            { name: 'Deck de prueba' },
          ],
        },
        include: { cards: true },
      });
    } else {
      decks = await prisma.deck.findMany({
        where: { name: 'Deck de prueba' },
        include: { cards: true },
      });
    }
    // Adaptar la respuesta para que el frontend reciba deck.cards
    const result = (decks as Deck[]).map((deck: Deck) => ({
      id: deck.id,
      name: deck.name,
      language: deck.language,
      cards: deck.cards.map((card: Flashcard) => ({
        word: card.word,
        definition: card.definition,
        example: card.example,
      })),
    }));
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Error al obtener los decks' }, { status: 500 });
  }
}

// POST /api/decks - Crear un nuevo deck
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  try {
    const data = await req.json();
    const { name, language, flashcards } = data;
    const newDeck = await prisma.deck.create({
      data: {
        name,
        language,
        userId: session.user.id,
        cards: {
          create: flashcards || [],
        },
      },
      include: { cards: true },
    });
    return NextResponse.json({
      id: newDeck.id,
      name: newDeck.name,
      language: newDeck.language,
      cards: newDeck.cards.map((card: Flashcard) => ({
        word: card.word,
        definition: card.definition,
        example: card.example,
      })),
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear el deck' }, { status: 500 });
  }
}
