import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

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
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "YouTube", href: "#", icon: Youtube },
];

export function Footer() {
    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container-nike py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Products */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                            Products
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.products.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                            Get Help
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                            About Nike
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                            Connect
                        </h3>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                                        aria-label={social.name}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-primary-foreground/50">
                        © {new Date().getFullYear()} Nike, Inc. All Rights Reserved
                    </p>
                    <div className="flex gap-6 text-xs text-primary-foreground/50">
                        <Link href="/terms" className="hover:text-primary-foreground transition-colors">
                            Terms of Use
                        </Link>
                        <Link href="/privacy" className="hover:text-primary-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/cookies" className="hover:text-primary-foreground transition-colors">
                            Cookie Settings
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
