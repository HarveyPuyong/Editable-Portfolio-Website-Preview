const ResetModel = require("../models/reset-schema");

// =======================
// SET RESET TIME
// =======================
const setResetTime = async (req, res) => {
  try {
    const RESET_DELAY = Number(process.env.RESET_DELAY) || 1;

    const resetDelayTime = RESET_DELAY * 60 * 1000;

    const resetTime = Date.now() + resetDelayTime;
    const resetTimeReadable = resetTime ? new Date(resetTime).toLocaleTimeString() : null;

    await ResetModel.updateOne({}, { resetTime }, { upsert: true });

    return res.status(200).json({
      message: `Reset scheduled set in ${RESET_DELAY} minute(s)`,
      resetTime,
      resetTimeReadable
    });
  } catch (err) {
    console.error("Schedule reset error:", err);
    return res.status(500).json({ message: "Failed to schedule reset" });
  }
};

// =======================
// GET RESET TIME
// =======================
const getResetTime = async (req, res) => {
  try {
    const data = await ResetModel.findOne();

    const resetTime = data?.resetTime || null;
    const resetTimeReadable = resetTime ? new Date(resetTime).toLocaleTimeString() : null;

    return res.status(200).json({
      resetTime,
      resetTimeReadable,
    });
  } catch (err) {
    console.error("Get reset time error:", err);
    return res.status(500).json({ message: "Failed to fetch reset time" });
  }
};

// =======================
// REMOVE RESET TIME
// =======================
const removeResetTime = async (req, res) => {
  try {
    const resetTime = null;
    const resetTimeReadable = null;

    await ResetModel.updateOne({}, { resetTime }, { upsert: true });

    return res.status(200).json({
      message: "The reset time has been removed",
      resetTime,
      resetTimeReadable
    });
  } catch (err) {
    console.error("remove reset time error:", err);
    return res.status(500).json({ message: "Failed to remove the reset time" });
  }
}

module.exports = { setResetTime, getResetTime, removeResetTime };
