import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database seed...");

    // Clean existing data
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log("🗑️ Cleaned existing data");

    // Create categories
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: "Running",
                slug: "running",
            },
        }),
        prisma.category.create({
            data: {
                name: "Basketball",
                slug: "basketball",
            },
        }),
        prisma.category.create({
            data: {
                name: "Lifestyle",
                slug: "lifestyle",
            },
        }),
        prisma.category.create({
            data: {
                name: "Training",
                slug: "training",
            },
        }),
    ]);

    console.log(`📂 Created ${categories.length} categories`);

    // Create products with variants
    const products = [
        {
            name: "Nike Air Max 270",
            slug: "nike-air-max-270",
            description:
                "The Nike Air Max 270 delivers visible cushioning under every step. Updated for modern comfort, it nods to the original, 1991 Air Max 180 with its exaggerated tongue top and heritage tongue logo.",
            price: 150.0,
            categorySlug: "lifestyle",
            images: [
                "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1000&auto=format&fit=crop"
            ],
            variants: [
                { size: "8", color: "Black/White", sku: "AM270-BW-8", stock: 15 },
                { size: "9", color: "Black/White", sku: "AM270-BW-9", stock: 20 },
                { size: "10", color: "Black/White", sku: "AM270-BW-10", stock: 18 },
                { size: "11", color: "Black/White", sku: "AM270-BW-11", stock: 12 },
                { size: "9", color: "White/University Red", sku: "AM270-WR-9", stock: 10 },
                { size: "10", color: "White/University Red", sku: "AM270-WR-10", stock: 8 },
            ],
        },
        {
            name: "Nike Air Force 1 '07",
            slug: "nike-air-force-1-07",
            description:
                "The radiance lives on in the Nike Air Force 1 '07. This b-ball original puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash.",
            price: 115.0,
            categorySlug: "lifestyle",
            images: [
                "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1584735174965-48c48d7edfde?q=80&w=1000&auto=format&fit=crop"
            ],
            variants: [
                { size: "8", color: "White/White", sku: "AF1-WW-8", stock: 25 },
                { size: "9", color: "White/White", sku: "AF1-WW-9", stock: 30 },
                { size: "10", color: "White/White", sku: "AF1-WW-10", stock: 28 },
                { size: "11", color: "White/White", sku: "AF1-WW-11", stock: 20 },
                { size: "12", color: "White/White", sku: "AF1-WW-12", stock: 15 },
                { size: "10", color: "Black/Black", sku: "AF1-BB-10", stock: 18 },
            ],
        },
        {
            name: "Nike Pegasus 41",
            slug: "nike-pegasus-41",
            description:
                "Responsive satisfies the needs of every runner. The Nike Pegasus 41 delivers that feeling with ReactX foam technology for even more energy return and comfort than the classic Air Zoom Pegasus.",
            price: 140.0,
            categorySlug: "running",
            images: [
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop"
            ],
            variants: [
                { size: "8", color: "Black/Volt", sku: "PEG41-BV-8", stock: 12 },
                { size: "9", color: "Black/Volt", sku: "PEG41-BV-9", stock: 18 },
                { size: "10", color: "Black/Volt", sku: "PEG41-BV-10", stock: 15 },
                { size: "10", color: "White/Fire Red", sku: "PEG41-WF-10", stock: 10 },
                { size: "11", color: "White/Fire Red", sku: "PEG41-WF-11", stock: 8 },
            ],
        },
        {
            name: "LeBron 21",
            slug: "lebron-21",
            description:
                "The LeBron 21 is built for the King's powerful game. Zoom Air cushioning provides responsive energy return, while the supportive upper keeps you locked in during quick cuts and explosive moves.",
            price: 200.0,
            categorySlug: "basketball",
            images: [
                "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop"
            ],
            variants: [
                { size: "9", color: "Purple/Gold", sku: "LB21-PG-9", stock: 8 },
                { size: "10", color: "Purple/Gold", sku: "LB21-PG-10", stock: 12 },
                { size: "11", color: "Purple/Gold", sku: "LB21-PG-11", stock: 10 },
                { size: "12", color: "Purple/Gold", sku: "LB21-PG-12", stock: 6 },
                { size: "10", color: "Black/Red", sku: "LB21-BR-10", stock: 14 },
            ],
        },
        {
            name: "Nike Dunk Low Retro",
            slug: "nike-dunk-low-retro",
            description:
                "Created for the hardwood but taken to the streets, the Nike Dunk Low returns with crisp overlays and original team colors. This basketball icon channels '80s vibes with classic hoops style.",
            price: 115.0,
            categorySlug: "lifestyle",
            images: [
                "https://images.unsplash.com/photo-1612902292637-c3a604e8b6b8?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=1000&auto=format&fit=crop"
            ],
            variants: [
                { size: "8", color: "Black/White", sku: "DUNK-PAN-8", stock: 22 },
                { size: "9", color: "Black/White", sku: "DUNK-PAN-9", stock: 28 },
                { size: "10", color: "Black/White", sku: "DUNK-PAN-10", stock: 25 },
                { size: "11", color: "Black/White", sku: "DUNK-PAN-11", stock: 18 },
                { size: "9", color: "University Blue", sku: "DUNK-UNC-9", stock: 12 },
                { size: "10", color: "University Blue", sku: "DUNK-UNC-10", stock: 10 },
            ],
        },
        {
            name: "Nike Metcon 9",
            slug: "nike-metcon-9",
            description:
                "Make every rep count. The Nike Metcon 9 is updated with a wider forefoot platform for more stability during weightlifting and high intensity training. The rubber tread pattern gives you grip where you need it most.",
            price: 150.0,
            categorySlug: "training",
            images: [
                "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop"
            ],
            variants: [
                { size: "8", color: "Black/White", sku: "MET9-BW-8", stock: 10 },
                { size: "9", color: "Black/White", sku: "MET9-BW-9", stock: 14 },
                { size: "10", color: "Black/White", sku: "MET9-BW-10", stock: 16 },
                { size: "11", color: "Black/White", sku: "MET9-BW-11", stock: 12 },
            ],
        },
    ];

    for (const productData of products) {
        const category = categories.find((c) => c.slug === productData.categorySlug);
        if (!category) continue;

        const product = await prisma.product.create({
            data: {
                name: productData.name,
                slug: productData.slug,
                description: productData.description,
                price: productData.price,
                images: productData.images,
                categoryId: category.id,
                variants: {
                    create: productData.variants,
                },
            },
        });

        console.log(`👟 Created product: ${product.name}`);
    }

    // Create a test user
    const testUser = await prisma.user.create({
        data: {
            email: "test@nike.com",
            name: "Test User",
            role: "user",
            password: await hash("password123", 12),
        },
    });

    console.log(`👤 Created test user: ${testUser.email}`);

    // Create an admin user
    const adminUser = await prisma.user.create({
        data: {
            email: "admin@nike.com",
            name: "Admin User",
            role: "admin",
            password: await hash("admin123", 12),
        },
    });

    console.log(`👤 Created admin user: ${adminUser.email}`);

    console.log("✅ Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
