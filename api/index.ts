import app from "../src/app";
import { seedAdmin, seedJobs } from "../src/seed";

let seeded = false;
const ensureSeeded = async () => {
    if (seeded) return;
    try {
        await seedAdmin();
        await seedJobs();
        seeded = true;
    } catch (error) {
        console.error("Seed failed:", error);
    }
};

const handler = async (req: any, res: any) => {
    await ensureSeeded();
    return app(req, res);
};

export default handler;
