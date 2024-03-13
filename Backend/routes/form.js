const express = require("express");
const router = express.Router();
const check_Authentication = require("../middlewares/check-auth-adm");

const formController = require("../controllers/formController");

router.get(
  "/getactiveforms",
  check_Authentication,
  formController.getactiveforms
);
router.post(
  "/getcurrentform",
  check_Authentication,
  formController.getcurrentform
);
router.get(
  "/getcompletedforms",
  check_Authentication,
  formController.getcompletedforms
);
router.put(
  "/updateformstatus",
  check_Authentication,
  formController.updateformstatus
);
router.put(
  "/updateformtitle",
  check_Authentication,
  formController.updateformtitle
);
router.put(
  "/updateformdesc",
  check_Authentication,
  formController.updateformdesc
);
router.put(
  "/updateformfields",
  check_Authentication,
  formController.updateformfields
);
router.post("/copyfield", check_Authentication, formController.copyfield);
router.delete("/deletefield", check_Authentication, formController.deletefield);
router.post("/createforms", check_Authentication, formController.createforms);

module.exports = router;
