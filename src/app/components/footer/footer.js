import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 bg-[#db001b] text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-8">¿Listo para ser parte de nuestra familia?</h2>
        <p className="text-xl mb-12 max-w-2xl mx-auto">
          Únete a nuestra comunidad educativa y descubre el poder de una educación basada en valores
        </p>
        <Link
          href="/admisiones"
          className="bg-white text-[#db001b] px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-50 transition-colors"
        >
          Solicitar Admisión
        </Link>
      </div>
    </section>
  );
} 