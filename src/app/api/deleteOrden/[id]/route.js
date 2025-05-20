import { NextResponse } from 'next/server';
import pool from '@/app/api/lib/db';

export async function POST(req, context) {
  const codigo = context.params.id; // este es el número de orden

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    console.log("Intentando eliminar la orden:", codigo);

    await connection.query(`DELETE FROM Por_Inversion WHERE numero_compra_FK1 = ?`, [codigo]);
    await connection.query(`DELETE FROM Por_Presupuesto WHERE numero_compra_FK = ?`, [codigo]);
    await connection.query(`DELETE FROM Ser_Solicitado WHERE numero_compra_FK3 = ?`, [codigo]);
    await connection.query(`DELETE FROM Factura WHERE numero_compra_FK2 = ?`, [codigo]);

    const [result] = await connection.query(
      `DELETE FROM Orden_Compra WHERE numero_compra = ?`,
      [codigo]
    );

    await connection.commit();

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Orden eliminada correctamente" }, { status: 200 });
  } catch (err) {
    await connection.rollback();
    console.error("Error en la eliminación:", err);
    return NextResponse.json({ error: "Error al eliminar la orden" }, { status: 500 });
  } finally {
    connection.release();
  }
}
