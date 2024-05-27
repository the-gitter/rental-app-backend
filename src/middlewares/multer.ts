import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(
      null,
      file.originalname.split(" ").join("-") +
        "-" +
        Date.now() +
        "." +
        extension
    );
  },
});

const multerMiddleware = multer({ storage: storage });

export default multerMiddleware;
