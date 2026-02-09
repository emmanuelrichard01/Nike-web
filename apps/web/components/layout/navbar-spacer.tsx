"use client";

import { usePathname } from "next/navigation";

export function NavbarSpacer() {
    const pathname = usePathname();

    // Landing page has a full-height hero, so no spacer needed
    if (pathname === "/") return null;

    return <div className="h-16" />;
}
