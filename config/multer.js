import multer from "multer";
import path from "path";

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/imoveis");
    },

    filename: (req, file, cb) => {

        const nome = Date.now() + path.extname(file.originalname);

        cb(null, nome);
    }
});

const upload = multer({
    storage
});

export default upload;