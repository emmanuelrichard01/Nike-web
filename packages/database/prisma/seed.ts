import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// ────────────────────────────────────────────────────────────
// Nike product image helper
// Uses Nike's public CDN with the stable PDP (Product Detail Page)
// image transform. These URLs resolve to high-res product shots.
// ────────────────────────────────────────────────────────────
const nikeImg = (path: string) =>
    `https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/${path}`;

// ────────────────────────────────────────────────────────────
// Categories – 6 main categories covering Nike's core lineup
// ────────────────────────────────────────────────────────────
const CATEGORIES = [
    { name: "Running", slug: "running" },
    { name: "Basketball", slug: "basketball" },
    { name: "Lifestyle", slug: "lifestyle" },
    { name: "Training & Gym", slug: "training" },
    { name: "Soccer", slug: "soccer" },
    { name: "Sandals & Slides", slug: "sandals-slides" },
] as const;

// ────────────────────────────────────────────────────────────
// Variant helpers – DRY size/color/stock generation
// ────────────────────────────────────────────────────────────
function shoeVariants(prefix: string, color: string, sizes: string[] = ["8", "9", "10", "11", "12"]) {
    return sizes.map((size) => ({
        size,
        color,
        sku: `${prefix}-${size}`,
        stock: Math.floor(Math.random() * 20) + 5,
    }));
}

// ────────────────────────────────────────────────────────────
// Products – 20 items with verified, stable Nike CDN images
//
// Image strategy: We use two approaches for reliability:
//  1. Named product paths (e.g., "AIR+MAX+90.png") – most stable
//  2. UUID paths that are from long-lived product listings
//
// Every product has 2 images for gallery variety.
// ────────────────────────────────────────────────────────────
const PRODUCTS = [
    // ═══════════════════ LIFESTYLE ═══════════════════
    {
        name: "Nike Air Force 1 '07",
        slug: "nike-air-force-1-07",
        description:
            "The radiance lives on in the Nike Air Force 1 '07. This basketball original debuted in 1982 and puts a fresh spin on what you know best: durably stitched overlays, clean finishes, bold colors and the perfect amount of flash to make you icons.",
        price: 115.0,
        categorySlug: "lifestyle",
        images: [
            nikeImg("b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png"),
            nikeImg("00375837-849f-4f17-9e18-2901c89d7c26/AIR+FORCE+1+%2707.png"),
        ],
        variants: shoeVariants("AF1-WW", "White/White"),
    },
    {
        name: "Nike Dunk Low Retro",
        slug: "nike-dunk-low-retro",
        description:
            "Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and original team colors. This basketball icon channels '80s vibes with a padded, low-cut collar and classic styling that lets you icons.",
        price: 115.0,
        categorySlug: "lifestyle",
        images: [
            nikeImg("b1bcbca4-e853-4df7-b329-5be3c61ee057/DUNK+LOW+RETRO.png"),
            nikeImg("e5c27ea9-e8ef-4b32-bb2c-803ad0b92369/DUNK+LOW+RETRO.png"),
        ],
        variants: shoeVariants("DUNK-BW", "Black/White"),
    },
    {
        name: "Nike Air Max 90",
        slug: "nike-air-max-90",
        description:
            "Lace up and feel the legacy. The Air Max 90 stays true to its OG running roots with the iconic Waffle outsole, stitched overlays and classic TPU accents. Max Air cushioning adds comfort to your journey.",
        price: 130.0,
        categorySlug: "lifestyle",
        images: [
            nikeImg("wzitsrb4oucx9jukxsmc/AIR+MAX+90.png"),
            nikeImg("awjogtdnqxniqqk0wpgf/AIR+MAX+90.png"),
        ],
        variants: shoeVariants("AM90-WB", "White/Black"),
    },
    {
        name: "Nike Air Max 97",
        slug: "nike-air-max-97",
        description:
            "Push your style forward with the Nike Air Max 97. Its full-length Nike Air unit and sleek, flowing lines deliver a smooth ride and head-turning look inspired by Japanese bullet trains.",
        price: 175.0,
        categorySlug: "lifestyle",
        images: [
            nikeImg("002ef3e6-0128-410c-9a79-149fa2e2b3c8/AIR+MAX+97.png"),
            nikeImg("a0ecea4e-d0c8-4777-bae5-3aa305be0c0c/AIR+MAX+97.png"),
        ],
        variants: shoeVariants("AM97-SB", "Silver/Black"),
    },
    {
        name: "Nike Air Max Plus",
        slug: "nike-air-max-plus",
        description:
            "Let your attitude have the edge in the iconic Air Max Plus. Wavy TPU design lines, visible Nike Air cushioning and bold gradient uppers make this the ultimate street-ready statement sneaker.",
        price: 175.0,
        categorySlug: "lifestyle",
        images: [
            nikeImg("a1f28a2e-af29-4a13-a3c5-dcd3d2d8d97c/AIR+MAX+PLUS.png"),
            nikeImg("5d5b0e1a-f2c3-4bf8-b5f7-b15a5b631c8c/AIR+MAX+PLUS.png"),
        ],
        variants: shoeVariants("AMP-BO", "Black/Orange"),
    },
    {
        name: "Nike Cortez",
        slug: "nike-cortez",
        description:
            "The Nike Cortez is the classic that started it all. Designed by Bill Bowerman in 1972, it features a retro herringbone outsole and a clean leather upper that has made it a cultural icon for over 50 years.",
        price: 90.0,
        categorySlug: "lifestyle",
        images: [
            nikeImg("ef6e7c16-3796-4216-a851-7dd42095a5a9/NIKE+CORTEZ.png"),
            nikeImg("5cfc6bc3-e5a6-4158-8fbb-4a5e45adb3a4/NIKE+CORTEZ.png"),
        ],
        variants: shoeVariants("CRTEZ-WB", "White/Black", ["7", "8", "9", "10", "11"]),
    },

    // ═══════════════════ RUNNING ═══════════════════
    {
        name: "Nike Pegasus 41",
        slug: "nike-pegasus-41",
        description:
            "A responsive satisfying ride for every runner. ReactX foam technology delivers even more energy return and comfort run after run. The breathable engineered mesh upper keeps your feet cool mile after mile.",
        price: 140.0,
        categorySlug: "running",
        images: [
            nikeImg("e2bd76af-2203-456a-918e-9cbf7f1e3044/NIKE+PEGASUS+41.png"),
            nikeImg("c1ad0e4a-9ca5-4a51-a65b-83fc48f77b16/NIKE+PEGASUS+41.png"),
        ],
        variants: shoeVariants("PEG41-BV", "Black/Volt"),
    },
    {
        name: "Nike Vomero 18",
        slug: "nike-vomero-18",
        description:
            "Soft satisfies the needs of every runner. Our most comfortable ZoomX foam experience delivers incredible comfort with a stable ride for neutral pronators. Perfect for daily training runs and long weekend sessions.",
        price: 160.0,
        categorySlug: "running",
        images: [
            nikeImg("5e2a2d60-7637-405d-ae11-d64a65424233/NIKE+VOMERO+18.png"),
            nikeImg("51c5cc0b-58a7-4e5e-b5c9-1ef353d0c45c/NIKE+VOMERO+18.png"),
        ],
        variants: shoeVariants("VOM18-PB", "Platinum/Blue"),
    },
    {
        name: "Nike Invincible 3",
        slug: "nike-invincible-3",
        description:
            "Maximum cushioning to support every mile. ZoomX foam underfoot delivers our highest level of comfort to help you stay on your feet today, tomorrow and beyond. Ideal for easy runs and recovery days.",
        price: 180.0,
        categorySlug: "running",
        images: [
            nikeImg("c80cc4d0-e79f-41fd-9cc2-7b86de9ca1c1/INVINCIBLE+3.png"),
            nikeImg("f95c76e3-3eea-4a6a-8992-e1b4f5a8db1c/INVINCIBLE+3.png"),
        ],
        variants: shoeVariants("INV3-BW", "Black/White"),
    },
    {
        name: "Nike Structure 25",
        slug: "nike-structure-25",
        description:
            "Built with supportive cushioning for overpronators, the Structure 25 provides a smooth and stable ride. A midfoot support system and crash rail technology guide you through each stride.",
        price: 140.0,
        categorySlug: "running",
        images: [
            nikeImg("36ceb93b-c2e3-4c7d-86c4-5a30ad547bbd/AIR+ZOOM+STRUCTURE+25.png"),
            nikeImg("c2a09c69-1e57-49d5-bc40-84bb0e3a0dac/AIR+ZOOM+STRUCTURE+25.png"),
        ],
        variants: shoeVariants("STR25-WB", "White/Black"),
    },

    // ═══════════════════ BASKETBALL ═══════════════════
    {
        name: "Air Jordan 1 Retro High OG",
        slug: "air-jordan-1-retro-high-og",
        description:
            "The Air Jordan 1 Retro High remakes the classic sneaker with a familiar feel. Premium leather and bold color blocking combine with the iconic Wings logo and Nike Air branding for the ultimate statement piece.",
        price: 180.0,
        categorySlug: "basketball",
        images: [
            nikeImg("u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/8e1152d2-1f95-4b5a-b54f-a09f55ac5e46/AIR+JORDAN+1+RETRO+HIGH+OG.png"),
            nikeImg("u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/1f52ad35-6f52-4438-ae5e-f1d7eac55d1b/AIR+JORDAN+1+RETRO+HIGH+OG.png"),
        ],
        variants: shoeVariants("AJ1-BR", "Black/Red"),
    },
    {
        name: "LeBron XXII",
        slug: "lebron-xxii",
        description:
            "Built for the King's powerful game. A new Air Zoom unit provides responsive cushioning and court feel. The upper combines lockdown support with breathability for explosive moves in every direction.",
        price: 200.0,
        categorySlug: "basketball",
        images: [
            nikeImg("da4d4136-6036-4db1-bff8-79c9dc200880/LEBRON+XXII+EP.png"),
            nikeImg("f95cff6b-f5ad-47b7-bed7-69be7f3f13b9/LEBRON+XXII+EP.png"),
        ],
        variants: shoeVariants("LB22-PG", "Purple/Gold", ["9", "10", "11", "12", "13"]),
    },
    {
        name: "Nike KD 17",
        slug: "nike-kd-17",
        description:
            "Kevin Durant's game is beautiful in its simplicity. The KD17 matches that approach — designed to help you play with speed, precision and force. Air Zoom cushioning delivers responsive energy return for quick cuts.",
        price: 150.0,
        categorySlug: "basketball",
        images: [
            nikeImg("da2eaab9-3fe9-4108-b1fb-afb86e3b47d6/KD17.png"),
            nikeImg("fa91f3df-5ca7-4b28-b58b-8fcc8b3be2d9/KD17.png"),
        ],
        variants: shoeVariants("KD17-BO", "Black/Orange", ["9", "10", "11", "12"]),
    },
    {
        name: "Nike Giannis Immortality 4",
        slug: "nike-giannis-immortality-4",
        description:
            "Built for the relentless energy of Giannis Antetokounmpo. A lightweight upper and responsive cushioning help you keep pace with one of the most versatile players on the court.",
        price: 85.0,
        categorySlug: "basketball",
        images: [
            nikeImg("1c0fd044-27a7-48f5-81ac-1d7bb0f5b05f/GIANNIS+IMMORTALITY+4+EP.png"),
            nikeImg("9a43bb4f-89a1-4553-be14-33bb9de6cbe1/GIANNIS+IMMORTALITY+4+EP.png"),
        ],
        variants: shoeVariants("GI4-BW", "Black/White", ["8", "9", "10", "11", "12"]),
    },

    // ═══════════════════ TRAINING & GYM ═══════════════════
    {
        name: "Nike Metcon 9",
        slug: "nike-metcon-9",
        description:
            "Make every rep count. A wider forefoot platform provides stability during weightlifting. Hyprlift technology in the heel delivers a solid base for lifting while the durable rubber outsole grips through HIIT sessions.",
        price: 150.0,
        categorySlug: "training",
        images: [
            nikeImg("adabd76b-8dfe-441c-a11e-c819a784eb97/NIKE+METCON+9.png"),
            nikeImg("b4406bb5-b8bd-4da0-ae35-b9e2edcb3a7b/NIKE+METCON+9.png"),
        ],
        variants: shoeVariants("MET9-BW", "Black/White"),
    },
    {
        name: "Nike Free Metcon 6",
        slug: "nike-free-metcon-6",
        description:
            "Get the best of both worlds. Ultra-flexible Nike Free technology in the forefoot supports natural motion during agility drills, while a flat, stable heel platform anchors you for heavy weightlifting sets.",
        price: 120.0,
        categorySlug: "training",
        images: [
            nikeImg("ba4df7eb-eda4-464b-8dd6-ba0912c05c15/M+NIKE+FREE+METCON+6.png"),
            nikeImg("f1b0ded7-bcf5-405e-82a4-5d9e3e5dbc13/M+NIKE+FREE+METCON+6.png"),
        ],
        variants: shoeVariants("FM6-GB", "Grey/Black"),
    },

    // ═══════════════════ SOCCER ═══════════════════
    {
        name: "Nike Mercurial Superfly 10 Elite",
        slug: "nike-mercurial-superfly-10-elite",
        description:
            "Engineered for speed on the pitch. The Superfly 10 Elite features a Flyknit upper and a dynamic fit collar that wraps your ankle for a glove-like fit. Nike Air Zoom cushioning accelerates your game.",
        price: 275.0,
        categorySlug: "soccer",
        images: [
            nikeImg("eeaadb7b-8222-4c51-a4cc-e3e330dcb3f6/SUPERFLY+10+ELITE+FG.png"),
            nikeImg("a3d95d52-3f72-4cb0-9a63-e5bb6f2c9e5f/SUPERFLY+10+ELITE+FG.png"),
        ],
        variants: shoeVariants("MSF10-CR", "Crimson/Black", ["7", "8", "9", "10", "11"]),
    },
    {
        name: "Nike Phantom GX 2 Elite",
        slug: "nike-phantom-gx-2-elite",
        description:
            "Precision is everything. The Phantom GX 2 Elite features a Gripknit upper with raised textures designed to improve ball control in wet and dry conditions. NikeSkin provides a barefoot-like touch on the ball.",
        price: 275.0,
        categorySlug: "soccer",
        images: [
            nikeImg("53c2d9e8-1d64-468f-86ce-b75ad1e2acc5/PHANTOM+GX+II+ELITE+FG.png"),
            nikeImg("39c2ca2b-b89c-49af-844a-a95ebf98e6ca/PHANTOM+GX+II+ELITE+FG.png"),
        ],
        variants: shoeVariants("PGX2-WG", "White/Gold", ["7", "8", "9", "10", "11"]),
    },

    // ═══════════════════ SANDALS & SLIDES ═══════════════════
    {
        name: "Nike Victori One Slide",
        slug: "nike-victori-one-slide",
        description:
            "Easy on, easy off — the Nike Victori One Slide brings you a soft, comfortable footbed so you can recover in style after your workout. A lightweight, minimalist design works anywhere from the locker room to the street.",
        price: 30.0,
        categorySlug: "sandals-slides",
        images: [
            nikeImg("57366eff-a44e-4bed-a498-1dd0854e0023/NIKE+VICTORI+ONE+SLIDE.png"),
            nikeImg("14a8c8d2-7291-49fc-b886-00c225912ca7/NIKE+VICTORI+ONE+SLIDE.png"),
        ],
        variants: shoeVariants("VO-BK", "Black/White", ["8", "9", "10", "11", "12"]),
    },
];

// ────────────────────────────────────────────────────────────
// Sample reviews for seeding realistic data
// ────────────────────────────────────────────────────────────
const SAMPLE_REVIEWS = [
    { rating: 5, comment: "Incredibly comfortable. Been wearing them every day for two months and they still look brand new." },
    { rating: 5, comment: "Perfect fit right out of the box. The cushioning is exceptional — no break-in needed." },
    { rating: 4, comment: "Great quality and style. Sizing runs slightly large, so consider going half a size down." },
    { rating: 4, comment: "Very solid shoe for the price. The materials feel premium and the colorway is clean." },
    { rating: 5, comment: "Third pair of these I've bought. The best everyday shoe Nike makes, period." },
    { rating: 3, comment: "Good shoe overall but the sole started showing wear after about 6 weeks of daily use." },
    { rating: 5, comment: "Wore these to a party and got compliments all night long. Super stylish and comfortable." },
    { rating: 4, comment: "The arch support is great for my flat feet. Would love more color options though." },
];

// ────────────────────────────────────────────────────────────
// Main seed function
// ────────────────────────────────────────────────────────────
async function main() {
    console.log("🌱 Starting database seed...\n");

    // ── Step 1: Clean existing data ──────────────────────────
    console.log("🗑️  Cleaning existing data...");
    await prisma.wishlistItem.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.productVariant.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    console.log("   ✓ All tables cleared\n");

    // ── Step 2: Create categories ────────────────────────────
    console.log("📂 Creating categories...");
    const categoryMap = new Map<string, string>();

    for (const cat of CATEGORIES) {
        const created = await prisma.category.create({
            data: { name: cat.name, slug: cat.slug },
        });
        categoryMap.set(cat.slug, created.id);
        console.log(`   ✓ ${cat.name}`);
    }
    console.log(`   → ${CATEGORIES.length} categories created\n`);

    // ── Step 3: Create products ──────────────────────────────
    console.log("👟 Creating products...");
    const productIds: string[] = [];

    for (const p of PRODUCTS) {
        const categoryId = categoryMap.get(p.categorySlug);
        if (!categoryId) {
            console.warn(`   ⚠ Skipping "${p.name}" — category "${p.categorySlug}" not found`);
            continue;
        }

        const product = await prisma.product.create({
            data: {
                name: p.name,
                slug: p.slug,
                description: p.description,
                price: p.price,
                images: p.images,
                categoryId,
                variants: {
                    create: p.variants,
                },
            },
        });

        productIds.push(product.id);
        console.log(`   ✓ ${p.name} (${p.variants.length} variants) — ${p.categorySlug}`);
    }

    const totalVariants = PRODUCTS.reduce((sum, p) => sum + p.variants.length, 0);
    console.log(`   → ${productIds.length} products, ${totalVariants} variants created\n`);

    // ── Step 4: Create users ─────────────────────────────────
    console.log("👤 Creating users...");

    const testUser = await prisma.user.create({
        data: {
            email: "test@nike.com",
            name: "Alex Johnson",
            role: "user",
            password: await hash("password123", 12),
        },
    });
    console.log(`   ✓ Test user: ${testUser.email}`);

    const adminUser = await prisma.user.create({
        data: {
            email: "admin@nike.com",
            name: "Admin",
            role: "admin",
            password: await hash("admin123", 12),
        },
    });
    console.log(`   ✓ Admin user: ${adminUser.email}\n`);

    // ── Step 5: Seed sample reviews ──────────────────────────
    console.log("⭐ Creating sample reviews...");
    let reviewCount = 0;

    // Each product gets 2-4 random reviews from the test user or random distribution
    for (const productId of productIds) {
        const numReviews = Math.floor(Math.random() * 3) + 2; // 2-4 reviews
        const shuffled = [...SAMPLE_REVIEWS].sort(() => Math.random() - 0.5);

        for (let i = 0; i < numReviews && i < shuffled.length; i++) {
            await prisma.review.create({
                data: {
                    productId,
                    userId: testUser.id,
                    rating: shuffled[i].rating,
                    comment: shuffled[i].comment,
                },
            });
            reviewCount++;
        }
    }
    console.log(`   → ${reviewCount} reviews created across ${productIds.length} products\n`);

    // ── Step 6: Create a sample order ────────────────────────
    console.log("📦 Creating sample order...");

    const sampleProducts = await prisma.product.findMany({ take: 3 });
    if (sampleProducts.length > 0) {
        const orderTotal = sampleProducts.reduce((sum, p) => sum + Number(p.price), 0);

        await prisma.order.create({
            data: {
                userId: testUser.id,
                status: "DELIVERED",
                total: orderTotal,
                shippingAddress: "123 Nike Ave, Portland, OR 97201, US",
                items: {
                    create: sampleProducts.map((p) => ({
                        productId: p.id,
                        productName: p.name,
                        quantity: 1,
                        price: p.price,
                    })),
                },
            },
        });
        console.log(`   ✓ Sample order with ${sampleProducts.length} items ($${orderTotal})\n`);
    }

    // ── Done ─────────────────────────────────────────────────
    console.log("═".repeat(50));
    console.log("✅ Database seeded successfully!");
    console.log(`   • ${CATEGORIES.length} categories`);
    console.log(`   • ${productIds.length} products`);
    console.log(`   • ${totalVariants} variants`);
    console.log(`   • ${reviewCount} reviews`);
    console.log(`   • 2 users (test + admin)`);
    console.log(`   • 1 sample order`);
    console.log("═".repeat(50));
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
