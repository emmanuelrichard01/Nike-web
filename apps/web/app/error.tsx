"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@nike/ui";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("App error:", error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>

                <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                <p className="text-black/50 mb-8 text-sm">
                    We encountered an unexpected error. Please try again or return to the home page.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={reset}
                        className="rounded-full px-6 h-11 bg-black text-white hover:bg-black/80 font-semibold"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="rounded-full px-6 h-11 border-black/10 font-semibold"
                    >
                        <Link href="/">
                            <Home className="w-4 h-4 mr-2" />
                            Home Page
                        </Link>
                    </Button>
                </div>

                {error.digest && (
                    <p className="mt-6 text-xs text-black/20">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
