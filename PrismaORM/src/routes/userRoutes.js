const express = require("express");
const {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getUsers,
} = require("../services/userService");

const router = express.Router();

const parseId = (value) => {
    const id = Number(value);
    if (Number.isNaN(id)) {
        throw new Error("Invalid user id.");
    }
    return id;
};

router.post("/", async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/", async (_req, res) => {
    const users = await getUsers();
    res.json(users);
});

router.get("/:id", async (req, res) => {
    try {
        const id = parseId(req.params.id);
        const user = await getUser(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch("/update/:id", async (req, res) => {
    try {
        const id = parseId(req.params.id);
        const user = await updateUser(id, req.body);
        res.json(user);
    } catch (error) {
        const status = error.message.includes("not found") ? 404 : 400;
        res.status(status).json({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const id = parseId(req.params.id);
        await deleteUser(id);
        res.status(204).send();
    } catch (error) {
        const status = error.message.includes("not found") ? 404 : 400;
        res.status(status).json({ message: error.message });
    }
});

module.exports = router;

