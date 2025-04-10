import { getData } from "@/app/server/select";
import styles from "./dbPrueba.module.css"

export default async function DbPrueba() {
  const data = await getData();
  console.log(data);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Base de datos de clientes</h1>
      <div className={styles.cardGrid}>
        {data.map((item) => (
          <div key={item.id || item.CODIGOCLIENTE} className={styles.card}>
            <h2 className={styles.cardTitle}>Cliente: {item.CODIGOCLIENTE}</h2>
            <div className={styles.cardContent}>

              <p className={styles.cardField}>
                <span className={styles.cardLabel}>Nombre:</span> {item.NOMBRECLIENTE}
              </p>
              <p className={styles.cardField}>
                <span className={styles.cardLabel}>Apellidos:</span> {item.APELLIDO1CLIENTE} {item.APELLIDO2CLIENTE}
              </p>
              <p className={styles.cardField}>
                <span className={styles.cardLabel}>Dirección:</span> {item.DIRECCION}
              </p>
              <p className={styles.cardField}>
                <span className={styles.cardLabel}>Teléfono:</span> {item.TELEFONO}
              </p>
              <p className={styles.cardField}>
                <span className={styles.cardLabel}>Observaciones:</span> {item.OBSERVACIONES}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
