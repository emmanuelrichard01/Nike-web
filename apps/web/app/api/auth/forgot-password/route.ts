import { NextResponse } from "next/server";
import { prisma } from "@nike/database";
import { z } from "zod";
import { sendPasswordReset } from "@/lib/email";
import crypto from "crypto";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = forgotPasswordSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json(
                { message: "If an account exists, a reset link has been sent." },
                { status: 200 }
            );
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

        // Store token in database
        // We use the VerificationToken model which key is (identifier, token)
        // identifier = email
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        // Generate reset link
        // In production this should be your actual domain
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

        // Send email
        await sendPasswordReset({
            to: email,
            resetUrl,
        });

        return NextResponse.json(
            { message: "If an account exists, a reset link has been sent." },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
