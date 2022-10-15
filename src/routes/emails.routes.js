const { Router } = require("express");
const { sendEmail } = require("../controllers/emails.controller");

const router = Router();

router.post("/sendEmail", sendEmail);

module.exports = router;
