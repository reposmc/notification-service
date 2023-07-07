const { Router } = require("express");
const {
  subscribe,
  sendNotification,
} = require("../app/controllers/webpush.controller");

const router = Router();

router.post("/subscribe", subscribe);
router.post("/sendNotification", sendNotification);

module.exports = router;
