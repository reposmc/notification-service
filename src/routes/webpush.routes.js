const { Router } = require("express");
const {
  subscribe,
  sendNotification,
} = require("../app/controllers/webpush.controller");

const router = Router();

router.post("/subscribe", subscribe);
router.get("/sendNotification", sendNotification);

module.exports = router;
