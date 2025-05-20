import pool from '../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  console.log("GET request received");

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("idDepartamento");

  console.log("ID del departamento:", id);

  if (!id) {
    console.log("Falta el id del departamento");
    return NextResponse.json({ error: "Falta el id del departamento" }, { status: 400 });
  }

  try {
    const [proveedores] = await pool.query(`
      SELECT P.nombre, P.CIF FROM Proveedor AS P
      JOIN Abastecer AS A ON P.CIF = A.cif_proveedor_FK
      JOIN Departamento AS D ON A.idDepartamento_FK2 = D.idDepartamento
      WHERE A.idDepartamento_FK2 = ?
    `, [id]);

    if (proveedores.length === 0) {
      return NextResponse.json(
        { message: "No se encontraron proveedores para este departamento" },
        { status: 404 }
      );
    }

    return NextResponse.json(proveedores, { status: 200 });

  } catch (error) {
    console.error("Error al obtener los datos del departamento:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
