import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";  // Ruta ajustada según la estructura de tu proyecto
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);  // Usa authOptions aquí
    console.log("Sesión desde el servidor:", session);

    if (!session) {
      return NextResponse.json({ error: "No hay sesión" }, { status: 401 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error al obtener la sesión:", error);
    return NextResponse.json({ error: "Error al obtener la sesión" }, { status: 500 });
  }
}