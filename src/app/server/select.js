import { pool } from '@/app/lib/db';

export async function getData() {
  try {
    const [rows] = await pool.query('SELECT * FROM Albanyil');
    return rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}