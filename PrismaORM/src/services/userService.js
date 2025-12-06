const { prisma } = require("../config/prisma");

const sanitizeUserData = ({ name, email, password, role }) => {
    return Object.fromEntries(
        Object.entries({ name, email, password, role }).filter(
            ([, value]) => value !== undefined
        )
    );
};

const createUser = async ({ name, email, password, role = "USER" }) => {
    if (!name || !email || !password) {
        throw new Error("Missing required user fields.");
    }

    return prisma.user.create({
        data: { name, email, password, role },
    });
};

const updateUser = async (id, updates = {}) => {
    const data = sanitizeUserData(updates);
    if (!Object.keys(data).length) {
        throw new Error("No user fields provided to update.");
    }

    try {
        return await prisma.user.update({
            where: { id },
            data,
        });
    } catch (error) {
        if (error.code === "P2025") {
            throw new Error(`User with id ${id} not found.`);
        }
        throw error;
    }
};

const deleteUser = async (id) => {
    try {
        return await prisma.$transaction(async (tx) => {
            await tx.post.updateMany({
                where: { userId: id },
                data: { userId: null },
            });
            return tx.user.delete({ where: { id } });
        });
    } catch (error) {
        if (error.code === "P2025") {
            throw new Error(`User with id ${id} not found.`);
        }
        throw error;
    }
};

const getUser = async (id) => {
    return prisma.user.findUnique({
        where: { id },
        include: { posts: true },
    });
};

const getUsers = async () => {
    return prisma.user.findMany({
        include: { posts: true },
    });
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getUsers,
};

