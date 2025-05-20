"use client"; // Marca el archivo como cliente

import Image from "next/image";
import CerrarSesion from "../buttons/cerrarSesion"; // Asegúrate de que la ruta sea correcta
import GestiónUsuario from "../buttons/gestionUsuario";

export default function Header() {
  return (
    <div className="cosaGrande bg-[#e41b23]">
      <Image
        src="/images/foto.jpg"
        alt="foto1"
        width={75}
        height={50}
      /> 
      <div className="imagen flex">
        <Image
          src="/images/logoSalesianosZaragoza.jpeg"
          alt="foto"
          width={140}
          height={50}
        /> 
      </div>
      <div className="cosa1 flex">
        <CerrarSesion>Cerrar Sesión</CerrarSesion>
      </div>
      <GestiónUsuario />
    </div>
  );
}
