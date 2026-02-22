const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (isValid) cb(null, true);
  else cb(new Error("Only images are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
