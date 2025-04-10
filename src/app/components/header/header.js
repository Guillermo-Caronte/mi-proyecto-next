"use client";

import Link from 'next/link';

export default function Header() {
    return(
        <header className="bg-gradient-to-r from-[#db001b] to-[#b30017] text-white shadow-lg">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3 group">
                        <img 
                            src="/images/logo-salesianos.png" 
                            alt="Salesianos Logo" 
                            className="h-10 w-auto transform transition-transform duration-300 group-hover:scale-110" 
                        />
                        <span className="font-bold text-xl tracking-wide">Salesianos</span>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <Link 
                            href="/" 
                            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-md font-semibold transition-colors duration-200 relative group"
                        >
                            Inicio
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link 
                            href="/pages/pagina1" 
                            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-md font-semibold transition-colors duration-200 relative group"
                        >
                            Página 1
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link 
                            href="/pages/pagina2" 
                            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-md font-semibold transition-colors duration-200 relative group"
                        >
                            Página 2
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link 
                            href="/pages/rutas/rutaDinamica" 
                            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-md font-semibold transition-colors duration-200 relative group"
                        >
                            Ruta Dinámica
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link 
                            href="/pages/rutas/rutaEstatica" 
                            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-md font-semibold transition-colors duration-200 relative group"
                        >
                            Ruta Estática
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link 
                            href="/pages/profile" 
                            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-md font-semibold transition-colors duration-200 relative group"
                        >
                            Perfil
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link 
                            href="/BBDD/server" 
                            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-md font-semibold transition-colors duration-200 relative group"
                        >
                            Server
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link 
                            href="/BBDD/client" 
                            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-md font-semibold transition-colors duration-200 relative group"
                        >
                            Client
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link 
                            href="/pages/useClient" 
                            className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-md font-semibold transition-colors duration-200 relative group"
                        >
                            UseClient
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </nav>
                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button className="text-white hover:text-gray-200 focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}