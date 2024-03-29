const express = require("express");
const router = express.Router();
const check_Authentication = require("../middlewares/check-auth-adm");
const check_Authenticationemp = require("../middlewares/check-auth-emp");
const formController = require("../controllers/formController");

router.get(
  "/getactiveforms/:adminid",
  check_Authentication,
  formController.getactiveforms
);
router.get(
  "/getcompletedforms/:adminid",
  check_Authentication,
  formController.getcompletedforms
);
router.get(
  "/gettemplateforms",
  check_Authentication,
  formController.gettemplateforms
);
router.get(
  "/getcurrentform/:formid",
  check_Authenticationemp,
  formController.getcurrentform
);
router.post("/createforms", check_Authentication, formController.createforms);
router.post(
  "/createFromTemplate",
  check_Authentication,
  formController.createFromTemplate
);
router.post("/copyfield", check_Authentication, formController.copyfield);
router.put(
  "/updateformstatus",
  check_Authentication,
  formController.updateformstatus
);

router.put(
  "/updateeditstatus",
  check_Authentication,
  formController.updateeditstatus
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
router.put("/addnewfield", check_Authentication, formController.addnewfield);
router.delete("/deletefield", check_Authentication, formController.deletefield);
router.delete("/deleteform", check_Authentication, formController.deleteform);

module.exports = router;
