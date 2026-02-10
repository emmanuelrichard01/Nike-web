import { prisma } from "@nike/database";
import { HeroSection } from "@/components/home/hero-section";
import { TrendingSection } from "@/components/home/trending-section";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nike/ui";
import { Marquee } from "@/components/home/marquee";
import { ArrowRight, Star, Zap, Shield } from "lucide-react";

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
        <div className="relative rounded-3xl overflow-hidden bg-black min-h-[550px] md:min-h-[650px] flex items-center">
          {/* Background Image */}
          <Image
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2000&auto=format&fit=crop"
            alt="Nike Pegasus"
            fill
            className="object-cover opacity-60"
            sizes="100vw"
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-16 w-full max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c0ff00] rounded-full mb-6">
              <Zap className="w-4 h-4 text-black" />
              <span className="text-sm font-bold text-black uppercase tracking-wider">Featured Drop</span>
            </div>

            {/* Title with Split Typography */}
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-2 leading-[0.9] tracking-tighter">
              Pegasus
            </h2>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.9] tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0ff00] to-[#90ff00]">
                41
              </span>
            </h2>

            {/* Description */}
            <p className="text-white/70 text-lg md:text-xl mb-8 max-w-md leading-relaxed">
              Responsive satisfies. ReactX foam technology delivers more energy return for your everyday miles.
            </p>

            {/* Stats Row */}
            <div className="flex gap-8 mb-10">
              <div>
                <p className="text-3xl font-bold text-[#c0ff00]">+13%</p>
                <p className="text-white/50 text-sm">Energy Return</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">285g</p>
                <p className="text-white/50 text-sm">Lightweight</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">4.8</p>
                <p className="text-white/50 text-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#c0ff00] text-[#c0ff00]" /> Rating
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button
                className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-14 font-bold text-base transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                asChild
              >
                <Link href="/products/nike-pegasus-41" className="flex items-center gap-2">
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-14 font-bold text-base backdrop-blur-md"
                asChild
              >
                <Link href="/products?category=running">Explore Running</Link>
              </Button>
            </div>
          </div>

          {/* Floating Price Tag */}
          <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2">
            <div className="glass-liquid-dark rounded-2xl p-6">
              <p className="text-white/50 text-sm mb-1">Starting at</p>
              <p className="text-4xl font-black text-white">$140</p>
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

      {/* Shop by Category - Modern Liquid Glass Cards */}
      <section className="py-20 md:py-28 px-4 md:px-12 bg-[#fafafa]">
        <div className="container-nike">
          {/* Section Header */}
          <div className="mb-12">
            <div className="w-12 h-1 bg-black rounded-full mb-4" />
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Shop by Category</h2>
            <p className="text-black/50 text-lg">Find your perfect fit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Running */}
            <Link
              href="/products?category=running"
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-black"
            >
              <Image
                src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=1200&auto=format&fit=crop"
                alt="Running"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Liquid Glass Overlay on Hover */}
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="glass-liquid-dark rounded-2xl p-5 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-1">Running</h3>
                  <p className="text-white/50 text-sm mb-3">Performance engineered</p>
                  <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                    Shop Collection <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                {/* Default state (visible when not hovered) */}
                <div className="group-hover:opacity-0 transition-opacity duration-300 absolute bottom-6 md:bottom-8 left-6 md:left-8">
                  <h3 className="text-3xl md:text-4xl font-black text-white">Running</h3>
                </div>
              </div>
            </Link>

            {/* Basketball */}
            <Link
              href="/products?category=basketball"
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-black"
            >
              <Image
                src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop"
                alt="Basketball"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="glass-liquid-dark rounded-2xl p-5 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-1">Basketball</h3>
                  <p className="text-white/50 text-sm mb-3">Court-ready performance</p>
                  <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                    Shop Collection <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="group-hover:opacity-0 transition-opacity duration-300 absolute bottom-6 md:bottom-8 left-6 md:left-8">
                  <h3 className="text-3xl md:text-4xl font-black text-white">Basketball</h3>
                </div>
              </div>
            </Link>

            {/* Training */}
            <Link
              href="/products?category=training"
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-black"
            >
              <Image
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
                alt="Training"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="glass-liquid-dark rounded-2xl p-5 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-1">Training</h3>
                  <p className="text-white/50 text-sm mb-3">Push your limits</p>
                  <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                    Shop Collection <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="group-hover:opacity-0 transition-opacity duration-300 absolute bottom-6 md:bottom-8 left-6 md:left-8">
                  <h3 className="text-3xl md:text-4xl font-black text-white">Training</h3>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Nike Membership Banner - Premium Design */}
      <section className="py-20 px-4 md:px-12">
        <div className="container-nike">
          <div className="relative bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#0a0a0a] text-white rounded-3xl p-10 md:p-20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white to-transparent" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#c0ff00] rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-liquid-dark rounded-full mb-8">
                <Shield className="w-4 h-4 text-[#c0ff00]" />
                <span className="text-sm font-semibold">Nike Membership</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                Become a
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#c0ff00] to-[#90ff00]">
                  Member
                </span>
              </h2>

              <p className="text-white/60 text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed">
                Sign up for free. Join the community. Get exclusive benefits, early access to new products, and members-only offers.
              </p>

              {/* Benefits Grid */}
              <div className="grid grid-cols-3 gap-6 mb-10 max-w-md mx-auto">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#c0ff00]">Free</p>
                  <p className="text-white/40 text-sm">Shipping</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">Early</p>
                  <p className="text-white/40 text-sm">Access</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">30-Day</p>
                  <p className="text-white/40 text-sm">Returns</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="bg-white text-black hover:bg-white/90 rounded-full px-10 h-14 font-bold text-base transition-all hover:scale-105"
                  asChild
                >
                  <Link href="/join">Join Us</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 rounded-full px-10 h-14 font-bold text-base"
                  asChild
                >
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
