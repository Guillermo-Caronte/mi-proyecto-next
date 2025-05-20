"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import OrdenesTable from "../../../components/lists/ordenesTable";
import Button from "../../../components/buttons/filtrar";
import Button2 from "../../../components/buttons/añadir";
import Link from 'next/link';
import Input from "../../../components/inputs/inputLista";
import Image from "next/image";

export default function OrdenesDeCompra() {
  const params = useParams();
  const router = useRouter();
  const departmentId = params?.idDepartamento;

  const [filterInput, setFilterInput] = useState('');
  const [filters, setFilters] = useState([]);
  const [capsulesData, setCapsulesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const filtro = searchParams.get('filtro');

  // Agregar nuevo filtro
  const handleAddFilter = () => {
    const trimmedInput = filterInput.trim();
    if (trimmedInput && !filters.includes(trimmedInput)) {
      setFilters([...filters, trimmedInput]);
      setFilterInput('');
    }
  };

  // Eliminar un filtro
  const handleRemoveFilter = (filterToRemove) => {
    setFilters(filters.filter((f) => f !== filterToRemove));
  };

  // Lógica de filtrado
  const filterData = (data) => {
    return data.filter((orden) => {
      return filters.every((term) => {
        const lower = term.toLowerCase();
        return (
          orden.id.toLowerCase().includes(lower) ||
          orden.comment.toLowerCase().includes(lower) ||
          orden.proveedor.toLowerCase().includes(lower) ||
          orden.date.toLowerCase().includes(lower) ||
          orden.price.toString().toLowerCase().includes(lower) ||
          (orden.tipo?.toLowerCase() || '').includes(lower)
        );
      });
    });
  };

  // Fetch de datos
  useEffect(() => {
    if (!departmentId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/ordenInfo?idDepartamento=${departmentId}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data = await res.json();
        const formattedData = data.map((orden) => ({
          id: orden.Número_de_Compra,
          comment: orden.Comentario,
          factura: orden.Factura,
          proveedor: orden.Proveedor,
          date: orden.Fecha,
          price: orden.Precio,
          tipo: orden.Tipo || '',
        }));

        setCapsulesData(formattedData);
        setFilteredData(filterData(formattedData));
        setError(null);
      } catch (error) {
        setError(error.message);
        console.error("Error al obtener los datos del departamento:", error);
      }
    };

    fetchData();
  }, [departmentId]);

  // Aplicar filtros cada vez que cambian
  useEffect(() => {
    const result = filterData(capsulesData);
    setFilteredData(result);
  }, [filters, capsulesData]);

  // Leer filtro desde la URL (solo 1 vez o cuando cambia)
  useEffect(() => {
    if (filtro) {
      setFilters([filtro]);
    }
  }, [filtro]);

  return (
    <div className="h-full flex flex-col">
      {/* Encabezado */}
      <div className="mb-4 mt-20 ml-67">
        <h2 className="text-2xl font-semibold">Órdenes de Compra</h2>
      </div>

      {/* Mostrar error */}
      {error && (
        <div className="text-red-500 text-center mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Filtros y botón agregar */}
      <div className="flex items-center gap-203 mb-4 ml-67">
        <div className="flex items-center gap-2">
        <Input
          placeholder="Busca etiquetas..."
          value={filterInput}
          onChange={(e) => setFilterInput(e.target.value)}
        />
        <Button onClick={handleAddFilter} className="flex items-center gap-2">
          <Image src="/images/filtro.png" alt="foto" width={30} height={10} />
          Filtrar
        </Button>
        </div>
        <Link href={`/nuevaOrden/${departmentId}`}>
          <Button2 className="flex items-center gap-2 hover:bg-red-100 rounded-full">
            <Image src="/images/añadir.jpg" alt="Agregar Orden" width={24} height={24} className="hover:bg-red-100 align-middle"/>
          </Button2>
        </Link>
      </div>

      {/* Filtros activos */}
      <div className="flex gap-2 flex-wrap ml-67 mb-4">
        {filters.map((filtro, index) => (
          <div key={index} className="flex items-center bg-red-100 px-3 py-1 rounded-full">
            <span className="text-sm">{filtro}</span>
            <button
              onClick={() => handleRemoveFilter(filtro)}
              className="ml-2 text-gray-600 hover:text-gray-800"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-auto ml-67">
        <OrdenesTable data={filteredData} idDepartamento={departmentId} />
      </div>
    </div>
  );
}
