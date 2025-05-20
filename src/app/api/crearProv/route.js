
import { NextResponse } from 'next/server';
import pool from '@/app/api/lib/db';

export async function POST(req) {
  const { cif, nombre, direccion, telefono, contacto, departamento_id } = await req.json();

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [result] = await connection.query(
      'INSERT INTO Proveedor (CIF, direccion, nombre, contacto, tlf) VALUES (?, ?, ?, ?, ?)',
      [cif, direccion, nombre ,contacto, telefono ]
    );

    

    await connection.query(
      'INSERT INTO Abastecer (cif_proveedor_FK, idDepartamento_FK2) VALUES (?, ?)',
      [cif,departamento_id]
    );

    await connection.commit();
    return NextResponse.json({ mensaje: 'Proveedor creado y asignado.' }, { status: 200 });
  } catch (error) {
    await connection.rollback();
    console.error('Error en crear-y-asignar:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  } finally {
    connection.release();
  }
}
