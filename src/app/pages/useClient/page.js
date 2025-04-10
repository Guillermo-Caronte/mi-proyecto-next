'use client';

import { useState } from 'react';

export default function Contador() {
  const [contador, setContador] = useState(0);


  const incrementar = () => {
    setContador(contador + 1);
  };

  const decrementar = () => {
    setContador(contador - 1);
  };

  const reiniciar = () => {
    setContador(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Contador Simple</h1>
      
      <div className="text-5xl font-bold mb-8">{contador}</div>
      
      <div className="flex space-x-4">
        <button 
          onClick={decrementar}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          -
        </button>
        
        <button 
          onClick={reiniciar}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Reiniciar
        </button>
        
        <button 
          onClick={incrementar}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
