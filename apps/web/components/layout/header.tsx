"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, X, User, LogOut, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button, cn } from "@nike/ui";
import { useCartStore } from "@/lib/store/cart-store";
import { useUIStore } from "@/lib/store/ui-store";
import { CartSheet } from "@/components/cart/cart-sheet";

const navigation = [
    { name: "New Releases", href: "/products?category=new" },
    { name: "Men", href: "/products?category=men" },
    { name: "Women", href: "/products?category=women" },
    { name: "Kids", href: "/products?category=kids" },
    { name: "Sale", href: "/products?category=sale" },
];

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { data: session, status } = useSession();
    const itemCount = useCartStore((state) => state.getItemCount());

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
            <nav className="container-nike">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <NikeLogo className="h-5 w-auto" />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:gap-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-foreground hover:text-foreground-muted transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-x-2">
                        {/* Search */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSearchOpen(!searchOpen)}
                                aria-label="Search"
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                            <div
                                className={cn(
                                    "absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-nike p-4 transition-all duration-200",
                                    searchOpen
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 -translate-y-2 pointer-events-none"
                                )}
                            >
                                <input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                    autoFocus={searchOpen}
                                />
                            </div>
                        </div>

                        {/* Account - show different based on auth state */}
                        {status === "loading" ? (
                            <Button variant="ghost" size="icon" disabled>
                                <User className="h-5 w-5 animate-pulse" />
                            </Button>
                        ) : session ? (
                            <div className="relative group">
                                <Button variant="ghost" size="icon" aria-label="Account">
                                    {session.user?.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || "User"}
                                            className="h-7 w-7 rounded-full"
                                        />
                                    ) : (
                                        <User className="h-5 w-5" />
                                    )}
                                </Button>
                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-nike opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="p-3 border-b border-border">
                                        <p className="font-medium text-sm truncate">
                                            {session.user?.name || "User"}
                                        </p>
                                        <p className="text-xs text-foreground-muted truncate">
                                            {session.user?.email}
                                        </p>
                                    </div>
                                    <div className="p-1">
                                        <Link
                                            href="/account"
                                            className="block px-3 py-2 text-sm hover:bg-background-secondary rounded-md transition-colors"
                                        >
                                            My Account
                                        </Link>
                                        <Link
                                            href="/orders"
                                            className="block px-3 py-2 text-sm hover:bg-background-secondary rounded-md transition-colors"
                                        >
                                            Orders
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-background-secondary rounded-md transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/auth/signin" aria-label="Sign In">
                                    <User className="h-5 w-5" />
                                </Link>
                            </Button>
                        )}

                        {/* Wishlist */}
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                        >
                            <Link href="/wishlist" aria-label="Wishlist">
                                <Heart className="h-5 w-5" />
                            </Link>
                        </Button>

                        {/* Cart */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                            onClick={() => useUIStore.getState().openCart()}
                            aria-label="Cart"
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {mounted && itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                                    {itemCount > 9 ? "9+" : itemCount}
                                </span>
                            )}
                        </Button>

                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={cn(
                        "md:hidden overflow-hidden transition-all duration-300",
                        mobileMenuOpen ? "max-h-80 pb-4" : "max-h-0"
                    )}
                >
                    <div className="space-y-1 pt-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block py-2 text-base font-medium text-foreground hover:text-foreground-muted transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-border mt-2">
                            {session ? (
                                <>
                                    <Link
                                        href="/account"
                                        className="block py-2 text-base font-medium text-foreground"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Account
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="block py-2 text-base font-medium text-destructive"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/auth/signin"
                                    className="block py-2 text-base font-medium text-foreground"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <CartSheet />
        </header>
    );
}

function NikeLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="currentColor"
            aria-label="Nike"
        >
            <path d="M21 8.25c-1.27-0.089-2.502-0.347-3.72-0.669-2.315-0.612-4.502-1.425-6.606-2.433l-0.126-0.063c-3.766-1.896-7.142-4.322-10.027-7.221l-0.521-0.528 17.558 20.34c1.192 1.381 3.25 1.505 4.595 0.276 0.057-0.052 0.113-0.105 0.169-0.16 1.258-1.258 1.488-3.153 0.601-4.706l-0.071-0.117-1.852-4.719z" />
        </svg>
    );
}

export default Header;
