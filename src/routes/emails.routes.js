const { Router } = require("express");
const {
  sendEmail,
  addEmailToQueue,
  addListEmailsToQueue,
  dispatchEmails,
  addEmailsToQueueFromCsv,
} = require("../app/controllers/emails.controller");

const router = Router();

router.post("/sendEmail", sendEmail);
router.post("/addEmailToQueue", addEmailToQueue);
router.post("/addListEmailsToQueue", addListEmailsToQueue);
router.post("/dispatchEmails", dispatchEmails);
router.post("/addEmailsToQueueFromCsv", addEmailsToQueueFromCsv);

module.exports = router;
