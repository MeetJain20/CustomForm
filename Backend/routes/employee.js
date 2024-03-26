const express = require("express");
const router = express.Router();
const check_Authentication = require("../middlewares/check-auth-emp");
const employeeController = require("../controllers/employeeController");

router.post("/signupemp", employeeController.signupemp);
router.get("/getteamnames", employeeController.getteamnames);
router.post("/login", employeeController.login);

module.exports = router;
