import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, MapPin } from "lucide-react";

const footerLinks = {
    products: [
        { name: "New Releases", href: "/products?category=new" },
        { name: "Running", href: "/products?category=running" },
        { name: "Basketball", href: "/products?category=basketball" },
        { name: "Lifestyle", href: "/products?category=lifestyle" },
        { name: "Training", href: "/products?category=training" },
    ],
    support: [
        { name: "Find a Store", href: "/stores" },
        { name: "Help", href: "/help" },
        { name: "Shipping", href: "/help/shipping" },
        { name: "Returns", href: "/help/returns" },
        { name: "Order Status", href: "/orders" },
    ],
    company: [
        { name: "About Nike", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Investors", href: "/investors" },
        { name: "Sustainability", href: "/sustainability" },
    ],
};

const socialLinks = [
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "YouTube", href: "#", icon: Youtube },
];

export function Footer() {
    return (
        <footer className="bg-[#111111] text-white overflow-hidden">
            <div className="container-nike pt-16 pb-8">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    {/* Brand / Links */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-4 text-white">
                                Find a Store
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/stores" className="text-sm font-medium text-white hover:text-white/70 transition-colors flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Find a Location
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/join" className="text-sm font-medium text-white hover:text-white/70 transition-colors">
                                        Become a Member
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/feedback" className="text-sm font-medium text-white hover:text-white/70 transition-colors">
                                        Send Feedback
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-4 text-white">
                            Get Help
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-xs text-secondary hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-4 text-white">
                            About Nike
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-xs text-secondary hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Socials */}
                    <div className="lg:text-right">
                        <div className="flex lg:justify-end gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className="w-8 h-8 rounded-full bg-heading text-black flex items-center justify-center hover:bg-white transition-colors"
                                        style={{ backgroundColor: '#7e7e7e' }}
                                        aria-label={social.name}
                                    >
                                        <Icon className="h-4 w-4 text-[#111111]" fill="currentColor" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#333333] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-white" />
                            <span className="text-xs font-bold text-white">United States</span>
                        </div>
                        <p className="text-xs text-[#7e7e7e]">
                            © {new Date().getFullYear()} Nike, Inc. All Rights Reserved
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 md:gap-6 text-xs text-[#7e7e7e]">
                        <Link href="/guides" className="hover:text-white transition-colors">
                            Guides
                        </Link>
                        <Link href="/terms" className="hover:text-white transition-colors">
                            Terms of Sale
                        </Link>
                        <Link href="/terms" className="hover:text-white transition-colors">
                            Terms of Use
                        </Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            Nike Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
