export default function Page({ params }) {
    const slug = params.slug || "";
  
    return (
      <div>
        <h1>Ruta Dinámica</h1>
        <p>Esta es una ruta dinámica en Next.js</p>
        <div>
          <h2>Slug capturado:</h2>
          <p>{slug}</p>
        </div>
      </div>
    );
  }
  