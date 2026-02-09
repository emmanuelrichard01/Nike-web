"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Menu, X, User, LogOut, Heart, HelpCircle, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button, cn } from "@nike/ui";
import { useCartStore } from "@/lib/store/cart-store";
import { useUIStore } from "@/lib/store/ui-store";
import { CartSheet } from "@/components/cart/cart-sheet";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
    { name: "New", href: "/products?category=new" },
    { name: "Men", href: "/products?category=men" },
    { name: "Women", href: "/products?category=women" },
    { name: "Kids", href: "/products?category=kids" },
    { name: "Sale", href: "/products?category=sale" },
];

// Nike Logo Component with color variants
function NikeLogo({ className, variant = "dark" }: { className?: string; variant?: "dark" | "light" }) {
    return (
        <Image
            src="/nike_logo.png"
            alt="Nike"
            width={40}
            height={40}
            className={cn(
                "object-contain transition-all duration-300",
                variant === "light" && "brightness-0 invert",
                className
            )}
            style={{ width: 40, height: 'auto' }}
            priority
        />
    );
}

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { data: session, status } = useSession();
    const itemCount = useCartStore((state) => state.getItemCount());
    const openCart = useUIStore((state) => state.openCart);
    const searchRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();

    // Only the landing page gets transparent hero treatment
    const isHeroPage = pathname === "/";

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setMobileMenuOpen(false);
                setSearchOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (searchOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [searchOpen]);

    // On hero page: transparent until scroll, then white glass
    // On all other pages: always solid white
    const useLight = isHeroPage && !scrolled;

    return (
        <>
            <motion.header
                initial={false}
                animate={{
                    backgroundColor: useLight
                        ? "rgba(0, 0, 0, 0)"
                        : "rgba(255, 255, 255, 0.95)",
                    backdropFilter: useLight ? "blur(0px)" : "blur(20px)",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    !useLight && "shadow-[0_1px_0_rgba(0,0,0,0.05)]"
                )}
            >
                <nav className="container-nike">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 group" aria-label="Nike Home">
                            <NikeLogo
                                variant={useLight ? "light" : "dark"}
                                className="transition-transform duration-200 group-hover:scale-110"
                            />
                        </Link>

                        {/* Desktop Navigation - Centered */}
                        <div className="hidden lg:flex lg:items-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                            <div className="flex gap-x-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "relative px-4 py-2 text-sm font-medium transition-colors rounded-full",
                                            useLight
                                                ? "text-white/90 hover:text-white hover:bg-white/10"
                                                : "text-black/80 hover:text-black hover:bg-black/5"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-x-1">
                            {/* Search */}
                            <AnimatePresence>
                                {searchOpen ? (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 220, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className={cn(
                                            "flex items-center rounded-full px-3 py-2",
                                            useLight ? "bg-white/15 border border-white/20" : "bg-black/5"
                                        )}>
                                            <Search className={cn(
                                                "h-4 w-4 flex-shrink-0",
                                                useLight ? "text-white/60" : "text-black/40"
                                            )} />
                                            <input
                                                ref={searchRef}
                                                type="search"
                                                placeholder="Search"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className={cn(
                                                    "bg-transparent border-none outline-none text-sm w-full px-2",
                                                    useLight
                                                        ? "text-white placeholder:text-white/50"
                                                        : "text-black placeholder:text-black/40"
                                                )}
                                            />
                                            <button
                                                onClick={() => setSearchOpen(false)}
                                                className={useLight ? "text-white/60 hover:text-white" : "text-black/40 hover:text-black"}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={cn(
                                            "p-2 rounded-full transition-colors",
                                            useLight ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-black"
                                        )}
                                        onClick={() => setSearchOpen(true)}
                                        aria-label="Search"
                                    >
                                        <Search className="h-[18px] w-[18px]" />
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {/* Wishlist */}
                            <Link
                                href="/wishlist"
                                className={cn(
                                    "p-2 rounded-full transition-colors hidden sm:block",
                                    useLight ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-black"
                                )}
                                aria-label="Favorites"
                            >
                                <Heart className="h-[18px] w-[18px]" />
                            </Link>

                            {/* Cart */}
                            <button
                                className={cn(
                                    "p-2 rounded-full transition-colors relative",
                                    useLight ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-black"
                                )}
                                onClick={openCart}
                                aria-label="Bag"
                            >
                                <ShoppingBag className="h-[18px] w-[18px]" />
                                {mounted && itemCount > 0 && (
                                    <span className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-[#c0ff00] text-black text-[9px] flex items-center justify-center font-bold">
                                        {itemCount > 9 ? "9+" : itemCount}
                                    </span>
                                )}
                            </button>

                            {/* Account (Desktop) */}
                            {status === "authenticated" && (
                                <Link
                                    href="/account"
                                    className={cn(
                                        "p-2 rounded-full transition-colors hidden md:block",
                                        useLight ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-black"
                                    )}
                                    aria-label="Account"
                                >
                                    <User className="h-[18px] w-[18px]" />
                                </Link>
                            )}

                            {/* Sign In Link */}
                            {status !== "authenticated" && (
                                <Link
                                    href="/auth/signin"
                                    className={cn(
                                        "hidden md:block text-sm font-medium px-4 py-2 rounded-full transition-colors",
                                        useLight
                                            ? "text-white/80 hover:text-white hover:bg-white/10"
                                            : "text-black/70 hover:text-black hover:bg-black/5"
                                    )}
                                >
                                    Sign In
                                </Link>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                className={cn(
                                    "lg:hidden p-2 rounded-full transition-colors",
                                    useLight ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-black"
                                )}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                                aria-expanded={mobileMenuOpen}
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </nav>
            </motion.header>

            {/* Mobile Menu Backdrop */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Menu Panel */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 lg:hidden shadow-2xl"
                    >
                        <div className="h-full overflow-y-auto p-6">
                            {/* Close Button */}
                            <div className="flex justify-end mb-8">
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-full hover:bg-black/5 transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Main Navigation */}
                            <div className="space-y-1 mb-8">
                                {navigation.map((item, i) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 + i * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className="flex items-center justify-between py-3 text-2xl font-bold tracking-tight hover:text-black/60 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                            <ChevronRight className="h-5 w-5 text-black/30" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="h-px bg-black/10 my-6" />

                            {/* Account Links */}
                            <div className="space-y-4">
                                {session ? (
                                    <>
                                        <Link href="/account" className="flex items-center gap-3 text-base text-black/60 hover:text-black transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                            <User className="h-5 w-5" />
                                            My Account
                                        </Link>
                                        <Link href="/wishlist" className="flex items-center gap-3 text-base text-black/60 hover:text-black transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                            <Heart className="h-5 w-5" />
                                            Favorites
                                        </Link>
                                        <Link href="/account/orders" className="flex items-center gap-3 text-base text-black/60 hover:text-black transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                            <ShoppingBag className="h-5 w-5" />
                                            Orders
                                        </Link>
                                        <button
                                            onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                            className="flex items-center gap-3 text-base text-black/60 hover:text-red-500 transition-colors"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-black/50">
                                            Become a Nike Member for the best products and exclusive access.
                                        </p>
                                        <div className="flex gap-3">
                                            <Button asChild className="flex-1 rounded-full bg-black text-white hover:bg-black/80 h-12 font-bold">
                                                <Link href="/join" onClick={() => setMobileMenuOpen(false)}>
                                                    Join Us
                                                </Link>
                                            </Button>
                                            <Button variant="outline" asChild className="flex-1 rounded-full border-black/20 h-12 font-bold">
                                                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                                                    Sign In
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-black/10 my-6" />

                            {/* Help Links */}
                            <div className="space-y-4">
                                <Link href="/stores" className="flex items-center gap-3 text-base text-black/60 hover:text-black transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                    Find a Store
                                </Link>
                                <Link href="/help" className="flex items-center gap-3 text-base text-black/60 hover:text-black transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                    <HelpCircle className="h-5 w-5" />
                                    Help
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CartSheet />
        </>
    );
}

export default Header;
