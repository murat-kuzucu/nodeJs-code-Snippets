const fs = require("fs");
const path = require("path");
const multer = require("multer"); //multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.

const uploadsDir = path.join(__dirname, "uploads"); //uploads is the directory where the files will be stored
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); //ensure target directory exists
}

const fileFilter = (req, file, cb) => {
    //filefilter is a function that filters the files based on the mimetype
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};
const storage = multer.diskStorage({
    //storage is a function that stores the files in the disk
    destination: (req, file, cb) => {
        //destination is a function that stores the files in the disk
        cb(null, uploadsDir); //uploads is the directory where the files will be stored
    },
    filename: (req, file, cb) => {
        //filename is a function that stores the files in the disk
        cb(null, Date.now() + "-" + file.originalname); //Date.now() is the current date and time
    },
});

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
    "file"
); //upload is a function that uploads the files to the disk

module.exports = upload; //exports the upload function to be used in the app.js file

