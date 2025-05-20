"use client";
export default function Footer() {
    return (
      <>
        <div className="bg-[#e41b23] flex h-14 items-center text-white text-sm justify-between px-4">
          <div className="flex space-x-2">
            <a href="https://zaragoza.salesianos.edu/Privacidad/" className="underline">Privacidad</a>
            <a>|</a>
            <a href="https://zaragoza.salesianos.edu/Aviso-legal/" className="underline">Aviso legal</a>
            <a>|</a>
            <a href="https://zaragoza.salesianos.edu/politica-de-cookies/" className="underline">Política de Cookies</a>
          </div>
          <p className="text-center mx-auto">© Copyright Salesianos Zaragoza</p>
        </div>
      </>
      );
  }
      