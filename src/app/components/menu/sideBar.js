"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Importar router para redirecciones

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter(); // Inicializar router

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const query = searchQuery.toLowerCase();
      // Mapa de búsqueda
      const pages = {
        "inicio": "/departamentos/",
        "home": "/departamentos/",
        "gestión": "/pagina1/",
        "ordenes": "/pagina2/",
        // Puedes agregar más rutas aquí
      };

      for (const key in pages) {
        if (query.includes(key)) {
          router.push(pages[key]);
          return;
        }
      }

      alert("No se encontró ninguna página para tu búsqueda.");
    }
  };

  return (
    <div className="sidebar" style={{ display: "flex", flexDirection: "column", height: "800px" }}>
      {/* Menú de navegación */}
      <ul className="menu" style={{ flex: "1", overflowY: "auto", marginTop: "0px" }}>
        <p style={{ fontSize: "14px", fontFamily: "inherit", color: "#454545" }}>Gestión de Bolsas</p>
        <li className="menu-item">
          <strong style={{ fontSize: "14px", fontFamily: "inherit" }}>Home</strong>
        </li>
        <li className="menu-item">
          <a href="/departamentos/">
            <Image
              src="/images/inicio.png"
              alt="foto"
              width={25}
              height={25}
            />
            <span style={{ fontSize: "14px", fontFamily: "inherit" }}>Inicio</span>
          </a>
        </li>
        <li className="menu-item">
          <div className="search-container" style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchSubmit} // Detecta Enter
              placeholder="Buscar"
              className="search-input"
              style={{ fontSize: "14px", fontFamily: "inherit", width: "100%" }}
            />
          </div>
        </li>
        <li className="menu-item">
          <a href="/ajustes">
            <Image
              src="/images/ajustes.png"
              alt="foto"
              width={25}
              height={25}
            />
            <span style={{ fontSize: "14px", fontFamily: "inherit" }}>Ajustes</span>
          </a>
        </li>
        <li className="menu-item">
          <a href="/soporte">
            <Image
              src="/images/soporte.png"
              alt="foto"
              width={25}
              height={25}
            />
            <span style={{ fontSize: "14px", fontFamily: "inherit" }}>Soporte Técnico</span>
          </a>
        </li>
      </ul>
    </div>
  );
}