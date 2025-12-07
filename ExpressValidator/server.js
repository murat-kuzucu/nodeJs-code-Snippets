const express = require("express");
const app = express();
const userRouter = require("./routes/userRouter");

app.use(express.json());
app.use(userRouter);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Centralized error handler to avoid leaking stack traces to clients.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});
