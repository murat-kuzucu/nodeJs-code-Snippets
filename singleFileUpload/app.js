const path = require("path");
const express = require("express");
const app = express();
const singleFileUpload = require("./singleFileUpload"); //singleFileUpload is the function that uploads the files
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //serve uploaded files
app.use(router);

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html")); //serve upload form
});

router.post("/upload", (req, res) => {
    //upload is the route for uploading the files
    singleFileUpload(req, res, (err) => {
        //singleFileUpload is the function that uploads the files
        if (err) {
            res.status(500).send(err.message); //if there is an error, send the error message
        } else if (!req.file) {
            res.status(400).send("No file uploaded");
        } else {
            res.json({
                filename: req.file.filename,
                path: `/uploads/${req.file.filename}`,
            }); //return basic file meta
        }
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
