import { NextResponse } from 'next/server';
import pool from '@/app/api/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req, context) {  
  try {
    const params = await context.params;
    const idDepartamento = params.id;
    console.log('ID Departamento:', idDepartamento);
    const formData = await req.formData();

    const dataJson = formData.get("data");
    const pdfFile = formData.get("factura");

    if (!dataJson) {
      return NextResponse.json({ error: "Datos no proporcionados" }, { status: 400 });
    }

    const data = JSON.parse(dataJson);
    const {
      codigo,
      comentario,
      proveedor,
      fecha,
      inversion: inversionRaw,
      importeTotal,
      descripciones,
    } = data;

    const inversion = inversionRaw === true || inversionRaw === 'true';

    if (!codigo || !comentario || !proveedor || !fecha || !importeTotal || !descripciones) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [proveedorResult] = await connection.query(
        `SELECT CIF FROM Proveedor WHERE CIF = ? LIMIT 1`,
        [proveedor]
      );

      if (proveedorResult.length === 0) {
        return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 });
      }

      const cifProveedor = proveedorResult[0].CIF;

      await connection.query(
        `INSERT INTO Orden_Compra (numero_compra, descripcion, fch, cif_proveedor_FK1, idDepartamento_FK3, importe_total)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [codigo, comentario, fecha, cifProveedor, idDepartamento, importeTotal]
      );

      for (const desc of descripciones) {
        console.log('Descripción recibida:', desc);
        const { articulo, fungible, unidades: cantidadDesc } = desc;

        const [existing] = await connection.query(
          `SELECT idElemento_Compra FROM Elemento_Compra WHERE nombre = ? LIMIT 1`,
          [articulo]
        );

        let idElemento;
        if (existing.length > 0) {
          idElemento = existing[0].idElemento_Compra;
        } else {
          const [elemResult] = await connection.query(
            `INSERT INTO Elemento_Compra (nombre, fungible) VALUES (?, ?)`,
            [articulo, fungible ? 1 : 0]
          );
          idElemento = elemResult.insertId;
        }

        await connection.query(
          `INSERT INTO Ser_Solicitado (numero_compra_FK3, id_Elemento_Compra_FK, cantidad) VALUES (?, ?, ?)`,
          [codigo, idElemento, cantidadDesc]
        );
      }

      let pdfFilePath = null;
      if (pdfFile && typeof pdfFile.name === 'string') {
        const buffer = Buffer.from(await pdfFile.arrayBuffer());
        const filename = `${uuidv4()}_${pdfFile.name}`;
        const filePath = path.join(process.cwd(), 'public/pdfs', filename);
        await writeFile(filePath, buffer);
        pdfFilePath = `/pdfs/${filename}`;
      }

      await connection.query(
        `INSERT INTO Factura (comentario, pdf, fch_pedido, cif_proveedor_FK2, numero_compra_FK2)
         VALUES (?, ?, ?, ?, ?)`,
        [comentario, pdfFilePath, fecha, cifProveedor, codigo]
      );

      const [bInversion] = await connection.query(
        `SELECT numero_inversion FROM Inversion AS I
         JOIN Bolsa_Dinero AS B ON B.idBolsa_Dinero = I.idBolsa_Dinero_FK
         JOIN Departamento AS D ON D.idDepartamento = B.idDepartamento_FK1
         WHERE D.idDepartamento = ?
         ORDER BY I.fch DESC
         LIMIT 1`,
        [idDepartamento]
      );

      if (bInversion.length === 0) {
        return NextResponse.json({ error: "Bolsa de Inversión no encontrada" }, { status: 404 });
      }

      const [bPresupuesto] = await connection.query(
        `SELECT idPresupuesto FROM Presupuesto AS P
         JOIN Bolsa_Dinero AS B ON B.idBolsa_Dinero = P.idBolsa_Dinero_FK1
         JOIN Departamento AS D ON D.idDepartamento = B.idDepartamento_FK1
         WHERE D.idDepartamento = ? 
         ORDER BY P.fch DESC
         LIMIT 1`,
        [idDepartamento]  
      );

      if (bPresupuesto.length === 0) {
        return NextResponse.json({ error: "Bolsa de Presupuesto no encontrada" }, { status: 404 });
      }

      if (inversion) {
        await connection.query(
          `INSERT INTO Por_Inversion (numero_compra_FK1, numero_inversion_FK) VALUES (?, ?)`,
          [codigo, bInversion[0].numero_inversion]
        );
      } else {
        await connection.query(
          `INSERT INTO Por_Presupuesto (numero_compra_FK, id_Presupuesto) VALUES (?, ?)`,
          [codigo, bPresupuesto[0].idPresupuesto]
        );
      }

      await connection.commit();
      return NextResponse.json({ message: "Orden registrada correctamente" }, { status: 200 });

    } catch (err) {
      await connection.rollback();
      console.error("Error en la transacción:", err);
      return NextResponse.json({ error: "Error interno al guardar la orden" }, { status: 500 });
    } finally {
      connection.release();
    }

  } catch (err) {
    console.error("Error general en POST:", err);
    return NextResponse.json({ error: "Error general" }, { status: 500 });
  }
}
