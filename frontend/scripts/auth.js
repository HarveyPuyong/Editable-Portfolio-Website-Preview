import { loginUserAPI, sendOtpAPI, verifyOtpAPI, changePasswordAPI, getDefaultCredentialsAPI } from "./../api/auth-api.js";
import attachInputSanitizers from "./../utils/sanitize-input.js";
import { popupSuccess, popupError } from "./../utils/popup-alert.js";
import otpCooldown from "./../utils/otp-cooldown.js";
import { enableLoading, disableLoading } from "./../utils/loading-animation.js";
import {removeResetTime} from "./../utils/handle-reset-db.js";

/* ==========================================================================
   ENFORCE EDIT MODE ACCESS
   Ensures only authorized users can enter edit mode
   ========================================================================== */
const validateEditPermissions = () => {
  const mainWrapper = document.querySelector(".main-wrapper");
  const accessToken = localStorage.getItem("accessToken");

  // Only observe if no token (to avoid unnecessary observer for authorized users)
  if (!accessToken) {
    mainWrapper.classList.remove("edit-mode");
    mainWrapper.classList.add("view-mode");

    const observer = new MutationObserver(() => {
      if (mainWrapper.classList.contains("edit-mode")) {
        mainWrapper.classList.remove("edit-mode");
        mainWrapper.classList.add("view-mode");
        console.warn("Edit mode access denied.");
      }
    });

    observer.observe(mainWrapper, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }
};

/* ==========================================================================
   ENFORCE FORGOT PASSWORD FORM
   Ensures the forgot password form is only shown if the user has a valid reset password token (after verifying OTP)
   ========================================================================== */
const securedForgotPasswordForm = () => {
  const resetPasswordForm = document.querySelector("#reset-password-form");
  const resetPasswordToken = sessionStorage.getItem("resetPasswordToken");
  const blurBG = document.querySelector(".blur-bg");

  if (!resetPasswordToken) {
    resetPasswordForm.classList.add("hide");
    blurBG.classList.add("hide");
    console.warn("Reset password form access denied.");
  }
};

/* ==========================================================================
   HANDLE LOGIN
   ========================================================================== */
const handleLogin = () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.querySelector("#email-input").value.trim();
    const password = loginForm.querySelector("#password-input").value.trim();

    enableLoading();

    try {
      const data = await loginUserAPI({ email, password });

      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        await removeResetTime();
        popupSuccess("Logged In Successfully"); //nasa closePopupAlert function ang pag call ng switchToEditMode
      }
    } catch (err) {
      const errors = err.response?.data;
      if (errors?.errors?.length) popupError(errors.errors.map((e) => e.msg || e.message).join("\n"));
      else if (errors?.message) popupError(errors.message);
      else popupError("Failed to Login");
      console.error("Full error:", errors);
      console.error(err);

    } finally {
      disableLoading();
    }
  });
};

// ===============================
// DISPLAY DEFAULT CREDENTIALS
// ===============================
const displayDefaultCredentials = async () => {
  try {
    const response = await getDefaultCredentialsAPI();
    const { email, password } = response.data;

    if (!email || !password) return;

    document.querySelector("#email-input").value = email;
    document.querySelector("#password-input").value = password;
  } catch (err) {
    const errors = err.response?.data;

    if (errors?.errors?.length)
      popupError(errors.errors.map((e) => e.msg || e.message).join("\n"));
    else if (errors?.message) popupError(errors.message);
    else popupError("Failed to Login");

    console.error("Full error:", errors);
    console.error(err);
  }
};

// ===============================
// HANDLE SEND OTP
// ===============================
const handleSendOTP = () => {
  const buttons = document.querySelectorAll(".login-form__forgot-password, .otp-form__resend-otp");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      enableLoading();

      try {
        const response = await sendOtpAPI();
        const cooldown = response.data.cooldown || 60;

        otpCooldown(cooldown);

        if (response?.status === 200) popupSuccess(response.data.message);

      } catch (err) {
        const errors = err.response?.data;
        if (errors?.errors?.length)
          popupError(errors.errors.map((e) => e.msg || e.message).join("\n"));
        else if (errors?.message) popupError(errors.message);
        else popupError("An Error Occured");
        console.error("Full error:", errors);
        console.error(err);

      } finally {
        disableLoading();
      }
    });
  });
};

// ===============================
// HANDLE VERIFY OTP
// ===============================
const handleVerifyOTP = () => {
  const changePasswordForm = document.querySelector("#reset-password-form");
  const otpForm = document.querySelector("#otp-form");
  const otpInputs = document.querySelectorAll(".otp-form__input");

  otpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    enableLoading();

    const otp = Array.from(otpInputs)
      .map((i) => i.value)
      .join("");

    if (otp.length < 6) {
      alert("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      const response = await verifyOtpAPI({ otp });

      if (response.status === 200) {
        sessionStorage.setItem(
          "resetPasswordToken",
          response?.data?.resetToken,
        );
        changePasswordForm.classList.remove("hide");
        otpForm.classList.add("hide");
        otpInputs.forEach((inp) => (inp.value = ""));
        otpInputs[0].focus();
      }
    } catch (err) {
      const errors = err.response?.data;

      if (errors?.errors?.length)
        popupError(errors.errors.map((e) => e.msg || e.message).join("\n"));
      else if (errors?.message) popupError(errors.message);
      else popupError("Invalid or expired OTP");

      console.error("Full error:", errors);
      console.error(err);

      otpInputs.forEach((inp) => (inp.value = ""));
      otpInputs[0].focus();
    } finally {
      disableLoading();
    }
  });
};

// ===============================
// HANDLE CHANGE PASSWORD
// ===============================
const handleChangePassword = () => {
  const changePasswordForm = document.querySelector("#reset-password-form");

  changePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    enableLoading();

    const password = document.querySelector("#new-password-input").value.trim();
    const confirmPassword = document
      .querySelector("#re-enter-password")
      .value.trim();

    const data = { password, confirmPassword };
    const resetPasswordToken = sessionStorage.getItem("resetPasswordToken");

    try {
      const response = await changePasswordAPI(data, resetPasswordToken);

      if (response.status === 200) {
        console.log(response.data.message);
        popupSuccess("Password changed successfully"); // After clicking the popup alert, the login form is shown and the change password form is reset
      }
    } catch (err) {
      const errors = err.response?.data;

      if (errors?.errors?.length)
        popupError(errors.errors.map((e) => e.msg || e.message).join("\n"));
      else if (errors?.message) popupError(errors.message);
      else popupError("Failed to change the password");

      console.error("Full error:", errors);
      console.error(err);
      changePasswordForm.reset();
    } finally {
      disableLoading();
    }
  });
};

/* ==========================================================================
   TOGGLE PASSWORD VISIBILITY
   ========================================================================== */
const togglePasswordVisibility = () => {
  document.querySelectorAll(".password-wrapper").forEach((wrapper) => {
    const passwordInput = wrapper.querySelector(
      "input[type='password'], input[type='text']",
    );
    const eyeIcon = wrapper.querySelector(".toggle-password-icon");

    if (!passwordInput || !eyeIcon) return;

    eyeIcon.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";

      // Toggle visibility
      passwordInput.type = isHidden ? "text" : "password";

      // Toggle icons
      eyeIcon.classList.toggle("fa-eye");
      eyeIcon.classList.toggle("fa-eye-slash");
    });
  });
};

// ===============================
// OTP AUTO NEXT/PREV INPUTS
// ===============================
const otpAutoNextPrevInput = () => {
  const otpForm = document.querySelector("#otp-form");
  const otpInputs = document.querySelectorAll(".otp-form__input");

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      const value = e.target.value;
      if (/^\d$/.test(value)) {
        e.target.value = value;
        if (index < otpInputs.length - 1) otpInputs[index + 1].focus();
      } else {
        e.target.value = "";
      }

      // Auto-submit if all fields are filled
      const allFilled = Array.from(otpInputs).every((inp) => inp.value !== "");
      if (allFilled) otpForm.requestSubmit();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });
};

export default function AuthMain() {
  validateEditPermissions();
  togglePasswordVisibility();
  otpAutoNextPrevInput();
  attachInputSanitizers();
  handleLogin();
  displayDefaultCredentials();
  handleSendOTP();
  handleVerifyOTP();
  securedForgotPasswordForm();
  handleChangePassword();
}
