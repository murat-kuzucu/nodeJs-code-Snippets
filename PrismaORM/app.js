const express = require("express");
const { connectToDb, disconnectFromDb } = require("./src/config/prisma");
const userRoutes = require("./src/routes/userRoutes");
const postRoutes = require("./src/routes/postRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

const startServer = async () => {
    try {
        await connectToDb();
        app.listen(PORT, () =>
            console.log(`Server running on http://localhost:${PORT}`)
        );
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

const shutdown = async () => {
    await disconnectFromDb();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();

module.exports = app;
