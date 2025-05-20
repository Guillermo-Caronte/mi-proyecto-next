'use client';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-red-50">
      <div className="bg-red-200 rounded-2xl shadow-md max-w-md w-105 text-center h-120 px-5 pt-20">
        <span className="text-3xl font-bold">APP NAME</span>
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-95 text-center h-70 mt-15">
          <h1 className="text-2xl font-bold mb-6 mt-5">Inicio de Sesión</h1>
          <button
            className="flex items-center justify-center gap-3 bg-white border border-gray-300 px-6 py-3 rounded-lg shadow hover:bg-gray-100 w-full mb-5"
            onClick={() => signIn("google", { callbackUrl: "http://localhost:3000/departamentos", prompt: 'select_account' })}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Iniciar sesión con Google
          </button>
          <span className="text-sm">Al hacer click aquí aceptas nuestros Términos de Servicio y Política de Privacidad</span>
        </div>
      </div>
    </div>
  );
}
