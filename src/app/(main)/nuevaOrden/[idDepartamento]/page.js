"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function NuevaOrden() {
  const router = useRouter();
  const params = useParams();
  const departmentId = params?.idDepartamento;

  const [proveedores, setProveedores] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [formData, setFormData] = useState({
    codigo: "",
    comentario: "",
    descripciones: [
      { articulo: "", fungible: false, inventariable: false, unidades: "" },
    ],
    factura: null,
    proveedor: "",
    fecha: "",
    inversion: false,
    importeTotal: "",
  });
  const [modalCIFVisible, setModalCIFVisible] = useState(false);
  const [modalNuevoProvVisible, setModalNuevoProvVisible] = useState(false);
  const [cifInput, setCifInput] = useState("");
  const [nuevoProvData, setNuevoProvData] = useState({
    cif: "",
    nombre: "",
    direccion: "",
    telefono: "",
    contacto: "",
  });

  useEffect(() => {
    console.log("Params:", params);
    if (!departmentId) return;

    const fetchProveedores = async () => {
      try {
        const res = await fetch(
          `/api/proveedores?idDepartamento=${departmentId}`
        );
        if (!res.ok) throw new Error("Error al obtener los proveedores");
        const data = await res.json();
        setProveedores(data);
      } catch (err) {
        console.error("Error al obtener proveedores:", err);
      }
    };

    fetchProveedores();
  }, [departmentId]);

  const handleAddProveedor = () => {
    setCifInput("");
    setModalCIFVisible(true);
  };

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      descripciones: [
        ...prev.descripciones,
        { articulo: "", fungible: false, inventariable: false, unidades: "" },
      ],
    }));
  };

  const handleDeleteRow = () => {
    setFormData((prev) => ({
      ...prev,
      descripciones:
        prev.descripciones.length > 1
          ? prev.descripciones.slice(0, -1)
          : prev.descripciones,
    }));
  };

  const handleDescriptionChange = (index, field, value) => {
    const newDescripciones = [...formData.descripciones];
    newDescripciones[index] = {
      ...newDescripciones[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      descripciones: newDescripciones,
    }));
  };

  const comprobarProveedor = async () => {
    if (!cifInput.trim()) return alert("Introduce un CIF válido");
    console.log(cifInput);
    try {
      const res = await fetch("/api/asignarProv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cif: cifInput, departamento_id: departmentId  }),
      });
      const data = await res.json();

      if (data.existe) {
        alert("Proveedor asignado correctamente");
        setFormData((prev) => ({ ...prev, proveedor: cifInput }));
        setModalCIFVisible(false);
        // Refrescar proveedores para actualizar select
        const res2 = await fetch(
          `/api/proveedores?idDepartamento=${departmentId}`
        );
        const data2 = await res2.json();
        setProveedores(data2);
      } else {
        // No existe, abrir modal nuevo proveedor
        setNuevoProvData({
          cif: cifInput,
          nombre: "",
          direccion: "",
          telefono: "",
          contacto: "",
        });
        setModalCIFVisible(false);
        setModalNuevoProvVisible(true);
      }
    } catch (err) {
      console.error("Error en comprobación de proveedor:", err);
      alert("Error al comprobar proveedor");
    }
  };

  const crearYAsignarProveedor = async () => {
    const { cif, nombre, direccion, telefono, contacto } = nuevoProvData;
    if (!cif || !nombre) return alert("CIF y Nombre son obligatorios");

    try {
      alert("Introduce los datos del nuevo Proveeedor");
      const res = await fetch("/api/crearProv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nuevoProvData, departamento_id: departmentId }),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Proveedor creado y asignado");
        setFormData((prev) => ({ ...prev, proveedor: cif }));
        setModalNuevoProvVisible(false);

        // Actualizar lista de proveedores
        const res2 = await fetch(
          `/api/proveedores?idDepartamento=${departmentId}`
        );
        const data2 = await res2.json();
        setProveedores(data2);
      } else {
        alert(data.error || "Error creando proveedor");
      }
    } catch (err) {
      console.error("Error al crear proveedor:", err);
      alert("Error creando proveedor");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.codigo ||
      !formData.proveedor ||
      !formData.fecha ||
      !formData.importeTotal
    ) {
      console.error("Los datos enviados no son válidos.");
      alert("Por favor rellene todos los campos obligatorios.");
      return;
    }

    const isDescriptionsValid = formData.descripciones.every(
      (desc) => desc.articulo && desc.unidades
    );
    if (!isDescriptionsValid) {
      console.error("Las descripciones están incompletas.");
      alert("Por favor complete todas las descripciones.");
      return;
    }

    const dataToSend = {
      codigo: formData.codigo,
      comentario: formData.comentario,
      proveedor: formData.proveedor,
      fecha: formData.fecha,
      inversion: formData.inversion,
      importeTotal: formData.importeTotal,
      descripciones: formData.descripciones,
    };

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(dataToSend));

    if (formData.factura) {
      formDataToSend.append("factura", formData.factura);
    }

    try {
      const res = await fetch(`/api/meterOrden/${departmentId}`, {
        method: "POST",
        body: formDataToSend,
      });

      const contentType = res.headers.get("content-type");

      if (!res.ok) {
        let errorText;

        if (contentType && contentType.includes("application/json")) {
          const errorJson = await res.json();
          errorText = errorJson.message || JSON.stringify(errorJson);
        } else {
          errorText = await res.text();
        }

        console.error("Error del backend:", errorText);
        throw new Error("Error al guardar la orden: " + errorText);
      }

      const result = await res.json();
      console.log("Orden creada:", result.message);
      router.push(`/pagina2/${departmentId}`);
    } catch (error) {
      console.error("Error en el envío:", error.message || error);
      alert("Error al enviar la orden. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="h-full mb-10 mt-10 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-6">Nueva Orden de Compra</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Código y botón de búsqueda */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Código Autogenerado:
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({ ...formData, codigo: e.target.value })
                }
              />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <button
                type="button"
                className={`p-2 ${viewMode === "grid" ? "bg-gray-200" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Buscar"
              >
                🔍
              </button>
            </div>
          </div>

          {/* Comentario */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Comentario:</label>
            <textarea
              className="w-full p-2 border rounded h-24"
              value={formData.comentario}
              onChange={(e) =>
                setFormData({ ...formData, comentario: e.target.value })
              }
              placeholder="Introduzca un comentario..."
            />
          </div>

          {/* Tabla Descripciones */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium mb-2">Descripción:</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-10 h-10 text-xl"
                  onClick={handleAddRow}
                  title="Añadir fila"
                  aria-label="Añadir fila"
                >
                  ➕
                </button>
                <button
                  type="button"
                  className="w-10 h-10 text-xl"
                  onClick={handleDeleteRow}
                  title="Eliminar última fila"
                  aria-label="Eliminar última fila"
                >
                  ❌
                </button>
              </div>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#fbdada]">
                  <th className="border border-[#cdbabb] px-2 py-1">Artículo</th>
                  <th className="border border-[#cdbabb] px-2 py-1">Fungible</th>
                  <th className="border border-[#cdbabb] px-2 py-1">Inventariable</th>
                  <th className="border border-[#cdbabb] px-2 py-1">Unidades</th>
                </tr>
              </thead>
              <tbody>
                {formData.descripciones.map((desc, index) => (
                  <tr key={index}>
                    <td className="border border-[#cdbabb] px-2 py-1">
                      <input
                        type="text"
                        className="w-full p-1 border rounded"
                        value={desc.articulo}
                        onChange={(e) =>
                          handleDescriptionChange(index, "articulo", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-[#cdbabb] px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={desc.fungible}
                        onChange={(e) =>
                          handleDescriptionChange(index, "fungible", e.target.checked)
                        }
                      />
                    </td>
                    <td className="border border-[#cdbabb] px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={desc.inventariable}
                        onChange={(e) =>
                          handleDescriptionChange(index, "inventariable", e.target.checked)
                        }
                      />
                    </td>
                    <td className="border border-[#cdbabb] px-2 py-1 text-center">
                      <input
                        type="number"
                        min="0"
                        className="w-20 p-1 border rounded text-center"
                        value={desc.unidades}
                        onChange={(e) =>
                        handleDescriptionChange(index, "unidades", e.target.value)
                        }
                        />
                        </td>
                        </tr>
                        ))}
                        </tbody>
                        </table>
                        </div>      {/* Factura */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Factura:</label>
        <label
          htmlFor="factura-file"
          className="cursor-pointer px-4 py-2 bg-[#fbdada] rounded hover:bg-[#cdbabb] inline-block"
        >
          Selecciona archivo
        </label>
        <input
              id="factura-file"
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) =>
                setFormData({ ...formData, factura: e.target.files[0] || null })
              }
            />
            {formData.factura && (
              <p className="mt-1 text-sm text-gray-700">
                Archivo seleccionado: {formData.factura.name}
              </p>
            )}
          </div>

      {/* Proveedor y botón para añadir */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Proveedor:</label>
        <div className="flex gap-2 items-center">
          <select
            className="flex-1 p-2 border rounded"
            value={formData.proveedor}
            onChange={(e) =>
              setFormData({ ...formData, proveedor: e.target.value })
            }
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores
              .filter((prov) => prov.CIF) // aseguramos que haya cif definido
              .map((prov, idx) => (
                <option key={prov.CIF ?? idx} value={prov.CIF}>
                  {prov.nombre}
                </option>
              ))}

          </select>
          <button
            type="button"
            onClick={handleAddProveedor}
            className="px-3 py-1 bg-[#e41b23] text-white rounded hover:bg-red-900"
            aria-label="Añadir proveedor"
            title="Añadir proveedor"
          >
            +
          </button>
        </div>
      </div>

      {/* Fecha */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Fecha:</label>
        <input
          type="date"
          className="p-2 border rounded"
          value={formData.fecha}
          onChange={(e) =>
            setFormData({ ...formData, fecha: e.target.value })
          }
        />
      </div>

      {/* Inversión */}
      <div className="mb-4 flex items-center gap-2">
        <input
          id="inversion"
          type="checkbox"
          checked={formData.inversion}
          onChange={(e) =>
            setFormData({ ...formData, inversion: e.target.checked })
          }
        />
        <label htmlFor="inversion" className="select-none">
          Inversión
        </label>
      </div>

      {/* Importe total */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Importe Total:</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full p-2 border rounded"
          value={formData.importeTotal}
          onChange={(e) =>
            setFormData({ ...formData, importeTotal: e.target.value })
          }
        />
      </div>

      {/* Botón Enviar */}
      <button
        type="submit"
        className="w-full py-2 bg-[#e41b23] text-white font-semibold rounded hover:bg-red-900"
      >
        Guardar
      </button>
    </form>
  </div>

  {/* Modal para introducir CIF */}
  {modalCIFVisible && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Introducir CIF del proveedor</h2>
        <input
          type="text"
          value={cifInput}
          onChange={(e) => setCifInput(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Ejemplo: B12345678"
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setModalCIFVisible(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={comprobarProveedor}
            className="px-4 py-2 bg-[#e41b23] text-white rounded hover:bg-red-900"
          >
            Comprobar
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Modal para nuevo proveedor */}
  {modalNuevoProvVisible && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-auto">
      <div className="bg-white p-6 rounded shadow max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Nuevo Proveedor</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            crearYAsignarProveedor();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">CIF:</label>
            <input
              type="text"
              value={nuevoProvData.cif}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nombre:</label>
            <input
              type="text"
              required
              value={nuevoProvData.nombre}
              onChange={(e) =>
                setNuevoProvData((prev) => ({ ...prev, nombre: e.target.value }))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dirección:</label>
            <input
              type="text"
              value={nuevoProvData.direccion}
              onChange={(e) =>
                setNuevoProvData((prev) => ({ ...prev, direccion: e.target.value }))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono:</label>
            <input
              type="text"
              value={nuevoProvData.telefono}
              onChange={(e) =>
                setNuevoProvData((prev) => ({ ...prev, telefono: e.target.value }))
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contacto:</label>
            <input
              type="text"
              value={nuevoProvData.contacto}
              onChange={(e) =>
                setNuevoProvData((prev) => ({ ...prev, contacto: e.target.value }))
              }
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setModalNuevoProvVisible(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#e41b23] text-white rounded hover:bg-red-900"
            >
              Crear y asignar
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
);
}
