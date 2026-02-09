"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Facebook, Instagram, Youtube, MapPin, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

// Nike Logo Component
function NikeLogo({ className }: { className?: string }) {
    return (
        <Image
            src="/nike_logo.png"
            alt="Nike"
            width={60}
            height={22}
            className={className}
            style={{ filter: "brightness(0) invert(1)" }}
        />
    );
}

const footerLinks = {
    resources: [
        { name: "Find A Store", href: "/stores" },
        { name: "Become a Member", href: "/join" },
        { name: "Send Us Feedback", href: "/feedback" },
        { name: "Student Discount", href: "/student" },
    ],
    help: [
        { name: "Get Help", href: "/help" },
        { name: "Order Status", href: "/account/orders" },
        { name: "Delivery", href: "/help/shipping" },
        { name: "Returns", href: "/help/returns" },
        { name: "Payment Options", href: "/help/payments" },
        { name: "Contact Us", href: "/contact" },
    ],
    company: [
        { name: "About Nike", href: "/about" },
        { name: "News", href: "/news" },
        { name: "Careers", href: "/careers" },
        { name: "Investors", href: "/investors" },
        { name: "Sustainability", href: "/sustainability" },
    ],
};

const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/nike", icon: Twitter },
    { name: "Facebook", href: "https://facebook.com/nike", icon: Facebook },
    { name: "YouTube", href: "https://youtube.com/nike", icon: Youtube },
    { name: "Instagram", href: "https://instagram.com/nike", icon: Instagram },
];

export function Footer() {
    const [email, setEmail] = useState("");

    return (
        <footer className="bg-[#111] text-white">
            {/* Newsletter Section */}
            <div className="border-b border-white/10">
                <div className="container-nike py-12 md:py-16">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                        <div className="max-w-md">
                            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
                                Stay in the loop
                            </h3>
                            <p className="text-white/50 text-sm">
                                Be the first to know about new releases, exclusive offers, and member benefits.
                            </p>
                        </div>
                        <div className="flex-1 max-w-md">
                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-full text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                                    />
                                </div>
                                <button className="px-6 py-4 bg-white text-black rounded-full font-bold text-sm hover:bg-white/90 transition-colors flex items-center gap-2">
                                    Subscribe
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-nike pt-12 pb-8">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <NikeLogo className="mb-6" />
                        <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
                            Bringing inspiration and innovation to every athlete in the world.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-2">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group"
                                        aria-label={social.name}
                                    >
                                        <Icon className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-5 text-white/40">
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/60 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-5 text-white/40">
                            Help
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.help.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/60 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-5 text-white/40">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/60 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Left Side */}
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
                        {/* Location */}
                        <button className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                            <MapPin className="w-4 h-4" />
                            <span>United States</span>
                        </button>
                        {/* Copyright */}
                        <span className="text-sm text-white/40">
                            © {new Date().getFullYear()} Nike, Inc. All Rights Reserved
                        </span>
                    </div>

                    {/* Right Side - Legal Links */}
                    <div className="flex flex-wrap gap-4 md:gap-6">
                        {["Guides", "Terms of Sale", "Terms of Use", "Privacy Policy"].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                                className="text-sm text-white/40 hover:text-white transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
