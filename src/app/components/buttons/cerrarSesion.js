'use client'; // Marca el archivo como cliente

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // Usa useRouter desde next/navigation
import { useEffect, useState } from "react"; // Importa useState y useEffect
export default function CerrarSesion({ children }) {
  const router = useRouter(); // Importa useRouter desde next/navigation
  const [mounted, setMounted] = useState(false); // Estado para verificar si el componente está montado

  useEffect(() => {
    setMounted(true); // Marca el componente como montado en el cliente
  }, []);

  const handleLogout = async () => {
    await signOut({
      redirect: true, 
      callbackUrl: '/login',// Evita la redirección automática
    });
  };

  // Si el componente no está montado (es decir, estamos en el servidor), no renderizamos nada
  if (!mounted) return null;

  return (
    <button
      onClick={handleLogout}
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600 mr-7 p-6"
    >
      {children}
    </button>
  );
}
