import { NextResponse } from "next/server";
import { prisma } from "@nike/database"; // Correct import based on monorepo structure

export const dynamic = 'force-dynamic';

export async function GET() {
    const results: {
        env: {
            DATABASE_URL_PRESENT: boolean;
            DATABASE_URL_PROTOCOL: string | undefined;
            NODE_ENV: string | undefined;
        };
        connection: string;
        count: number | null;
        error: any;
    } = {
        env: {
            DATABASE_URL_PRESENT: !!process.env.DATABASE_URL,
            // Do not log the full value for security, just the start/end or protocol
            DATABASE_URL_PROTOCOL: process.env.DATABASE_URL?.split("://")[0],
            NODE_ENV: process.env.NODE_ENV,
        },
        connection: "PENDING",
        count: null,
        error: null,
    };

    try {
        console.log("Attempting DB connection...");
        await prisma.$connect();
        results.connection = "SUCCESS";

        console.log("Attempting to count products...");
        const count = await prisma.product.count();
        results.count = count;

        return NextResponse.json(results);
    } catch (e: any) {
        console.error("DB Debug Error:", e);
        results.connection = "FAILED";
        results.error = {
            message: e.message,
            name: e.name,
            code: e.code,
            meta: e.meta,
        };
        return NextResponse.json(results, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
