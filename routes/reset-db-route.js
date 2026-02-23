const express = require("express");
const router = express.Router();
const { setResetTime, getResetTime, removeResetTime } = require("../controllers/reset-db-controller");

router.post("/set-reset-time", setResetTime);
router.get("/get-reset-time", getResetTime);
router.patch("/remove-reset-time", removeResetTime);

module.exports = router;
