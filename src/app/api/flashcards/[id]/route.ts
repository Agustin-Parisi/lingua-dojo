import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/flashcards/[id] - Obtener una flashcard por ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const flashcard = await prisma.flashcard.findUnique({ where: { id: params.id } });
    if (!flashcard) return NextResponse.json({ error: 'Flashcard no encontrada' }, { status: 404 });
    return NextResponse.json(flashcard);
  } catch {
    return NextResponse.json({ error: 'Error al obtener la flashcard' }, { status: 500 });
  }
}

// PUT /api/flashcards/[id] - Actualizar una flashcard
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const { front, back, example } = data;
    const updatedFlashcard = await prisma.flashcard.update({
      where: { id: params.id },
      data: { front, back, example },
    });
    return NextResponse.json(updatedFlashcard);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar la flashcard' }, { status: 500 });
  }
}

// DELETE /api/flashcards/[id] - Eliminar una flashcard
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.flashcard.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Flashcard eliminada' });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar la flashcard' }, { status: 500 });
  }
}
