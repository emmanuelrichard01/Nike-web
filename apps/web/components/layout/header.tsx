"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, X, User, LogOut, Heart, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button, cn } from "@nike/ui";
import { useCartStore } from "@/lib/store/cart-store";
import { useUIStore } from "@/lib/store/ui-store";
import { CartSheet } from "@/components/cart/cart-sheet";
import Image from "next/image";

const navigation = [
    { name: "New & Featured", href: "/products?category=new" },
    { name: "Men", href: "/products?category=men" },
    { name: "Women", href: "/products?category=women" },
    { name: "Kids", href: "/products?category=kids" },
    { name: "Sale", href: "/products?category=sale" },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { data: session, status } = useSession();
    const itemCount = useCartStore((state) => state.getItemCount());

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-col font-sans">
            {/* Top Bar - Hidden on scroll for cleanliness */}
            <div className={cn(
                "bg-background-secondary/80 backdrop-blur-sm px-6 py-1.5 flex justify-between items-center text-[11px] font-medium transition-all duration-300 pointer-events-auto",
                scrolled ? "-translate-y-full opacity-0 pointer-events-none absolute w-full" : "translate-y-0 opacity-100"
            )}>
                <div className="flex gap-4">
                    {/* Placeholder for other brand logos if needed */}
                </div>
                <div className="flex gap-3 text-foreground font-semibold">
                    <Link href="/help" className="hover:text-foreground-muted">Help</Link>
                    <span className="text-border">|</span>
                    <Link href="/join" className="hover:text-foreground-muted">Join Us</Link>
                    {status !== "authenticated" && (
                        <>
                            <span className="text-border">|</span>
                            <Link href="/auth/signin" className="hover:text-foreground-muted">Sign In</Link>
                        </>
                    )}
                </div>
            </div>

            {/* Main Header */}
            <header className={cn(
                "w-full bg-background transition-all duration-300 border-b",
                scrolled ? "shadow-sm border-border/50 py-0" : "border-transparent py-2"
            )}>
                <nav className="container-nike relative">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 group relative z-10" aria-label="Nike Home">
                            <Image
                                src="/nike-logo.svg"
                                alt="Nike"
                                width={60}
                                height={24}
                                className="h-6 w-auto transition-transform duration-300 group-hover:scale-110"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:absolute md:inset-0 md:flex md:justify-center md:items-center pointer-events-none">
                            <div className="flex gap-x-6 pointer-events-auto">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="relative text-sm font-semibold tracking-wide text-foreground hover:text-foreground group py-4"
                                    >
                                        {item.name}
                                        <span className="absolute bottom-2 left-0 w-full h-0.5 bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-x-1 z-10">
                            {/* Search */}
                            <div className="relative group">
                                <div className={cn(
                                    "flex items-center bg-background-secondary/50 rounded-full px-3 py-1.5 transition-all duration-300 border border-transparent focus-within:border-border",
                                    searchOpen ? "w-64 bg-background-secondary" : "w-auto bg-transparent hover:bg-background-secondary/50"
                                )}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-transparent"
                                        onClick={() => setSearchOpen(!searchOpen)}
                                        aria-label="Search"
                                    >
                                        <Search className="h-5 w-5" />
                                    </Button>
                                    <input
                                        type="search"
                                        placeholder="Search"
                                        className={cn(
                                            "bg-transparent border-none outline-none text-sm font-medium placeholder:text-foreground-muted ml-0 transition-all duration-300",
                                            searchOpen ? "w-full opacity-100 ml-2" : "w-0 opacity-0"
                                        )}
                                        onFocus={() => setSearchOpen(true)}
                                        onBlur={() => !searchOpen && setSearchOpen(false)}
                                    />
                                </div>
                            </div>

                            {/* Wishlist */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-background-secondary h-10 w-10 transition-colors"
                                asChild
                            >
                                <Link href="/wishlist" aria-label="Wishlist">
                                    <Heart className="h-6 w-6" />
                                </Link>
                            </Button>

                            {/* Cart */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative rounded-full hover:bg-background-secondary h-10 w-10 transition-colors"
                                onClick={() => useUIStore.getState().openCart()}
                                aria-label="Cart"
                            >
                                <ShoppingBag className="h-6 w-6" />
                                {mounted && itemCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-foreground text-background text-[10px] flex items-center justify-center font-bold">
                                        {itemCount > 9 ? "9+" : itemCount}
                                    </span>
                                )}
                            </Button>

                            {/* Mobile menu button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden rounded-full hover:bg-background-secondary h-10 w-10"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </Button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Navigation Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-background z-40 md:hidden pt-24 px-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col space-y-6">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-2xl font-bold tracking-tight flex justify-between items-center group"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.name}
                            <span className="text-foreground-muted group-hover:text-foreground transition-colors">→</span>
                        </Link>
                    ))}

                    <div className="h-px bg-border my-4" />

                    <div className="space-y-4">
                        <Link
                            href="/account"
                            className="flex items-center gap-3 text-lg font-medium text-foreground-muted hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <User className="h-5 w-5" />
                            {session ? "My Account" : "Sign In / Join Us"}
                        </Link>
                        <Link
                            href="/help"
                            className="flex items-center gap-3 text-lg font-medium text-foreground-muted hover:text-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <HelpCircle className="h-5 w-5" />
                            Help
                        </Link>
                    </div>

                    {session && (
                        <button
                            onClick={() => {
                                signOut();
                                setMobileMenuOpen(false);
                            }}
                            className="mt-8 py-3 px-6 rounded-full bg-background-secondary text-foreground font-semibold flex items-center justify-center gap-2"
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    )}
                </div>
            </div>

            <CartSheet />
        </div>
    );
}



export default Header;
