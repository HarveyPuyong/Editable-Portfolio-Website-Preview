import { setResetTimeAPI, getResetTimeAPI, removeResetTimeAPI} from "./../api/reset-db-api.js";
import { popupSuccess, popupError } from "./popup-alert.js";

// Global variable to store the current polling interval ID
let resetPollingIntervalId = null;

// ==========================================
// SET DATABASE RESET TIME
// ==========================================
const setResetTime = async () => {
  try {
    const response = await setResetTimeAPI();
    if (response.status !== 200) throw new Error("Failed to fetch reset time");

    const { resetTimeReadable } = response.data;

    console.log(`Reset scheduled at ${resetTimeReadable}`);
  } catch (err) {
    console.error("Error scheduling auto-reload:", err);
    popupError("Set reset time failed.");
  }
};

// ==========================================
// CLEAR ANY EXISTING POLLING INTERVAL
// ==========================================
const clearResetPollingInterval = () => {
  if (resetPollingIntervalId !== null) {
    clearInterval(resetPollingIntervalId);
    resetPollingIntervalId = null;
    console.log("Cleared existing reset polling interval");
  }
};

// ==========================================
// SCHEDULE DATABASE RESET TIME
// ==========================================
const scheduleResetDatabase = async () => {
  try {
    // Clear any existing polling interval first
    clearResetPollingInterval();

    const response = await getResetTimeAPI();
    const { resetTime, resetTimeReadable } = response.data;

    if (!resetTime) {
      console.log("No reset time found. Polling disabled.");
      return;
    }

    console.log(`Reset scheduled at: ${resetTimeReadable}`);

    // Poll every second
    resetPollingIntervalId = setInterval(() => {
      const now = Date.now();

      // If current time >= resetTime, reload page
      if (now >= resetTime) {
        clearResetPollingInterval(); // stop polling
        popupSuccess('Content reset to default')
      }
    }, 1000);

  } catch (err) {
    console.error("Error scheduling auto-reload:", err);
  }
};

// ==========================================
// REMOVE RESET TIME
// ==========================================
const removeResetTime = async () => {
  try {
    clearResetPollingInterval();

    const response = await removeResetTimeAPI();
    console.log(response);
  } catch (err) {
    console.error("Error removing reset time:", err);
  }
};

export {
  setResetTime,
  scheduleResetDatabase,
  removeResetTime,
};
