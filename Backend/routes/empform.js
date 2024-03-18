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
router.post(
  "/saveresponse",
  check_Authentication,
  empformController.saveresponse
);
// router.get(
//   "/getcompletedforms/:adminid",
//   check_Authentication,
//   formController.getcompletedforms
// );
// router.get(
//   "/gettemplateforms",
//   check_Authentication,
//   formController.gettemplateforms
// );


module.exports = router;
