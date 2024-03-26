const express = require("express");
const router = express.Router();
const check_Authentication = require("../middlewares/check-auth-adm");
const {signupadm} = require("../controllers/adminController");


router.post("/signupadm", signupadm);

module.exports = router;
