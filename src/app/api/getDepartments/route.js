import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";  // Asegúrate de que la ruta de authOptions es correcta
import pool from '../lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Sesión:", session);  // Esto debería mostrar la sesión

    if (!session || !session.user?.dni) {
      return NextResponse.json({ error: "No estás autenticado o no tienes DNI" }, { status: 401 });
    }

    const dni = session.user.dni;
    const rol = session.user.role;

    // Realizar la consulta usando el DNI y rol
    const [rows] = await pool.query(
      `
      SELECT 
  d.idDepartamento AS idDepartamento,
  d.nombre AS departamento_nombre,

  -- Subconsulta para obtener el jefe (primer usuario relacionado con el departamento)
  (SELECT U.nombre 
   FROM Pertenecer P 
   JOIN Usuario U ON U.DNI = P.DNI_Usuario_FK 
   WHERE P.idDepartamento_FK = d.idDepartamento 
   LIMIT 1) AS jefe_nombre_usuario,

  (SELECT U.apellido 
   FROM Pertenecer P 
   JOIN Usuario U ON U.DNI = P.DNI_Usuario_FK 
   WHERE P.idDepartamento_FK = d.idDepartamento 
   LIMIT 1) AS jefe_apellido_usuario,

  E.dineroPRE AS dinero_bolsa_presupuesto,
  I.dineroINV AS dinero_bolsa_inversion,
  SUM(N.importe_Total) AS total_facturas

FROM Departamento d

LEFT JOIN Bolsa_Dinero B ON B.idDepartamento_FK1 = d.idDepartamento
LEFT JOIN Inversion I ON I.idBolsa_Dinero_FK = B.idBolsa_Dinero
LEFT JOIN Presupuesto E ON E.idBolsa_Dinero_FK1 = B.idBolsa_Dinero
LEFT JOIN Orden_Compra N ON d.idDepartamento = N.idDepartamento_FK3
LEFT JOIN Factura F ON F.numero_compra_FK2 = N.numero_compra

-- Filtro según rol del usuario
${rol === 'Administrador' ? '' : `
  INNER JOIN Pertenecer P ON P.idDepartamento_FK = d.idDepartamento
  AND P.DNI_Usuario_FK = ?
`}

GROUP BY 
  d.idDepartamento,
  E.dineroPRE,
  I.dineroINV

      `,
      rol === 'Administrador' ? [] : [dni]
    );
    
    
    return NextResponse.json(rows);

  } catch (error) {
    console.error("Error en obtener la sesión:", error);  // Capturar cualquier error en el flujo
    return NextResponse.json({ error: "Hubo un problema al obtener la sesión" }, { status: 500 });
  }
}
