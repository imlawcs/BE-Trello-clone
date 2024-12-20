import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); 
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]; 
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    }
});

export const upload = multer({
    storage: multerStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 
    }
});
