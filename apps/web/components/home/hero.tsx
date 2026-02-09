import Link from "next/link";
import { Button } from "@nike/ui";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-[90vh] bg-background-secondary overflow-hidden">
            {/* Background Element */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent/5 to-transparent blur-3xl" />

            <div className="container-nike relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[90vh] py-20">
                    {/* Text Content */}
                    <div className="animate-slide-up">
                        <span className="inline-block text-sm font-semibold text-foreground-muted uppercase tracking-widest mb-4">
                            New Arrivals
                        </span>
                        <h1 className="text-display-xl font-extrabold text-foreground mb-6">
                            Just Do It
                        </h1>
                        <p className="text-xl text-foreground-muted max-w-md mb-8">
                            Discover the latest Nike innovations designed to push athletic
                            performance to new heights. Style meets functionality.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" asChild>
                                <Link href="/products">
                                    Shop Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/products?category=new">New Releases</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative flex justify-center lg:justify-end animate-fade-in">
                        <div className="relative">
                            {/* Decorative circle */}
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full blur-2xl scale-110" />

                            {/* Shoe placeholder - in production use actual image */}
                            <div className="relative z-10 text-[200px] lg:text-[300px] transform -rotate-12 hover:rotate-[-8deg] hover:scale-105 transition-transform duration-500 cursor-pointer">
                                👟
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
