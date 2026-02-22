const express = require("express");
const router = express.Router();
const {
  setResetTime,
  getResetTime,
} = require("../controllers/reset-db-controller");

router.post("/set-reset-time", setResetTime);
router.get("/get-reset-time", getResetTime);

module.exports = router;
