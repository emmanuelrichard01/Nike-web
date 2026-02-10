import { Header, Footer, NavbarSpacer } from "@/components/layout";

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            <NavbarSpacer />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
