"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; // para App Router
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, BarController, BarElement } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, BarController, BarElement);

export default function Gestion() {
  const params = useParams();
  const departmentId = params?.idDepartamento;
  const [departmentTitle, setDepartmentTitle] = useState('');
  const [capsulesData, setCapsulesData] = useState([]);
  const [error, setError] = useState(null);
  const [lineChartData, setLineChartData] = useState([]);
  const [tablaGastos, setTablaGastos] = useState([]); // Ensure it's initialized as an empty array

  useEffect(() => {
    if (!departmentId) return; // Si no hay ID, no hacemos nada

    const fetchDepartmentData = async () => {
      try {
        const res = await fetch(`/api/departmentInfo?idDepartamento=${departmentId}`);
    
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
    
        const data = await res.json();
        console.log("Department Data: ", data);

        // Actualiza el estado con los datos obtenidos de la API
        setDepartmentTitle(data.nombreDepartamento);
        setCapsulesData([
          { titulo: 'Presupuesto', valor: `${data.total_presupuesto} €`},
          { titulo: 'Gastos Presupuesto', valor: <span style={{ color: data.gastos_presupuesto > 0 ? 'red' : 'black'}}>{data.gastos_presupuesto ? `-${data.gastos_presupuesto} €` : 'Sin gastos'}</span> || "No hay gastos", gastos: `Ver gastos`},
          { titulo: 'Disponible Presupuesto', valor: <span style={{ color: data.disponible_inversion < 0 ? 'red' : 'green' }}>{`${data.disponible_presupuesto} €`}</span>},
          { titulo: 'Inversión', valor: `${data.total_inversion} € `},
          { titulo: 'Gastos Inversión',valor: <span style={{ color: data.gastos_inversion > 0? 'red' : 'black'}}>{data.gastos_inversion ? `-${data.gastos_inversion} €` : 'Sin gastos'}</span> || "No hay gastos", gastos: `Ver gastos` },
          { titulo: 'Disponible Inversión', valor: <span style={{ color: data.disponible_inversion < 0 ? 'red' : 'green' }}>{`${data.disponible_inversion} €`}</span>},
        ]);
        
        setLineChartData(data.lineChartData);

        setTablaGastos(data.gastosRecientes);
        console.log("Tabla de gastos:", data.gastosRecientes);
      } catch (error) {
        setError(error.message);
        console.error("Error al obtener los datos del departamento:", error);
      }
    };

    fetchDepartmentData();

  }, [departmentId]);

  useEffect(() => {
      if (!lineChartData || lineChartData.length === 0) return;
    
      const destroyAndCreateChart = (canvasId, chartType, chartData, chartOptions) => {
        const existingChart = Chart.getChart(canvasId);
        if (existingChart) existingChart.destroy();
    
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (ctx) {
          new Chart(ctx, {
            type: chartType,
            data: chartData,
            options: chartOptions,
          });
        }
      };
    
      const valoresMensuales = Array(12).fill(0);

      // Rellenamos los valores reales según el mes
      lineChartData.forEach(item => {
        valoresMensuales[item.mes - 1] = item.valor;
      });

      const lineData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
          label: 'Total (€)',
          data: valoresMensuales,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3,
        }],
      };
    
      const lineOptions = {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Fecha' } },
          y: { title: { display: true, text: 'Valor (€)' }, beginAtZero: true },
        },
      };
    
      destroyAndCreateChart('lineChart', 'line', lineData, lineOptions);
    
    }, [lineChartData]);
    
  useEffect(() => {
    document.body.style.margin = '50px 0'; // Margen superior e inferior para header y footer
    return () => {
      document.body.style.margin = '0'; // Restaurar margen al desmontar el componente
    };
  }, []);

  useEffect(() => {
    const adjustBodyMargin = () => {
      const footerHeight = document.querySelector('footer')?.offsetHeight || 0;
      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      document.body.style.marginBottom = `${footerHeight}px`;
      document.body.style.marginTop = `${headerHeight}px`;
    };

    adjustBodyMargin();
    window.addEventListener('resize', adjustBodyMargin);

    return () => {
      window.removeEventListener('resize', adjustBodyMargin);
      document.body.style.margin = '0'; // Restaurar margen al desmontar el componente
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Eliminar barra de desplazamiento
    return () => {
      document.body.style.overflow = ''; // Restaurar overflow al desmontar el componente
    };
  }, []);
  console.log(  "Tabla de gastos:", tablaGastos);

  if (error) return <div>Error: {error}</div>;

  return (
    <div
      style={{
        padding: '20px',
        fontWeight: 'inherit',
        marginLeft: '250px',
        marginTop: ' 57px', // Espacio adicional arriba para evitar interferencia con el header
        overflowY: 'auto',
        maxHeight: '665px', // Fixed height value with 'px'
      }}
    >
      <div>
        <h1 style={{ textAlign: 'left', marginLeft: '4px', marginBottom: '13px', fontSize: '17px', fontWeight: 'bold' }}>Departamento de {departmentTitle}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', textAlign: 'left' }}>
          {capsulesData.map((capsula, index) => ( 
            <div
              key={index}
              style={{
                flex: '1 1 calc(30% - 15px)',
                minWidth: '150px',
                backgroundColor: '#f8f9fa',
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                textAlign: 'left',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                position: 'relative',
              }}
            >
              <h4 style={{ marginBottom: '10px' }}>{capsula.titulo}</h4>
              <p style={{ color: 'black', fontSize: '40px', fontWeight: 'bold' }}>{capsula.valor}</p>
              {capsula.gastos && (
                <Link
                href={`/pagina2/${departmentId}?filtro=${encodeURIComponent(capsula.titulo.includes('Inversión') ? 'Inversión' : 'Presupuesto')}`}
                style={{
                  color: 'grey',
                  fontSize: '13px',
                  position: 'absolute',
                  bottom: '10px',
                  right: '15px',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                {capsula.gastos}
              </Link>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', marginTop: '20px', gap: '15px' }}>
          <div
            style={{
              flex: '1 1 50%',
              minWidth: '300px',
              backgroundColor: '#f8f9fa',
              border: '2px solid #ddd',
              borderRadius: '8px',
              padding: '12px', // Reduced padding to decrease space
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2 style={{ padding:'2px',fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>Gastos del mes</h2>
            <canvas id="lineChart" width="200" height="83"></canvas>
          </div>

          <div
            style={{
              flex: '1 1 50%',
              minWidth: '300px',
              backgroundColor: '#f8f9fa',
              border: '2px solid #ddd',
              borderRadius: '8px',
              padding: '12px', // Reduced padding to decrease space
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '13px', marginTop: '2px', marginRight: '10px' }}> 
              <h2 style={{ fontWeight: 'bold', fontFamily: 'inherit', margin: 0 }}>Compras recientes</h2>
            </div>
            <table
              border="1"
              style={{
                width: '100%',
                textAlign: 'left',
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd', color: 'gray' }}>
                  <th>Procedencia</th>
                  <th>Costo</th>
                  <th>Resto</th>
                </tr>
              </thead>
              <tbody>
                {tablaGastos?.length > 0 ? tablaGastos.map((gasto, index) => (
                  <tr key={index} style={{ borderBottom: '2px solid #ddd', height: '40px', backgroundColor: '#f8f9fa' }}>
                    <td>{gasto.procedencia || 'Desconocido'}</td>
                    <td>{gasto.precio?.toFixed(2)} €</td>
                    <td>{gasto.resto || '-'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: 'gray' }}>No hay datos disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  </div>
);
}