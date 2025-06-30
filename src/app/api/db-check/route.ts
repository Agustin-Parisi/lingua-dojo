import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$connect();
    return new Response("Conexión a la base de datos exitosa", { status: 200 });
  } catch (e) {
    return new Response("Error de conexión a la base de datos: " + (e instanceof Error ? e.message : String(e)), { status: 500 });
  }
}
