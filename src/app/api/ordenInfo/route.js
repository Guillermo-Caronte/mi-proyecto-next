// pages/api/ordenes.js
import { NextResponse } from 'next/server';
import pool from '../lib/db'; // Importa correctamente tu pool de conexiones

export async function GET(req) {
    console.log("GET request received");

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("idDepartamento");
  
    console.log("ID del departamento:", id);
  
    if (!id) {
      console.log("Falta el id del departamento");
      return new Response("Falta el id del departamento", { status: 400 });
    }

    try {
        const [rows] = await pool.query(`
            SELECT 
              oc.numero_compra AS 'Número_de_Compra',
              f.comentario AS 'Comentario',
              f.pdf AS 'Factura',
              p.nombre AS 'Proveedor',
              oc.fch AS 'Fecha',
              oc.importe_total AS 'Precio',
              CASE 
                WHEN pi.numero_inversion_FK IS NOT NULL THEN 'Inversión' 
                ELSE 'Presupuesto' 
              END AS 'Tipo'
            FROM 
              Orden_Compra oc
            JOIN 
              Factura f ON oc.numero_compra = f.numero_compra_FK2
            JOIN 
              Proveedor p ON f.cif_proveedor_FK2 = p.CIF
            JOIN 
              Departamento d ON oc.idDepartamento_FK3 = d.idDepartamento
            LEFT JOIN 
              Por_Inversion pi ON oc.numero_compra = pi.numero_compra_FK1
            WHERE 
              d.idDepartamento = ?
            ORDER BY 
              oc.fch DESC`, [id]);
    
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Error al ejecutar la consulta:", error);
        return NextResponse.json({ error: "Error al obtener datos de departamentos" }, { status: 500 });
    }
}

