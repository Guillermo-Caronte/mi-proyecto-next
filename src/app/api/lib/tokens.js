import pool from './db.js';  // Importa la conexión a la base de datos
import crypto from 'crypto';

// Función para generar el token
function generarToken(nombre, DNI) {
  if (!nombre || !DNI) {
    throw new Error('Nombre y DNI son requeridos para generar el token.');
  }

  const datos = `${nombre}:${DNI}`;
  return crypto.createHash('sha256').update(datos).digest('hex');
}

// Función para verificar si el usuario ya existe
async function verificarUsuarioExistente(email) {
  if (!email) {
    throw new Error('El email es requerido para verificar la existencia del usuario.');
  }

  const [rows] = await pool.execute('SELECT * FROM Usuario WHERE email = ?', [email]);
  return rows.length > 0;
}
async function obtenerRol(email) {
  const [rows] = await pool.execute('SELECT rol FROM Usuario WHERE email = ?', [email]);
  if (rows.length > 0) {
    return rows[0].rol;
  }
  return null;
}
async function obtenerDNI(email) {
  const [rows] = await pool.execute('SELECT DNI FROM Usuario WHERE email = ?', [email]);
  if (rows.length > 0) {
    return rows[0].DNI;
  }
  return null;
}
// Función para generar o actualizar el token en la base de datos
async function actualizarTokens(email, nombre, DNI) {
  try {
    const existeUsuario = await verificarUsuarioExistente(email);

    if (!existeUsuario) {
      console.log("El usuario no existe, puedes crear un nuevo registro o manejarlo según lo necesites.");
      throw new Error("Usuario no encontrado. Por favor, regístrate.");
    }

    const token = generarToken(nombre, DNI);

    await pool.execute('UPDATE Usuario SET token = ? WHERE email = ?', [token, email]);
    console.log('Token generado y almacenado correctamente.');
    return token;
  } catch (error) {
    console.error('Error generando o verificando tokens:', error);
    throw new Error('No se pudo generar el token o verificar el usuario');
  }
}

export { actualizarTokens };
export { obtenerRol };
export { obtenerDNI };
