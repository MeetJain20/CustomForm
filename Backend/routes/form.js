const express = require("express");
const router = express.Router();
const check_Authentication = require("../middlewares/check-auth-adm");

const formController = require("../controllers/formController");

router.get(
  "/getactiveforms",
  check_Authentication,
  formController.getactiveforms
);
router.get(
  "/getcompletedforms",
  check_Authentication,
  formController.getcompletedforms
);
router.get(
  "/gettemplateforms",
  check_Authentication,
  formController.gettemplateforms
);
router.post(
  "/getcurrentform",
  check_Authentication,
  formController.getcurrentform
);
router.post("/createforms", check_Authentication, formController.createforms);
router.post("/copyfield", check_Authentication, formController.copyfield);
router.put(
  "/updateformstatus",
  check_Authentication,
  formController.updateformstatus
);
router.put(
  "/updatetemplatestatus",
  check_Authentication,
  formController.updatetemplatestatus
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
router.delete("/deletefield", check_Authentication, formController.deletefield);

module.exports = router;