const { Router } = require("express");
const { subscribe } = require("../controllers/webpush.controller");

const router = Router();

router.post("/subscribe", subscribe);

module.exports = router;
