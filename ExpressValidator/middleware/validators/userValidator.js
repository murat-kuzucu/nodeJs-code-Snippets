const { body, param } = require("express-validator");

// Validation chain for user creation payloads.
const createUserValidator = [
    body("email").isEmail().withMessage("Please provide a valid email address"),
    body("password")
        .isLength({ min: 8, max: 32 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one symbol"),
];

const getUserValidator = [
    param("id")
        .notEmpty()
        .withMessage("User id is required")
        .isInt({ min: 1 })
        .withMessage("User id must be a positive integer"),
];

module.exports = {
    createUserValidator,
    getUserValidator,
};
