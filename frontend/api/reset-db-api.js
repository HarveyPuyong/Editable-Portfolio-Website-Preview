import api from "../utils/axios-config.js";

/* ==========================================================================
   SET RESET TIME
   ========================================================================== */
const setResetTimeAPI = async () => {
  try {
    const response = await api.post("/reset-db/set-reset-time", {});
    if (response.status === 200) return response;
  } catch (err) {
    throw err;
  }
};

/* ==========================================================================
   GET RESET TIME
   ========================================================================== */
const getResetTimeAPI = async () => {
  try {
    const response = await api.get("/reset-db/get-reset-time");
    if (response.status === 200) return response;
  } catch (err) {
    throw err;
  }
};

/* ==========================================================================
   REMOVE RESET TIME
   ========================================================================== */
const removeResetTimeAPI = async () => {
  try {
    const response = await api.patch("/reset-db/remove-reset-time");
    if (response.status === 200) return response;
  } catch (err) {
    throw err;
  }
};

export { setResetTimeAPI, getResetTimeAPI, removeResetTimeAPI };
