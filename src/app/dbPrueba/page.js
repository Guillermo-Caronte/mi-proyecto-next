import { getData } from '../server/select'; 
import styles from "./dbPrueba.module.css"

export default async function DbPrueba() {
  const data = await getData();
  console.log(data);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Albanyil</h1>
      <div className={styles.cardGrid}>
        {data.map((item) => (
          <div key={item.dni} className={styles.card}>
            <h2 className={styles.cardTitle}>DNI: {item.dni}</h2>
            <div className={styles.cardContent}>
              <p className={styles.cardField}>
                <span className={styles.cardLabel}>Nombre:</span> {item.nombre}
              </p>
              <p className={styles.cardField}>
                <span className={styles.cardLabel}>Apellidos:</span> {item.apellidos}
              </p>
              <p className={styles.cardField}>
                <span className={styles.cardLabel}>Fecha de nacimiento:</span> {item.fecha_nacimiento}
              </p>
              <p className={styles.cardField}>
                <span className={styles.cardLabel}>Dirección:</span> {item.direccion}
              </p>
              <p className={styles.cardField}>
                <span className={styles.cardLabel}>Teléfono:</span> {item.telefono}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
