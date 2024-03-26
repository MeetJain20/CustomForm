
const express = require("express");
const multer = require("multer");
 
const router = express.Router();
 
const fileController = require("../controllers/fileController");
 
 
// upload image to aws
const storage = multer.memoryStorage({});
 
const upload = multer({
  storage: storage,
});
 
router.post("/uploadFileToS3", upload.single("file"), fileController.uploadFileToS3);
 
module.exports = router;