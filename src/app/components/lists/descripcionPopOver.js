"use client";
import * as Popover from "@radix-ui/react-popover";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

export default function DescripcionPopover({ numeroCompra }) {
  const [detalles, setDetalles] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchDetalles = async () => {
      try {
        const res = await fetch(`/api/descripciones/${numeroCompra}`);
        if (!res.ok) throw new Error("Error al obtener detalles");
        const data = await res.json();
        setDetalles(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchDetalles();
  }, [open, numeroCompra]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button className="flex items-center text-sm text-gray-700 hover:bg-gray-100 w-full py-1 gap-4 mr-4">
          <Info className="w-4 h-4 " />
          Ver Descripción
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="bg-white shadow-lg border border-gray-300 rounded-md p-4 w-[400px] text-sm z-50"
          side="right"
          align="start"
        >
          <h4 className="text-sm font-semibold mb-2">Descripción de Compra</h4>
          <div className="grid grid-cols-2 gap-2">
            {detalles.length === 0 ? (
              <p className="text-gray-500">Cargando...</p>
            ) : (
              detalles.map((item, i) => (
                <div key={i}>
                  <p className="font-medium">
                    {i + 1}. {item.nombre} ({item.fungible ? "FU" : "IN"})
                  </p>
                  <p className="text-gray-600 text-xs ml-4">
                    • Cantidad: {item.cantidad}
                  </p>
                </div>
              ))
            )}
          </div>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
