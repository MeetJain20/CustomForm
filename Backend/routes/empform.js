const express = require("express");
const router = express.Router();
const check_Authentication = require("../middlewares/check-auth-emp");
const empformController = require("../controllers/empformController");

router.get(
  "/getresponses/:formid",
  check_Authentication,
  empformController.getresponses
);
router.get(
  "/getassignedforms/:empid",
  check_Authentication,
  empformController.getassignedforms
);
router.get(
  "/getsubmittedforms/:empid",
  check_Authentication,
  empformController.getsubmittedforms
);
router.post(
  "/saveresponse",
  check_Authentication,
  empformController.saveresponse
);


module.exports = router;
