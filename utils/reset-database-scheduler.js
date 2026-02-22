const { seedInfo } = require("../seeds/info-seed");
const { seedAdmin } = require("../seeds/user-seed");
const ResetModel = require("../models/reset-schema");

// ==========================================
// RESET DATABASE
// ==========================================
async function resetDatabase() {
  try {
    console.log("Starting database reset to defaults...");
    await seedInfo();
    await seedAdmin();
    console.log("Database has been reset to default state.");
  } catch (err) {
    console.error("Error during database reset:", err);
  }
}

// ==========================================
// RESET DATABASE SCHEDULER
// ==========================================
function startResetDBScheduler() {
  console.log("Reset scheduler started...");

  setInterval(async () => {
    try {
      const data = await ResetModel.findOne();
      if (!data?.resetTime) return;

      const now = Date.now();

      if (now >= data.resetTime) {
        console.log("Reset time reached. Resetting database...");

        await resetDatabase();

        await ResetModel.updateOne({}, { resetTime: null });

        console.log("Database reset completed.");
      }
    } catch (err) {
      console.error("Reset checker error:", err);
    }
  }, 1000);
}

module.exports = { resetDatabase, startResetDBScheduler };
