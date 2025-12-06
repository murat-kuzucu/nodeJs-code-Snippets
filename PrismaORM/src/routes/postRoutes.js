const express = require("express");
const {
    createPost,
    getPost,
    getPosts,
    updatePost,
    deletePost,
} = require("../services/postService");

const router = express.Router();

const parseId = (value) => {
    const id = Number(value);
    if (Number.isNaN(id)) {
        throw new Error("Invalid post id.");
    }
    return id;
};

router.post("/", async (req, res) => {
    try {
        const post = await createPost(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/", async (_req, res) => {
    const posts = await getPosts();
    res.json(posts);
});

router.get("/:id", async (req, res) => {
    try {
        const id = parseId(req.params.id);
        const post = await getPost(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }
        res.json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch("/update/:id", async (req, res) => {
    try {
        const id = parseId(req.params.id);
        const post = await updatePost(id, req.body);
        res.json(post);
    } catch (error) {
        const status = error.message.includes("not found") ? 404 : 400;
        res.status(status).json({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const id = parseId(req.params.id);
        await deletePost(id);
        res.status(204).send();
    } catch (error) {
        const status = error.message.includes("not found") ? 404 : 400;
        res.status(status).json({ message: error.message });
    }
});

module.exports = router;
