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

    // Create products with real Nike data and images
    const products = [
        {
            name: "Nike Air Max 90",
            slug: "nike-air-max-90",
            description:
                "Lace up and feel the legacy. Produced at the intersection of art, fashion, and culture, the Air Max 90 lets you Icons aren't made overnight. But with its iconic Waffle outsole, stitched overlays and classic TPU accents, this staple has stood the test of time.",
            price: 130.0,
            categorySlug: "lifestyle",
            images: [
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/wzitsrb4oucx9jukxsmc/AIR+MAX+90.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awjogtdnqxniqqk0wpgf/AIR+MAX+90.png"
            ],
            variants: [
                { size: "8", color: "White/Black", sku: "AM90-WB-8", stock: 15 },
                { size: "9", color: "White/Black", sku: "AM90-WB-9", stock: 20 },
                { size: "10", color: "White/Black", sku: "AM90-WB-10", stock: 18 },
                { size: "11", color: "White/Black", sku: "AM90-WB-11", stock: 12 },
                { size: "12", color: "White/Black", sku: "AM90-WB-12", stock: 10 },
            ],
        },
        {
            name: "Nike Air Force 1 '07",
            slug: "nike-air-force-1-07",
            description:
                "The radiance lives on in the Nike Air Force 1 '07. This basketball original debuted in 1982 and puts a fresh spin on what you know best: durably stitched overlays, clean finishes, bold colors and the perfect amount of flash to make you icons.",
            price: 115.0,
            categorySlug: "lifestyle",
            images: [
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/00375837-849f-4f17-9e18-2901c89d7c26/AIR+FORCE+1+%2707.png"
            ],
            variants: [
                { size: "8", color: "White/White", sku: "AF1-WW-8", stock: 25 },
                { size: "9", color: "White/White", sku: "AF1-WW-9", stock: 30 },
                { size: "10", color: "White/White", sku: "AF1-WW-10", stock: 28 },
                { size: "11", color: "White/White", sku: "AF1-WW-11", stock: 20 },
                { size: "12", color: "White/White", sku: "AF1-WW-12", stock: 15 },
            ],
        },
        {
            name: "Nike Dunk Low Retro",
            slug: "nike-dunk-low-retro",
            description:
                "Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and original team colors. This basketball icon channels '80s vibes with its padded, low-cut collar and classic styling.",
            price: 115.0,
            categorySlug: "lifestyle",
            images: [
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/DUNK+LOW+RETRO.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e5c27ea9-e8ef-4b32-bb2c-803ad0b92369/DUNK+LOW+RETRO.png"
            ],
            variants: [
                { size: "8", color: "Black/White", sku: "DUNK-BW-8", stock: 22 },
                { size: "9", color: "Black/White", sku: "DUNK-BW-9", stock: 28 },
                { size: "10", color: "Black/White", sku: "DUNK-BW-10", stock: 25 },
                { size: "11", color: "Black/White", sku: "DUNK-BW-11", stock: 18 },
            ],
        },
        {
            name: "Air Jordan 1 Retro High OG",
            slug: "air-jordan-1-retro-high-og",
            description:
                "The Air Jordan 1 Retro High remakes the classic sneaker, giving you a fresh look with a familiar feel. Premium leather and bold colors combine with the iconic Wings logo and Nike Air branding for the ultimate statement.",
            price: 180.0,
            categorySlug: "lifestyle",
            images: [
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/8e1152d2-1f95-4b5a-b54f-a09f55ac5e46/AIR+JORDAN+1+RETRO+HIGH+OG.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/1f52ad35-6f52-4438-ae5e-f1d7eac55d1b/AIR+JORDAN+1+RETRO+HIGH+OG.png"
            ],
            variants: [
                { size: "8", color: "Black/Red", sku: "AJ1-BR-8", stock: 10 },
                { size: "9", color: "Black/Red", sku: "AJ1-BR-9", stock: 15 },
                { size: "10", color: "Black/Red", sku: "AJ1-BR-10", stock: 12 },
                { size: "11", color: "Black/Red", sku: "AJ1-BR-11", stock: 8 },
                { size: "12", color: "Black/Red", sku: "AJ1-BR-12", stock: 6 },
            ],
        },
        {
            name: "Nike Pegasus 41",
            slug: "nike-pegasus-41",
            description:
                "Responsive satisfies the needs of every runner. The Nike Pegasus 41 delivers that feeling with ReactX foam technology for even more energy return and comfort. A breathable engineered mesh upper keeps your feet cool mile after mile.",
            price: 140.0,
            categorySlug: "running",
            images: [
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e2bd76af-2203-456a-918e-9cbf7f1e3044/NIKE+PEGASUS+41.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c1ad0e4a-9ca5-4a51-a65b-83fc48f77b16/NIKE+PEGASUS+41.png"
            ],
            variants: [
                { size: "8", color: "Black/Volt", sku: "PEG41-BV-8", stock: 12 },
                { size: "9", color: "Black/Volt", sku: "PEG41-BV-9", stock: 18 },
                { size: "10", color: "Black/Volt", sku: "PEG41-BV-10", stock: 15 },
                { size: "11", color: "Black/Volt", sku: "PEG41-BV-11", stock: 10 },
            ],
        },
        {
            name: "Nike Vomero 18",
            slug: "nike-vomero-18",
            description:
                "Soft satisfies the needs of every runner. The Nike Vomero 18 delivers that feeling with our most comfortable ZoomX foam experience yet. The plush design provides incredible comfort with a stable ride for neutral pronators.",
            price: 160.0,
            categorySlug: "running",
            images: [
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5e2a2d60-7637-405d-ae11-d64a65424233/NIKE+VOMERO+18.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/51c5cc0b-58a7-4e5e-b5c9-1ef353d0c45c/NIKE+VOMERO+18.png"
            ],
            variants: [
                { size: "8", color: "Platinum/Blue", sku: "VOM18-PB-8", stock: 14 },
                { size: "9", color: "Platinum/Blue", sku: "VOM18-PB-9", stock: 20 },
                { size: "10", color: "Platinum/Blue", sku: "VOM18-PB-10", stock: 16 },
                { size: "11", color: "Platinum/Blue", sku: "VOM18-PB-11", stock: 12 },
            ],
        },
        {
            name: "LeBron XXII",
            slug: "lebron-xxii",
            description:
                "The LeBron XXII is built for the King's powerful game. With a new Air Zoom unit, this basketball shoe provides responsive cushioning and court feel. The upper combines lockdown support with breathability for explosive moves.",
            price: 200.0,
            categorySlug: "basketball",
            images: [
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/da4d4136-6036-4db1-bff8-79c9dc200880/LEBRON+XXII+EP.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f95cff6b-f5ad-47b7-bed7-69be7f3f13b9/LEBRON+XXII+EP.png"
            ],
            variants: [
                { size: "9", color: "Purple/Gold", sku: "LB22-PG-9", stock: 8 },
                { size: "10", color: "Purple/Gold", sku: "LB22-PG-10", stock: 12 },
                { size: "11", color: "Purple/Gold", sku: "LB22-PG-11", stock: 10 },
                { size: "12", color: "Purple/Gold", sku: "LB22-PG-12", stock: 6 },
            ],
        },
        {
            name: "Nike KD 17",
            slug: "nike-kd-17",
            description:
                "Kevin Durant's game is beautiful in its simplicity. The KD17 is built to match—designed to help you play with speed, precision and force. Air Zoom cushioning provides responsive energy return for quick cuts and jumps.",
            price: 150.0,
            categorySlug: "basketball",
            images: [
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/da2eaab9-3fe9-4108-b1fb-afb86e3b47d6/KD17.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fa91f3df-5ca7-4b28-b58b-8fcc8b3be2d9/KD17.png"
            ],
            variants: [
                { size: "9", color: "Black/Orange", sku: "KD17-BO-9", stock: 10 },
                { size: "10", color: "Black/Orange", sku: "KD17-BO-10", stock: 14 },
                { size: "11", color: "Black/Orange", sku: "KD17-BO-11", stock: 12 },
                { size: "12", color: "Black/Orange", sku: "KD17-BO-12", stock: 8 },
            ],
        },
        {
            name: "Nike Metcon 9",
            slug: "nike-metcon-9",
            description:
                "Make every rep count. The Nike Metcon 9 is updated with a wider forefoot platform for more stability during weightlifting and high-intensity training. Hyprlift technology in the heel provides a stable base for lifting.",
            price: 150.0,
            categorySlug: "training",
            images: [
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/adabd76b-8dfe-441c-a11e-c819a784eb97/NIKE+METCON+9.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b4406bb5-b8bd-4da0-ae35-b9e2edcb3a7b/NIKE+METCON+9.png"
            ],
            variants: [
                { size: "8", color: "Black/White", sku: "MET9-BW-8", stock: 10 },
                { size: "9", color: "Black/White", sku: "MET9-BW-9", stock: 14 },
                { size: "10", color: "Black/White", sku: "MET9-BW-10", stock: 16 },
                { size: "11", color: "Black/White", sku: "MET9-BW-11", stock: 12 },
            ],
        },
        {
            name: "Nike Free Metcon 6",
            slug: "nike-free-metcon-6",
            description:
                "Get the best of both with the Nike Free Metcon 6. Updated with ultra-flexible Nike Free technology in the forefoot for natural motion during agility drills, while a flat, stable heel supports you for weightlifting.",
            price: 120.0,
            categorySlug: "training",
            images: [
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ba4df7eb-eda4-464b-8dd6-ba0912c05c15/M+NIKE+FREE+METCON+6.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f1b0ded7-bcf5-405e-82a4-5d9e3e5dbc13/M+NIKE+FREE+METCON+6.png"
            ],
            variants: [
                { size: "8", color: "Grey/Black", sku: "FM6-GB-8", stock: 12 },
                { size: "9", color: "Grey/Black", sku: "FM6-GB-9", stock: 18 },
                { size: "10", color: "Grey/Black", sku: "FM6-GB-10", stock: 15 },
                { size: "11", color: "Grey/Black", sku: "FM6-GB-11", stock: 10 },
            ],
        },
        {
            name: "Nike Invincible 3",
            slug: "nike-invincible-3",
            description:
                "With maximum cushioning to support every mile, the Invincible 3 gives you our highest level of comfort underfoot to help you stay on your feet today, tomorrow and beyond. Ideal for easy runs and recovery days.",
            price: 180.0,
            categorySlug: "running",
            images: [
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c80cc4d0-e79f-41fd-9cc2-7b86de9ca1c1/INVINCIBLE+3.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f95c76e3-3eea-4a6a-8992-e1b4f5a8db1c/INVINCIBLE+3.png"
            ],
            variants: [
                { size: "8", color: "Black/White", sku: "INV3-BW-8", stock: 10 },
                { size: "9", color: "Black/White", sku: "INV3-BW-9", stock: 15 },
                { size: "10", color: "Black/White", sku: "INV3-BW-10", stock: 12 },
                { size: "11", color: "Black/White", sku: "INV3-BW-11", stock: 8 },
            ],
        },
        {
            name: "Nike Air Max Plus",
            slug: "nike-air-max-plus",
            description:
                "Let your attitude have the edge in the iconic Air Max Plus. This street-style staple features wavy TPU design lines, visible Nike Air cushioning and bold color combos that are instantly recognizable.",
            price: 175.0,
            categorySlug: "lifestyle",
            images: [
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a1f28a2e-af29-4a13-a3c5-dcd3d2d8d97c/AIR+MAX+PLUS.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5d5b0e1a-f2c3-4bf8-b5f7-b15a5b631c8c/AIR+MAX+PLUS.png"
            ],
            variants: [
                { size: "8", color: "Black/Orange", sku: "AMP-BO-8", stock: 14 },
                { size: "9", color: "Black/Orange", sku: "AMP-BO-9", stock: 20 },
                { size: "10", color: "Black/Orange", sku: "AMP-BO-10", stock: 18 },
                { size: "11", color: "Black/Orange", sku: "AMP-BO-11", stock: 12 },
                { size: "12", color: "Black/Orange", sku: "AMP-BO-12", stock: 8 },
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
