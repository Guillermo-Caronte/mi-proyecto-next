import { pool } from '@/app/api/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    return NextResponse.json(
      { error: 'Error fetching users' },
      { status: 500 }
    );
  }
}
