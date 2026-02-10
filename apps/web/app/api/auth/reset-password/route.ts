import { NextResponse } from "next/server";
import { prisma } from "@nike/database";
import { hash } from "bcryptjs";
import { z } from "zod";

const resetSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, password } = resetSchema.parse(body);

        // Find the verification token
        const verificationToken = await prisma.verificationToken.findUnique({
            where: { token },
        });

        if (!verificationToken) {
            return NextResponse.json(
                { error: "Invalid or expired reset link" },
                { status: 400 }
            );
        }

        // Check if token has expired
        if (new Date() > verificationToken.expires) {
            // Clean up expired token
            await prisma.verificationToken.delete({
                where: { token },
            });
            return NextResponse.json(
                { error: "Reset link has expired. Please request a new one." },
                { status: 400 }
            );
        }

        // Find user by email (identifier)
        const user = await prisma.user.findUnique({
            where: { email: verificationToken.identifier },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Hash and update password
        const hashedPassword = await hash(password, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        // Delete the used token
        await prisma.verificationToken.delete({
            where: { token },
        });

        return NextResponse.json({ message: "Password reset successfully" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
