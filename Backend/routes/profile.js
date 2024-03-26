
const express = require("express");
const router = express.Router();
const check_Authentication1 = require("../middlewares/check-auth-adm");
const check_Authentication = require("../middlewares/check-auth-emp");
const profileController = require("../controllers/profileController");

router.get("/getadmprofiledetails/:userid",check_Authentication1, profileController.getadmprofiledetails);
router.get("/getempprofiledetails/:userid",check_Authentication, profileController.getempprofiledetails);
router.put("/updateadmprofiledetails",check_Authentication1, profileController.updateadmprofiledetails);
router.put("/updateempprofiledetails",check_Authentication, profileController.updateempprofiledetails);

module.exports = router;

