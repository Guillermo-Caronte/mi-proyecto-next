'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import Avatar from "../avatares/avatar";

export default function gestionUsuario({children}) {
  const [open, setOpen] = useState(false);
  const {data: session, status} = useSession();
  const handleClick = async () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
    return (
      <div className=" cosa0 flex flex-row items-center justify-center">
        <Avatar />
        <button 
        onClick={handleClick}
        className="bg-[#e41b23] text-white px-2 py-2 hover:bg-red-700 rounded-full">
          <Image
            src="/images/flechaabajo.png"
            alt="Flecha abajo"
            width={32}
            height={32}
          />
          {children}
        </button> {open && (
        <>
          {/* Popup */}
          <div className="fixed top-13 right-1 z-[9999] bg-white p-4 rounded border border-black shadow-lg">
            <p className="font-semibold">Usuario: {session?.user?.name || 'Cargando...'}</p>
            <p className="font-semibold">Permisos: {session?.user?.role || 'Cargando...'}</p>
            <button
              onClick={handleClose}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Cerrar
            </button>
          </div>
        </>
      )}
    </div>
  );
}