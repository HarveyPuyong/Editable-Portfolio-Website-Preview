import {switchToEditMode} from "./switch-to-edit-mode.js"

/* ==========================================================================
   CLOSE POPUP ALERT
   ========================================================================== */
const closePopupAlert = (detail) => {
  const popupContainers = document.querySelectorAll('.popup-alert');

  popupContainers.forEach(popup => {
    const popupButton = popup.querySelector('.popup-alert__button');
    
    popupButton.addEventListener('click', () => {
      popup.classList.add('hide');

      if(!detail) return

      if(detail === "Session expired. Please log in again.") window.location.reload();

      if(detail === 'Logged In Successfully') switchToEditMode();

      if(detail === 'Password changed successfully') {
          const popupSuccess = document.querySelector('.popup-success');
          const changePasswordForm = document.querySelector('#reset-password-form');
          const loginForm = document.querySelector('#login-form')

          popupSuccess.classList.add('hide');
          changePasswordForm.classList.add("hide");
          changePasswordForm.reset();
          loginForm.classList.remove("hide");
          sessionStorage.removeItem("resetPasswordToken")
      }

      if(detail === 'Changes saved successfully') window.location.reload();

      if(detail === 'OTP verification failed' || detail === 'Invalid or expired OTP') {
          const otpInputs = document.querySelectorAll('.otp-form__input');
          otpInputs.forEach(inp => (inp.value = ''));
          otpInputs[0].focus();
      }

      if(detail === "Content reset to default") window.location.reload();
      
    })
  });
}


/* ==========================================================================
   POPUP SUCCESS
   ========================================================================== */
function popupSuccess(detail) {
  const popupContainer = document.querySelector('.popup-success');
  popupContainer.classList.remove('hide');
  
  popupContainer.querySelector('.popup-alert__details').innerText = detail;
  closePopupAlert(detail);
}


/* ==========================================================================
   POPUP ERROR 
   ========================================================================== */
function popupError(detail) {
  const popupContainer = document.querySelector('.popup-error');
  popupContainer.classList.remove('hide');
  
  popupContainer.querySelector('.popup-alert__details').innerText = detail;
  closePopupAlert(detail);
}


export {popupSuccess, popupError, closePopupAlert}