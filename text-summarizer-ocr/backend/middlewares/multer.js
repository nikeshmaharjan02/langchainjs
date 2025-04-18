import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/'); // Make sure this folder exists
      },
      filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname); // Unique filename
      },
});

const upload = multer({storage})

export default upload
