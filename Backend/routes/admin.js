const express = require("express");
const router = express.Router();
const check_Authentication = require("../middlewares/check-auth-adm");

const {signupadm} = require("../controllers/adminController");
// const singleUpload = require("../middlewares/multer");

router.post("/signupadm", signupadm);
// router.post("/login", adminController.login);
// router.post("/details", adminController.details);
// router.post("/updateProfile", adminController.updateProfile);
// router.post("/updateProfilePicture", singleUpload, adminController.updateProfilePicture);
module.exports = router;
