import multer from "multer";// it supports multiformat data
import path from "path";//it helps build file system paths safely across operating systems
import fs from "fs";// let me create file directly

const uploadDir = path.join(path.resolve(), "backend", "uploads");//path.resolve() with no arguments return my project's current working directory here nodemon is rrot dir
                                                                  //path.join safely combines that with "backend" and "uploads" into one full path

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });//cheaks if that folder already exists,if not create and it can create some missing parent folder
}

const storage = multer.diskStorage({//multer.diskStorage configures how and where multer saves uploaded files,The destination function tells multer which folder to save into — here, always uploadDir
    destination: (request, file, cb) => {
        cb(null, uploadDir);//if gets the file just upload and save into uploaddir if error then return null
    },
    filename: (request, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;//Date.now() — current timestamp in ms,here math.round helps for different naming of files if its an  exact ms,path.extname(file.originalname) — extracts just the file extension from the original name 
        cb(null, uniqueName);
    }
});

const allowedExtensions = /jpeg|jpg|png|gif|webp|mp4|mov|webm|pdf|doc|docx|txt/;

const fileFilter = (request, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();//just takes the og file extension and make it lowercase
    if (allowedExtensions.test(ext)) {//if the extension is allowed then return true
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type"), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, 
    fileFilter
});

export default upload;