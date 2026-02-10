import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token,
    },
});

// Protect account and admin routes — auth pages and public routes are excluded
export const config = {
    matcher: [
        "/account/:path*",
        "/admin/:path*",
        "/checkout",
        "/wishlist",
    ],
};
