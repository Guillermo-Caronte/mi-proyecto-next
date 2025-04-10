'use client';

import { useState } from 'react';

export default function Contador() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Contador</h1>
        <p className="mb-2">Has hecho clic <span className="font-bold">{count}</span> veces</p>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-1 bg-blue-500 text-white rounded"
        >
          Aumentar contador
        </button>
      </div>
    </div>
  );
}
