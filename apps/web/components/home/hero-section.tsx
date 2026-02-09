"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nike/ui"; // Standard button
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black text-white">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=2670&auto=format&fit=crop"
                    alt="Nike Hero Background - Athlete Running"
                    fill
                    className="object-cover object-[center_30%]"
                    priority
                />

                {/* Animated blobs for "Neo-Futurism" feel - kept subtle */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] z-10"
                />
            </div>

            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
                <motion.div style={{ y: y2 }}>
                    <motion.h1
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                        className="text-display-2xl font-black uppercase tracking-tighter leading-[0.8] mb-4"
                    >
                        Don't Just <br />
                        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 stroke-white text-stroke">
                            Run.
                        </span>{" "}
                        <span className="text-accent">Fly.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mt-6 text-xl md:text-2xl font-medium max-w-xl mx-auto text-gray-100 drop-shadow-md"
                    >
                        The all-new Pegasus 41 with ReactX foam. <br />
                        Energy return like never before.
                    </motion.p>

                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-8 flex gap-4 justify-center"
                    >
                        <Button
                            size="lg"
                            className="bg-white text-black hover:bg-gray-200 rounded-full px-8 py-6 text-lg transition-colors border border-white"
                            asChild
                        >
                            <Link href="/products" className="flex items-center">
                                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg transition-colors"
                            asChild
                        >
                            <Link href="/products?category=new">
                                Explore New Drops
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-3 bg-white rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
