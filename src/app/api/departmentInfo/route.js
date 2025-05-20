import pool from "../lib/db"; 

export async function GET(req) {
  console.log("GET request received");

  // Extrae el parámetro 'idDepartamento' de la URL
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("idDepartamento"); 

  console.log("ID del departamento:", id);

  if (!id) {
    console.log("Falta el id del departamento");
    return new Response("Falta el id del departamento", { status: 400 });
  }

  try {
    // Verifica si la consulta SQL está funcionando
    const [rows] = await pool.query(`
      SELECT
        d.idDepartamento AS idDepartamento,
        d.nombre AS departamento,
        bp.dineroPRE AS total_presupuesto,
        COALESCE(gastosPR.gasto_presupuesto, 0) AS gastos_presupuesto,
        bp.dineroPRE - COALESCE(gastosPR.gasto_presupuesto, 0) AS disponible_presupuesto,
        bi.dineroINV AS total_inversion,
        COALESCE(gastosPI.gasto_inversion, 0) AS gastos_inversion,
        bi.dineroINV - COALESCE(gastosPI.gasto_inversion, 0) AS disponible_inversion
      FROM Departamento d
      JOIN Bolsa_Dinero b ON b.idDepartamento_FK1 = d.idDepartamento
      LEFT JOIN Presupuesto bp ON bp.idBolsa_Dinero_FK1 = b.idBolsa_Dinero
      LEFT JOIN Inversion bi ON bi.idBolsa_Dinero_FK = b.idBolsa_Dinero
      LEFT JOIN (
        SELECT
          oc.idDepartamento_FK3 AS idDepartamento,
          SUM(oc.importe_Total) AS gasto_presupuesto
        FROM Orden_Compra oc
        JOIN Por_Presupuesto pr ON pr.numero_compra_FK = oc.numero_compra
        JOIN Factura f ON f.numero_compra_FK2 = oc.numero_compra
        GROUP BY oc.idDepartamento_FK3
      ) gastosPR ON gastosPR.idDepartamento = d.idDepartamento
      LEFT JOIN (
        SELECT
          oc.idDepartamento_FK3 AS idDepartamento,
          SUM(oc.importe_Total) AS gasto_inversion
        FROM Orden_Compra oc
        JOIN Por_Inversion pi ON pi.numero_compra_FK1 = oc.numero_compra
        JOIN Factura f ON f.numero_compra_FK2 = oc.numero_compra
        GROUP BY oc.idDepartamento_FK3
      ) gastosPI ON gastosPI.idDepartamento = d.idDepartamento
      WHERE d.idDepartamento = ?
    `, [id]);
    
     // Datos para el gráfico de línea (Gastos por fecha, por ejemplo)
     const [lineChart] = await pool.query(`
      SELECT 
        MONTH(f.fch_pedido) AS mes,
        SUM(oc.importe_Total) AS valor
      FROM Factura f
      JOIN Orden_compra oc ON f.numero_compra_FK2 = oc.numero_compra
      WHERE oc.idDepartamento_FK3 = ?
      GROUP BY mes
      ORDER BY mes;
    `, [id]);

    const [recientes] = await pool.query(`
      SELECT 
        f.idFactura,
        oc.importe_Total AS precio,
        f.fch_pedido,
        f.comentario,
        e.nombre AS resto,
        p.nombre AS procedencia
      FROM Factura f
      JOIN Orden_Compra oc ON f.numero_compra_FK2 = oc.numero_compra
      LEFT JOIN Ser_Solicitado ss ON ss.numero_compra_FK3 = oc.numero_compra
      LEFT JOIN Elemento_Compra e ON e.idElemento_Compra = ss.id_Elemento_Compra_FK
      LEFT JOIN Proveedor p ON p.CIF = f.cif_proveedor_FK2
      WHERE oc.idDepartamento_FK3 = ?
      ORDER BY f.fch_pedido DESC
      LIMIT 5;
    `, [id]);
      
    // Formatear datos para el frontend
    const lineChartData = lineChart.map(row => ({
      mes: row.mes,
      valor: row.valor
    }));
    
    const responseData = {
      nombreDepartamento: rows[0].departamento,
      total_presupuesto: rows[0].total_presupuesto,
      gastos_presupuesto: rows[0].gastos_presupuesto,
      disponible_presupuesto: rows[0].disponible_presupuesto,
      total_inversion: rows[0].total_inversion,
      gastos_inversion: rows[0].gastos_inversion,
      disponible_inversion: rows[0].disponible_inversion,
      lineChartData,
      gastosRecientes: recientes
    };
    console.log("Datos del departamento:", responseData);
    return new Response(JSON.stringify(responseData), {    
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error al obtener los datos del departamento:", error);
    return new Response("Error al obtener los datos del departamento", { status: 500 });
  }
}