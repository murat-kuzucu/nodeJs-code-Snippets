const express = require("express");
const { validationResult } = require("express-validator");
const {
    createUserValidator,
    getUserValidator,
} = require("../middleware/validators/userValidator");

const router = express.Router();

router.post("/createUser", createUserValidator, (req, res, next) => {
    try {
        const { email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        console.log(email, password);
        res.send("User created successfully");
    } catch (error) {
        next(error);
    }
});

router.get("/getUser/:id", getUserValidator, (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        res.json({ id: Number(id), email: `user${id}@example.com` });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
