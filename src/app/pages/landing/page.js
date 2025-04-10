
import Hero from '@/app/components/landing/hero';
import Features from '@/app/components/landing/features';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Hero />
      <Features />
    </div>
  );
}
