import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(path.resolve(), "backend", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (request, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const allowedExtensions = /jpeg|jpg|png|gif|webp|mp4|mov|webm|pdf|doc|docx|txt/;

const fileFilter = (request, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type"), false);
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, 
    fileFilter
});

export default upload;