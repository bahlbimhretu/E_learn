import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter
function checkFileType(file, cb) {
  const allowedTypes = /pdf|mp4|mov|avi|jpg|jpeg|png|ppt|pptx|docx|txt/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    return cb(null, true);
  } else {
    cb("Error: File type not supported");
  }
}

export const upload = multer({
  storage
});



