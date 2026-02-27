import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "./config";

const prisma = new PrismaClient();

const seedAdmin = async () => {
    const adminEmail = "admin@gmail.com";

    const existingAdmin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
    });

    if (existingAdmin) {
        console.log(`Admin already exists: ${existingAdmin.email}`);
        return;
    }

    const hashedPassword = await bcrypt.hash("123456", config.saltRounds);

    const admin = await prisma.user.create({
        data: {
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    console.log(`Admin seeded successfully: ${admin.email}`);
};

const main = async () => {
    try {
        await seedAdmin();
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

main();
