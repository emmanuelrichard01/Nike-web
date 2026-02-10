import { prisma } from "@nike/database";
import { HeroSection } from "@/components/home/hero-section";
import { TrendingSection } from "@/components/home/trending-section";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nike/ui";
import { Marquee } from "@/components/home/marquee";
import { ArrowRight, Star, Zap, ShoppingBag } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const newReleasesData = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { category: true, variants: true }
  }).catch((error) => {
    console.error("Failed to fetch new releases:", error);
    return [];
  });

  const newReleases = newReleasesData.map(p => ({
    ...p,
    price: p.price.toNumber()
  }));

  const trendingData = await prisma.product.findMany({
    take: 8,
    skip: 0,
    include: { category: true, variants: true }
  }).catch((error) => {
    console.error("Failed to fetch trending products:", error);
    return [];
  });

  const trending = trendingData.map(p => ({
    ...p,
    price: p.price.toNumber()
  }));

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />

      <Marquee />

      {/* New Arrivals Section */}
      <TrendingSection
        title="New Arrivals"
        subtitle="Fresh drops just landed. Be the first to rock the latest."
        products={newReleases}
        accentColor="#c0ff00"
        variant="default"
      />

      {/* Featured Campaign - Premium Hero Banner */}
      <section className="py-4 px-4 md:px-12">
        <div className="relative rounded-3xl overflow-hidden bg-black min-h-[550px] md:min-h-[650px] flex items-center group">
          {/* Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2000&auto=format&fit=crop"
            alt="Nike Pegasus"
            fill
            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2s] ease-out"
            sizes="100vw"
            priority
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-16 w-full max-w-2xl transform transition-transform duration-700 group-hover:translate-x-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c0ff00] rounded-full mb-6 shadow-[0_0_20px_rgba(192,255,0,0.3)] animate-pulse-slow">
              <Zap className="w-4 h-4 text-black fill-black" />
              <span className="text-sm font-bold text-black uppercase tracking-wider">Featured Drop</span>
            </div>

            {/* Title with Split Typography */}
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-2 leading-[0.9] tracking-tighter drop-shadow-2xl">
              Pegasus
            </h2>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tighter drop-shadow-2xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0ff00] to-[#90ff00]">
                41
              </span>
            </h2>

            {/* Description */}
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-md leading-relaxed font-medium drop-shadow-md">
              Responsive satisfies. ReactX foam technology delivers more energy return for your everyday miles.
            </p>

            {/* Stats Row */}
            <div className="flex gap-8 mb-10 backdrop-blur-sm bg-white/5 p-4 rounded-xl border border-white/10 w-fit">
              <div>
                <p className="text-3xl font-bold text-[#c0ff00]">+13%</p>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Energy Return</p>
              </div>
              <div className="w-px bg-white/10 h-10" />
              <div>
                <p className="text-3xl font-bold text-white">285g</p>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Lightweight</p>
              </div>
              <div className="w-px bg-white/10 h-10" />
              <div>
                <p className="text-3xl font-bold text-white">4.8</p>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#c0ff00] text-[#c0ff00]" /> Rating
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button
                className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-14 font-bold text-base transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                asChild
              >
                <Link href="/products/nike-pegasus-41" className="flex items-center gap-2">
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-14 font-bold text-base backdrop-blur-md hover:border-white/60 transition-all"
                asChild
              >
                <Link href="/products?category=running">Explore Running</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now Section - Dark Variant */}
      <TrendingSection
        title="Trending Now"
        subtitle="What everyone's wearing. Icons that never go out of style."
        products={trending}
        accentColor="#ff4d4d"
        variant="dark"
      />

      {/* Shop by Category - Modern Bento Grid */}
      <section className="py-20 md:py-24 px-4 md:px-12 bg-[#fafafa]">
        <div className="container-nike">
          {/* Section Header */}
          <div className="mb-12 flex items-end justify-between">
            <div>
              <div className="w-12 h-1.5 bg-black rounded-full mb-4" />
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">Shop by Category</h2>
              <p className="text-black/50 text-xl font-medium">Find your perfect fit.</p>
            </div>
          </div>

          {/* Bento Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[1200px] md:h-[600px]">

            {/* 1. LIFESTYLE (Large, 2x2) */}
            <Link
              href="/products?category=lifestyle"
              className="group md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden bg-black"
            >
              <Image
                src="https://images.unsplash.com/photo-1605348532760-6753d6c43329?q=80&w=1200&auto=format&fit=crop"
                alt="Lifestyle"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 w-fit">
                  Most Popular
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-white mb-2">Lifestyle</h3>
                <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Shop Collection <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>

            {/* 2. RUNNING (Tall, 1x2) */}
            <Link
              href="/products?category=running"
              className="group md:col-span-1 md:row-span-2 relative rounded-3xl overflow-hidden bg-black"
            >
              <Image
                src="https://images.unsplash.com/photo-1547483238-f400e65ccd56?q=80&w=800&auto=format&fit=crop"
                alt="Running"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-6">
                <h3 className="text-3xl font-black text-white mb-2">Running</h3>
                <div className="flex items-center gap-2 text-white font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Shop <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* 3. BASKETBALL (Standard, 1x1) */}
            <Link
              href="/products?category=basketball"
              className="group relative rounded-3xl overflow-hidden bg-black"
            >
              <Image
                src="https://images.unsplash.com/photo-1560021650-dc12d627b003?q=80&w=800&auto=format&fit=crop"
                alt="Basketball"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-black text-white">Basketball</h3>
              </div>
            </Link>

            {/* 4. TRAINING (Standard, 1x1) */}
            <Link
              href="/products?category=training"
              className="group relative rounded-3xl overflow-hidden bg-black"
            >
              <Image
                src="https://images.unsplash.com/photo-1517466787929-bc9095c70751?q=80&w=800&auto=format&fit=crop"
                alt="Training"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-black text-white">Training</h3>
              </div>
            </Link>

          </div>

          {/* Secondary Row (Soccer, Sandals) - Only visible if expanded or keep it clean 
               Let's stop at the bento grid above, 4 main categories is cleaner. 
               The user asked to "enhance", cleaner is better.
           */}
        </div>
      </section>

      {/* Don't Miss Section (Replaces Membership) */}
      <section className="py-20 px-4 md:px-12">
        <div className="container-nike">
          <div className="mb-10 flex items-center gap-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Don't Miss</h2>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-[#111] h-[600px] flex items-end p-8 md:p-16 group">
            <Image
              src="https://images.unsplash.com/photo-1628413993904-94ecb60d61ea?q=80&w=2000&auto=format&fit=crop"
              alt="Don't Miss"
              fill
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-[1.5s]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            <div className="relative z-10 w-full max-w-3xl">
              <p className="text-white font-medium mb-4 text-lg">Nike Tech Fleece</p>
              <h3 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
                ENGINEERED <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">TO MOVE.</span>
              </h3>

              <div className="flex gap-4">
                <Button className="rounded-full bg-white text-black hover:bg-white/90 font-bold h-12 px-8" asChild>
                  <Link href="/products">Shop the Collection</Link>
                </Button>
                <Button variant="outline" className="rounded-full border-white text-white hover:bg-white/10 font-bold h-12 px-8" asChild>
                  <Link href="/products?category=lifestyle">Explore Tech Fleece</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
