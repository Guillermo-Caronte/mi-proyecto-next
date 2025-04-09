import { pool } from '@/app/lib/db';

        // Example query
export async function getData() {
  try {
    const [rows] = await pool.query('SELECT * FROM Clientes');
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}