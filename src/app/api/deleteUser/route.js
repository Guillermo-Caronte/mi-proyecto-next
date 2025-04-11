import { pool } from '@/app/api/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { codigoCliente } = body;

    if (!codigoCliente) {
      return NextResponse.json(
        { error: 'El código de cliente es requerido' },
        { status: 400 }
      );
    }

    const [result] = await pool.query('DELETE FROM clientes WHERE CODIGOCLIENTE = ?', [codigoCliente]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Cliente eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el cliente' },
      { status: 500 }
    );
  }
}
