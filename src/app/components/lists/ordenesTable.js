"use client";
import { MoreVertical, Trash2 } from "lucide-react";
import Button from "../../components/buttons/filtrar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/menu/dropDown-menu";
import { useState } from "react";
import DescripcionPopover from "./descripcionPopOver";

const OrdenesTable = ({ data, idDepartamento }) => {
  const [openFacturaDropdown, setOpenFacturaDropdown] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const id = idDepartamento; 
  const toggleDropdown = (idx) => {
    setOpenDropdown(openDropdown === idx ? null : idx);
  };

  const toggleFacturaDropdown = (idx) => {
    setOpenFacturaDropdown(openFacturaDropdown === idx ? null : idx);
  };

  const handleDeleteOrden = async (orden) => {
    const confirmado = window.confirm("¿Estás seguro que quieres eliminar esta orden?");
    if (!confirmado) return;
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({
        codigo: orden.id,
        inversion: orden.inversion || false,
      }));

      const response = await fetch(`/api/deleteOrden/${orden.id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error al eliminar: ${error.error}`);
        return;
      }

      alert("Orden eliminada correctamente.");
      window.location.reload();

    } catch (error) {
      console.error("Error al eliminar la orden:", error);
      alert("Ocurrió un error al eliminar la orden.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin Fecha';
    const date = new Date(dateString);
    return isNaN(date) ? 'Fecha inválida' : date.toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto overflow-y-auto h-[500px] mr-5">
      <table className="min-w-full text-left">
        <thead className="bg-white sticky top-0 z-10 border-b-2 border-gray-800">
          <tr>
            <th className="p-1">Número de Compra</th>
            <th className="p-1">Comentario</th>
            <th className="p-1">Factura</th>
            <th className="p-1">Proveedor</th>
            <th className="p-1">Fecha</th>
            <th className="p-1">Precio</th>
            <th className="p-1">...</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, idx) => (
            <tr key={item.id} className="hover:bg-red-100 transition-colors">
              <td className="p-2 text-sm">{item.id}</td>
              <td className="p-2 text-sm">{item.comment}</td>
              <td className="p-2 text-sm relative">
                {Array.isArray(item.factura) ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFacturaDropdown(idx)}
                        className="flex items-center gap-2"
                      >
                        {item.factura[0] || 'Sin Factura'} ▼
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      open={openFacturaDropdown === idx}
                      onClose={() => setOpenFacturaDropdown(null)}
                      className="z-30 left-0 absolute mt-0 top-full"
                    >
                      {item.factura.map((fact, i) => (
                        <DropdownMenuItem key={i}>
                          {fact || 'Sin Factura'}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button size="sm" variant="outline" className="flex items-center gap-2 cursor-pointer">
                    {item.factura ? (
                      <a
                        href={item.factura}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver factura
                      </a>
                    ) : (
                      <span>Sin Factura</span>
                    )|| 'Sin Factura'}
                  </Button>
                )}
              </td>
              <td className="p-1 text-sm">{item.proveedor}</td>
              <td className="p-1 text-sm">{formatDate(item.date)}</td>
              <td className="p-1 text-sm">{item.price + " €"}</td>
              <td className="p-1 text-sm relative">
                <DropdownMenu>
                  <DropdownMenuTrigger onClick={() => toggleDropdown(idx)}>
                    <button className="hover:bg-red-200 p-2 rounded-full cursor-pointer">
                      <MoreVertical />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    open={openDropdown === idx}
                    onClose={() => setOpenDropdown(null)}
                    className="z-20 absolute ring-offset-fuchsia-50 right-0 top-0"
                  >
                    <DropdownMenuItem asChild>
                      <DescripcionPopover numeroCompra={item.id} />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteOrden(item)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar Orden de Compra
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdenesTable;
