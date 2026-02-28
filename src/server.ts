import app from "./app";
import config from "./config";
import { seedAdmin, seedJobs } from "./seed";

const server = app.listen(config.port, async () => {
    console.log(`Server is running on http://localhost:${config.port}`);
    try {
        await seedAdmin();
        await seedJobs();
    } catch (error) {
        console.error("Seed failed:", error);
    }
});

server.on("error", (error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
