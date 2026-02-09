import { prisma } from "@nike/database";
import { HeroSection } from "@/components/home/hero-section";
import { TrendingSection } from "@/components/home/trending-section";
import Link from "next/link";
import { Button } from "@nike/ui";
import { Marquee } from "@/components/home/marquee";

// Mock Marquee removed

export default async function Home() {
  const newReleases = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { category: true, variants: true }
  });

  const trending = await prisma.product.findMany({
    take: 8,
    skip: 0,
    include: { category: true, variants: true } // Removed 'skip' logic that might be problematic if few items
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection />

      <Marquee />

      <TrendingSection title="New Arrivals" products={newReleases} />

      {/* Campaign Module */}
      <section className="py-20 px-4 md:px-0">
        <div className="container-nike relative rounded-card overflow-hidden bg-black text-white min-h-[600px] flex items-center justify-center text-center">
          <div className="absolute inset-0 z-0">
            {/* Image Background */}
            <div className="w-full h-full bg-gradient-to-t from-black via-transparent to-transparent z-10 absolute inset-0" />
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1556906781-9a412961d28c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay" />
          </div>

          <div className="relative z-20 max-w-4xl px-8 flex flex-col items-center">
            <span className="text-accent font-bold uppercase tracking-[0.2em] mb-4 block animate-fade-in drop-shadow-md">Just Dropped</span>
            <h2 className="text-display-xl md:text-display-2xl font-black uppercase leading-[0.8] mb-6 tracking-tighter drop-shadow-lg">
              Run Past <br /> Gravity.
            </h2>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-md mx-auto drop-shadow-md font-medium">
              Engineered for speed. Designed for flight. The new Air Zoom Alphafly NEXT% 3 breaks every record.
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all rounded-full px-12 py-8 text-xl font-bold w-fit" asChild>
              <Link href="/products" className="flex items-center gap-2">
                Shop The Future
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <TrendingSection title="Trending Now" products={trending} />

      {/* Categories Grid */}
      <section className="py-20 container-nike">
        <h2 className="text-display-md font-bold uppercase mb-12 tracking-tight">Shop by Sport</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
          {/* Running */}
          <Link href="/products?category=running" className="group relative rounded-card overflow-hidden md:col-span-1 bg-gray-100 flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="relative z-20 p-8 w-full group-hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-4xl font-black uppercase text-white mb-4 drop-shadow-md">Running</h3>
              <Button variant="secondary" className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 text-black bg-white hover:bg-accent hover:text-black rounded-full font-bold px-8">Shop Now</Button>
            </div>
          </Link>
          {/* Basketball */}
          <Link href="/products?category=basketball" className="group relative rounded-card overflow-hidden md:col-span-1 bg-gray-200 flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="relative z-20 p-8 w-full group-hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-4xl font-black uppercase text-white mb-4 drop-shadow-md">Basketball</h3>
              <Button variant="secondary" className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 text-black bg-white hover:bg-accent hover:text-black rounded-full font-bold px-8">Shop Now</Button>
            </div>
          </Link>
          {/* Training */}
          <Link href="/products?category=training" className="group relative rounded-card overflow-hidden md:col-span-1 bg-gray-300 flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="relative z-20 p-8 w-full group-hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-4xl font-black uppercase text-white mb-4 drop-shadow-md">Training</h3>
              <Button variant="secondary" className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 text-black bg-white hover:bg-accent hover:text-black rounded-full font-bold px-8">Shop Now</Button>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
