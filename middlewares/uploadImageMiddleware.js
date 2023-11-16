const multer = require("multer");

const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (imageField) => {
  const storage = multer.memoryStorage();

  const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400), false);
    }
  };

  const upload = multer({ storage, fileFilter: imageFilter });

  return upload.single(imageField);
};

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/categories");
//   },
//   filename: (req, file, cb) => {
//     console.log(file);
//     const uniqueSuffix = Math.round(Math.random() * 1e9);
//     const filename = `category-${Date.now()}-${uniqueSuffix}.${
//       file.mimetype.split("/")[1]
//     }`;
//     console.log(filename);
//     console.log(file.originalname);
//     cb(null, filename);
//   },
// });
