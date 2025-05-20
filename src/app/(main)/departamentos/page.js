'use client';  // Asegúrate de que este es un componente de cliente
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DepartmentCard from "../../components/lists/departmentCard";

export default function Home() {
  const [session, setSession] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Obtener la sesión del servidor
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/getSession", {
          method: "GET", // Método GET
          credentials: "include", // Asegúrate de incluir las credenciales (cookies)
        });
        if (!res.ok) throw new Error("Error al obtener la sesión");
        const data = await res.json();
        setSession(data);  // Guardamos la sesión
      } catch (err) {
        console.error(err);
        setError("Error al obtener sesión");
      }
    };

    fetchSession();
  }, []);

  // Obtener los departamentos solo si la sesión está disponible
  useEffect(() => {
    if (session) {
      const fetchDepartments = async () => {
        try {
          const res = await fetch("/api/getDepartments");
          if (!res.ok) throw new Error("Error al obtener los departamentos");
          const data = await res.json();
          setDepartments(data);
        } catch (err) {
          console.error(err);
          setError("Error al obtener los departamentos");
        } finally {
          setLoading(false);
        }
      };

      fetchDepartments();
    }
  }, [session]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;

  return (
    <main className="flex flex-col bg-gray-100 h-screen mt-10 max-h-170">
      <h1 className="text-3xl font-bold text-center p-4">DEPARTAMENTOS</h1>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {departments.map((dept, index) => (
            <div
              key={`${dept.idDepartamento}-${index}`}
              onClick={() => router.push(`/pagina1/${dept.idDepartamento}`)}
              className="cursor-pointer"
            >
              <DepartmentCard
                name={dept.departamento_nombre}
                head={`${dept.jefe_nombre_usuario} ${dept.jefe_apellido_usuario}`}
                budget={dept.dinero_bolsa_presupuesto +" €" || "0"}
                investment={dept.dinero_bolsa_inversion +" €" || "0"}
                expenses={- dept.total_facturas +" €" || "0"}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
