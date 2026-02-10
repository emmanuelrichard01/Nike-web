"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@nike/ui";
import { Eye, EyeOff, Loader2, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!token) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                        <Lock className="w-7 h-7 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3">Invalid Reset Link</h1>
                    <p className="text-black/50 mb-8">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Button asChild className="rounded-full px-8 h-12 bg-black text-white hover:bg-black/80 font-semibold">
                        <Link href="/auth/forgot-password">Request New Link</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-3">Password Reset!</h1>
                    <p className="text-black/50 mb-8">
                        Your password has been successfully updated. You can now sign in with your new password.
                    </p>
                    <Button asChild className="rounded-full px-8 h-12 bg-black text-white hover:bg-black/80 font-semibold">
                        <Link href="/auth/signin">Sign In</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to reset password");
            }

            setIsSuccess(true);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Nike Logo */}
                <div className="text-center mb-10">
                    <svg className="h-6 mx-auto mb-8" viewBox="0 0 69 32" fill="currentColor">
                        <path d="M68.56 4L18.4 25.36Q12.16 28 7.92 28q-4.8 0-6.96-3.36-1.36-2.16-.8-5.48t2.96-7.08q2-3.04 6.56-8-1.12 2.96-.24 5.36 .56 1.52 1.76 2.08 1.2.56 3.2.56 2.72 0 11.2-4.64L68.56 4z" />
                    </svg>
                    <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                    <p className="text-black/50 text-sm">Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* New Password */}
                    <div>
                        <label className="text-sm font-semibold text-black/60 block mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                className="w-full border border-black/10 rounded-xl px-4 py-3.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-shadow bg-[#fafafa]"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-sm font-semibold text-black/60 block mb-2">
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
                            className="w-full border border-black/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-shadow bg-[#fafafa]"
                            required
                            minLength={8}
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading || password.length < 8}
                        className="w-full rounded-full h-12 bg-black text-white hover:bg-black/80 font-semibold text-sm"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </form>

                <p className="text-center text-sm text-black/40 mt-8">
                    Remember your password?{" "}
                    <Link href="/auth/signin" className="text-black font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
