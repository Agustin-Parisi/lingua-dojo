import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Tipado explícito para las tarjetas
interface Flashcard {
  id?: number;
  word: string;
  definition: string;
  example: string;
}

// GET /api/decks/[id] - Obtener un deck por ID
export async function GET(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const { params } = context;
  try {
    const deck = await prisma.deck.findUnique({
      where: { id: Number(params.id) },
      include: { cards: true },
    });
    if (!deck) return NextResponse.json({ error: 'Deck no encontrado' }, { status: 404 });
    // Adaptar la respuesta para que el frontend reciba deck.cards
    return NextResponse.json({
      id: deck.id,
      name: deck.name,
      cards: deck.cards.map((card: Flashcard) => ({
        id: card.id,
        word: card.word,
        definition: card.definition,
        example: card.example,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Error al obtener el deck' }, { status: 500 });
  }
}

// PUT /api/decks/[id] - Actualizar un deck y sus tarjetas
export async function PUT(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const { params } = context;
  try {
    const data = await req.json();
    const { name, language, cards } = data;
    const deckId = Number(params.id);

    // Actualizar nombre e idioma
    await prisma.deck.update({
      where: { id: deckId },
      data: { name, language },
    });

    // Eliminar todas las tarjetas existentes del deck
    await prisma.flashcard.deleteMany({ where: { deckId } });

    // Crear nuevas tarjetas
    if (Array.isArray(cards) && cards.length > 0) {
      await prisma.flashcard.createMany({
        data: cards.map((card: Flashcard) => ({
          word: card.word,
          definition: card.definition,
          example: card.example,
          deckId,
        })),
      });
    }

    // Devolver el deck actualizado con las nuevas tarjetas
    const updatedDeck = await prisma.deck.findUnique({
      where: { id: deckId },
      include: { cards: true },
    });
    return NextResponse.json(updatedDeck);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar el deck' }, { status: 500 });
  }
}

// DELETE /api/decks/[id] - Eliminar un deck y sus tarjetas asociadas
export async function DELETE(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  const { params } = context;
  try {
    const deckId = Number(params.id);
    // Eliminar todas las flashcards asociadas primero
    await prisma.flashcard.deleteMany({ where: { deckId } });
    // Ahora sí, eliminar el deck
    await prisma.deck.delete({ where: { id: deckId } });
    return NextResponse.json({ message: 'Deck eliminado' });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar el deck' }, { status: 500 });
  }
}
