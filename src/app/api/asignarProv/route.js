// app/api/asignar-por-cif/route.js
import { NextResponse } from 'next/server';
import pool from '@/app/api/lib/db';

export async function POST(req) {
  const { cif, departamento_id } = await req.json();

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [results] = await connection.query(
      'SELECT CIF FROM Proveedor WHERE CIF = ?',
      [cif]
    );

    if (results.length > 0) {

      await connection.query(
        'INSERT INTO Abastecer (CIF_proveedor_FK, idDepartamento_FK2) VALUES (?, ?)',
        [cif, departamento_id]
      );

      await connection.commit();
      return NextResponse.json({ existe: true, mensaje: 'Proveedor asignado.' }, { status: 200 });
    } else {
      await connection.commit();
      // No existe proveedor
      return NextResponse.json({ existe: false }, { status: 200 });
    }
  } catch (error) {
    await connection.rollback();
    console.error('Error en asignar-por-cif:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  } finally {
    connection.release();
  }
}
