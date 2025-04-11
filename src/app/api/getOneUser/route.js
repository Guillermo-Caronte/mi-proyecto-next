import { pool } from '@/app/api/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const codigoCliente = searchParams.get('codigo');

    if (!codigoCliente) {
      return NextResponse.json(
        { error: 'El código de cliente es requerido' },
        { status: 400 }
      );
    }

    const [rows] = await pool.query('SELECT * FROM Clientes WHERE CODIGOCLIENTE = ?', [codigoCliente]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]); // Solo un usuario
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    return NextResponse.json(
      { error: 'Error al obtener el cliente' },
      { status: 500 }
    );
  }
}
