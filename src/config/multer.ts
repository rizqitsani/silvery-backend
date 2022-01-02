import path from 'path';
import multer from 'multer';

const imageStorage = multer.diskStorage({
  destination: 'uploads/images',
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 2000000, // 2 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error('Please upload a Image'));
    }
    return cb(null, true);
  },
});

export { imageUpload };
