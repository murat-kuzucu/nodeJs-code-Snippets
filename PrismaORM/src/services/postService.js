const { prisma } = require("../config/prisma");

const sanitizePostData = ({ title, content, userId }) => {
    const data = {};

    if (title !== undefined) {
        data.title = title;
    }

    if (content !== undefined) {
        data.content = content;
    }

    if (userId !== undefined) {
        data.user =
            userId === null
                ? { disconnect: true }
                : { connect: { id: userId } };
    }

    return data;
};

const createPost = async ({ title, content, userId = null }) => {
    if (!title || !content) {
        throw new Error("Missing required post fields.");
    }

    const data = {
        title,
        content,
    };

    if (userId !== null && userId !== undefined) {
        data.user = {
            connect: { id: userId },
        };
    }

    return prisma.post.create({
        data,
        include: {
            user: true,
        },
    });
};

const getPost = async (id) => {
    return prisma.post.findUnique({
        where: { id },
        include: { user: true },
    });
};

const getPosts = async () => {
    return prisma.post.findMany({
        include: { user: true },
    });
};

const updatePost = async (id, updates = {}) => {
    const data = sanitizePostData(updates);

    if (!Object.keys(data).length) {
        throw new Error("No post fields provided to update.");
    }

    try {
        return await prisma.post.update({
            where: { id },
            data,
            include: { user: true },
        });
    } catch (error) {
        if (error.code === "P2025") {
            throw new Error(`Post with id ${id} not found.`);
        }
        throw error;
    }
};

const deletePost = async (id) => {
    try {
        return await prisma.post.delete({
            where: { id },
        });
    } catch (error) {
        if (error.code === "P2025") {
            throw new Error(`Post with id ${id} not found.`);
        }
        throw error;
    }
};

module.exports = {
    createPost,
    getPost,
    getPosts,
    updatePost,
    deletePost,
};
