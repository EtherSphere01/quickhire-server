import app from "./app";
import config from "./config";

const server = app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});

server.on("error", (error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
