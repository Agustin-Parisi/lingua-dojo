const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.deck.create({
    data: {
      name: "Deck de prueba",
      language: "en",
      cards: {
        create: [
          { word: "apple", definition: "A fruit.", example: "I eat an apple every day." },
          { word: "dog", definition: "A domestic animal.", example: "The dog barked loudly." },
          { word: "book", definition: "A set of written pages.", example: "She read a book." },
          { word: "car", definition: "A vehicle.", example: "The car is red." },
          { word: "house", definition: "A building for people to live in.", example: "They bought a new house." },
          { word: "water", definition: "A liquid.", example: "Drink water to stay hydrated." },
          { word: "tree", definition: "A plant.", example: "The tree is tall." },
          { word: "cat", definition: "A small animal.", example: "The cat sleeps a lot." },
          { word: "sun", definition: "The star at the center of our solar system.", example: "The sun is shining." },
          { word: "pen", definition: "An instrument for writing.", example: "He wrote with a pen." }
        ]
      }
    }
  });
  console.log("Deck de prueba creado");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
