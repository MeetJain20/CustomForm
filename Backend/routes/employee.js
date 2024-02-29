const express = require("express");
const router = express.Router();
const check_Authentication = require("../middlewares/check-auth");

const employeeController = require("../controllers/employeeController");
// const singleUpload = require("../middlewares/multer");

router.post("/signupemp", employeeController.signupemp);
router.get("/getteamnames", employeeController.getteamnames);
router.post("/login", employeeController.login);
// router.post("/details", adminController.details);
// router.post("/updateProfile", adminController.updateProfile);
// router.post("/updateProfilePicture", singleUpload, adminController.updateProfilePicture);
module.exports = router;
