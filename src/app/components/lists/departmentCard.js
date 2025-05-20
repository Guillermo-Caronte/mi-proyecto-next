import React from "react";

export default function DepartmentCard({
  name,
  head,
  investment,
  budget,
  expenses,
}) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md bg-white min-h-[220px] flex flex-col">
      <div className="bg-red-600 text-white p-4 flex items-center justify-between text-lg font-bold">
        <span>{` Departamento de ${name}`}</span>
      </div>
      <div className="flex-1 p-4 bg-red-100 text-sm text-gray-800 space-y-2 rounded-b-2xl">
        <p>
          <strong>JEFE DE DEPARTAMENTO:</strong> {head}
        </p>
        {investment && (
          <>
            <p>
              <strong>INVERSIÓN:</strong> {investment}
            </p>
            <p>
              <strong>PRESUPUESTO:</strong> {budget}
            </p>
            <p>
              <strong>GASTOS:</strong> {expenses}
            </p>
          </>
        )}
      </div>
    </div>
  );
}