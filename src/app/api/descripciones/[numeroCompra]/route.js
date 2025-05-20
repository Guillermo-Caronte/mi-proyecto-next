import { NextResponse } from "next/server";
import pool from "../../lib/db"; // ajusta el path a tu archivo real

export async function GET(req, { params }) {
  const awaitedParams = await params; // esperar params
  const { numeroCompra } = awaitedParams;

  console.log("Número de compra recibido:", numeroCompra);

  if (!numeroCompra) {
    return new Response("Falta el número de compra", { status: 400 });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT ec.nombre, ec.fungible, ss.cantidad 
      FROM Elemento_Compra ec
      JOIN Ser_solicitado ss ON ss.id_Elemento_Compra_FK = ec.idElemento_Compra
      JOIN Orden_Compra oc ON oc.numero_compra = ss.numero_compra_FK3
      WHERE oc.numero_compra = ?
    `,
      [numeroCompra]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
  }
}
