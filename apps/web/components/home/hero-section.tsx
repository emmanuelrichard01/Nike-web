"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const heroSlides = [
    {
        id: 1,
        badge: "Spring 2026",
        titleLine1: "Air",
        titleLine2: "Max",
        tagline: "Maximum Air. Maximum comfort. Engineered for those who move without limits.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2670&auto=format&fit=crop",
        productName: "Air Max 90",
        productPrice: "$159",
        stats: { cushioning: "+40%", weight: "265g" },
        ctaText: "Shop Collection",
        ctaLink: "/products?category=air-max",
        accentColor: "#c0ff00",
    },
    {
        id: 2,
        badge: "Just Dropped",
        titleLine1: "Jordan",
        titleLine2: "Retro",
        tagline: "Iconic style meets modern performance. The legend continues.",
        image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=2625&auto=format&fit=crop",
        productName: "Jordan 1 High",
        productPrice: "$180",
        stats: { heritage: "1985", editions: "50+" },
        ctaText: "Shop Jordan",
        ctaLink: "/products?category=jordan",
        accentColor: "#ff4d4d",
    },
    {
        id: 3,
        badge: "Performance",
        titleLine1: "Pegasus",
        titleLine2: "41",
        tagline: "ReactX foam technology delivers more energy return for your everyday miles.",
        image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2664&auto=format&fit=crop",
        productName: "Pegasus 41",
        productPrice: "$140",
        stats: { energy: "+13%", drop: "10mm" },
        ctaText: "Shop Running",
        ctaLink: "/products?category=running",
        accentColor: "#00d4ff",
    },
];

export function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState(0);
    const { scrollY } = useScroll();

    // Parallax transforms
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);
    const yContent = useTransform(scrollY, [0, 300], [0, 60]);

    // Auto-advance slides
    useEffect(() => {
        const interval = setInterval(() => {
            setDirection(1);
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const goToSlide = useCallback((index: number) => {
        setDirection(index > currentSlide ? 1 : -1);
        setCurrentSlide(index);
    }, [currentSlide]);

    const nextSlide = useCallback(() => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setDirection(-1);
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }, []);

    const slide = heroSlides[currentSlide];

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
        }),
    };

    const scrollToContent = () => {
        window.scrollTo({ top: window.innerHeight - 100, behavior: "smooth" });
    };

    return (
        <section className="relative h-[100svh] w-full overflow-hidden bg-black">
            {/* Background Images - Carousel */}
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={slide.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={slide.image}
                        alt={`${slide.titleLine1} ${slide.titleLine2}`}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Floating Product Badge - Top Right */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`badge-${slide.id}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute top-28 right-8 md:right-16 z-20 hidden md:block"
                >
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/15 min-w-[140px]">
                        <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] mb-1.5">Featured</p>
                        <p className="text-white font-bold text-sm">{slide.productName}</p>
                        <p className="font-black text-xl mt-1" style={{ color: slide.accentColor }}>{slide.productPrice}</p>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Main Content - Bottom-aligned */}
            <div className="relative z-10 h-full flex flex-col justify-end container-nike pb-28 md:pb-32">
                <motion.div style={{ opacity, y: yContent }} className="max-w-2xl">
                    {/* Accent Line */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`line-${slide.id}`}
                            initial={{ width: 0 }}
                            animate={{ width: 48 }}
                            exit={{ width: 0 }}
                            transition={{ duration: 0.6 }}
                            className="h-1 rounded-full mb-6"
                            style={{ backgroundColor: slide.accentColor }}
                        />
                    </AnimatePresence>

                    {/* Badge */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`collection-${slide.id}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            className="inline-flex items-center gap-3 mb-4"
                        >
                            <span className="relative flex h-2 w-2">
                                <span
                                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                    style={{ backgroundColor: slide.accentColor }}
                                />
                                <span
                                    className="relative inline-flex rounded-full h-2 w-2"
                                    style={{ backgroundColor: slide.accentColor }}
                                />
                            </span>
                            <span className="text-white/70 text-xs font-semibold tracking-[0.2em] uppercase">
                                {slide.badge} Collection
                            </span>
                        </motion.div>
                    </AnimatePresence>

                    {/* Main Title */}
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={`title-${slide.id}`}
                            className="mb-5"
                        >
                            <motion.span
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="block text-[clamp(3rem,10vw,7rem)] font-black uppercase tracking-tighter leading-[0.85] text-white"
                            >
                                {slide.titleLine1}
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, delay: 0.08 }}
                                className="block text-[clamp(3rem,10vw,7rem)] font-black uppercase tracking-tighter leading-[0.85]"
                                style={{
                                    color: 'transparent',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    backgroundImage: `linear-gradient(135deg, ${slide.accentColor}, ${slide.accentColor}bb)`,
                                }}
                            >
                                {slide.titleLine2}
                            </motion.span>
                        </motion.h1>
                    </AnimatePresence>

                    {/* Tagline */}
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`tagline-${slide.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                            className="text-base md:text-lg text-white/60 max-w-md mb-8 leading-relaxed"
                        >
                            {slide.tagline}
                        </motion.p>
                    </AnimatePresence>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center gap-4"
                    >
                        {/* Primary CTA */}
                        <Link
                            href={slide.ctaLink}
                            className="group relative inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 text-black uppercase tracking-wider"
                            style={{
                                backgroundColor: slide.accentColor,
                                boxShadow: `0 0 40px ${slide.accentColor}40`,
                            }}
                        >
                            <span>{slide.ctaText}</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>

                        {/* Secondary CTA */}
                        <button className="group flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                            <div className="relative w-12 h-12 rounded-full border border-white/25 group-hover:border-white/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 backdrop-blur-sm">
                                <Play className="w-4 h-4 ml-0.5 fill-current" />
                            </div>
                            <span className="text-sm font-medium">Watch Film</span>
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Slide Navigation - Bottom Center */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-5">
                <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all backdrop-blur-sm"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Dots with slide counter */}
                <div className="flex items-center gap-2">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`rounded-full transition-all duration-500 ${index === currentSlide
                                    ? "h-1.5 w-10"
                                    : "h-1.5 w-1.5 bg-white/25 hover:bg-white/40"
                                }`}
                            style={index === currentSlide ? { backgroundColor: slide.accentColor } : undefined}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all backdrop-blur-sm"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Side Stats - Desktop Only */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`stats-${slide.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="absolute right-8 md:right-16 bottom-36 z-20 hidden lg:flex flex-col gap-5 text-right"
                >
                    {Object.entries(slide.stats).map(([key, value]) => (
                        <div key={key}>
                            <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] mb-1">{key}</p>
                            <p className="text-white text-xl font-black">{value}</p>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {/* Scroll Indicator */}
            <motion.button
                onClick={scrollToContent}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-10 right-8 md:right-16 z-20 text-white/30 hover:text-white/60 transition-colors cursor-pointer hidden md:block"
                aria-label="Scroll down"
            >
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-1.5"
                >
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </motion.button>
        </section>
    );
}
