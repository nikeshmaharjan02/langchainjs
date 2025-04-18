import multer from 'multer'

const storage = multer.diskStorage({
      filename: function(req,file,callback){
        callback(null,file.originalname)
      },
});

// Validate audio file types (e.g., MP3, WAV, MP4)
const fileFilter = (req, file, cb) => {
  console.log('Uploaded file MIME type:', file.mimetype);  // Log MIME type
  
  const allowedTypes = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/x-m4a"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Accept the file
  } else {
    cb(new Error("Invalid file type. Only audio files are allowed."), false);  // Reject the file
  }
};
export const upload = multer({ storage, fileFilter })


