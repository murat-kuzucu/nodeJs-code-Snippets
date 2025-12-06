const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
    errorFormat: "pretty",
    datasourceUrl: process.env.DATABASE_URL,
    schema: "prisma/schema.prisma",
});

const connectToDb = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to database");
    } catch (error) {
        console.error("Error connecting to database:", error);
        throw error;
    }
};

const disconnectFromDb = async () => {
    try {
        await prisma.$disconnect();
        console.log("Disconnected from database");
    } catch (error) {
        console.error("Error disconnecting from database:", error);
    }
};

module.exports = {
    prisma,
    connectToDb,
    disconnectFromDb,
};

