import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center">

      <div className="container mx-auto px-4 z-10 text-center">
        <div className="mb-8">
          <Image
            src="/images/logo-salesianos.png"
            alt="Logo Salesianos"
            width={200}
            height={200}
            className="mx-auto"
            priority
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-[#db001b] mb-6 animate-fade-in">
          Salesianos
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto animate-fade-in">
          Formando jóvenes con valores, fe y excelencia académica
        </p>
        <div className="animate-fade-in">
          <Link 
            href="/contacto"
            className="bg-[#db001b] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#b30017] transition-colors"
          >
            Conócenos
          </Link>
        </div>
      </div>
    </section>
  );
} 