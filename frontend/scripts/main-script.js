import AuthMain from "./auth.js"
import {DisplayContentMain} from "./display-contents.js"
import AddContentMain from "./add-content.js"
import DeleteContentMain from "./delete-content.js"
import {EditContentMain} from "./edit-content.js"
import ContactFormEmailer from "./contact-emailer.js"


// ================================
// SHOW MORE PROJECTS
// ================================
const showMoreProjects = () => {
  const showMoreBTN = document.querySelector('.projects-card-container__load-more-btn');
  const moreProjectsContainer = document.querySelector('.more-projects-list');

  if (!showMoreBTN || !moreProjectsContainer) return;

  showMoreBTN.addEventListener('click', () => {
    moreProjectsContainer.classList.remove('hide');
    showMoreBTN.classList.add('hide');
    // initialize animations for newly revealed project cards
    AnimationMainFunction();
    if (window.ScrollTrigger && typeof ScrollTrigger.refresh === 'function') ScrollTrigger.refresh();
  });
}

/* ==========================================================================
   TOGGLE LOGIN FORM
   ========================================================================== */
const toggleLoginForm = () => {
    const loginForm = document.querySelector('#login-form');
    const blurBG = document.querySelector('.blur-bg');

    document.querySelector('.button-enable-edit').addEventListener('click', () => {
      loginForm.classList.remove('hide');
      blurBG.classList.remove('hide');
    });

    document.querySelector('#login-form .form__cancel-btn').addEventListener('click', () => {
      loginForm.classList.add('hide');
      blurBG.classList.add('hide');
    });
}

/* ==========================================================================
   TOGGLE OTP FORM
   ========================================================================== */
const toggleOTPForm = () => {
  const loginForm = document.querySelector('#login-form');
  const OTPForm = document.querySelector('#otp-form');

  document.querySelector('.login-form__forgot-password').
    addEventListener('click', () => {
      loginForm.classList.add('hide');
      OTPForm.classList.remove('hide');
    });

  document.querySelector('#otp-form .form__cancel-btn').
    addEventListener('click', () => {
      loginForm.classList.remove('hide');
      OTPForm.classList.add('hide');
    });
}

/* ==========================================================================
   Hide project moreButton when the more content container is empty
   ========================================================================== */
const hideProjectMoreButton = () => {
  document.addEventListener('displayedProjectSection', () => {
    const button = document.querySelector('.projects-card-container__load-more-btn');
    const moreProjectContainer = document.querySelector('.more-projects-list');

    if (!button || !moreProjectContainer) return;

    // Check if container is empty (even whitespace)
    if (moreProjectContainer.innerHTML.trim() === '') {
      button.classList.add('hide');
    }
  });
};


/* ==========================================================================
   Hide section label if no main content
   ========================================================================== */
const noContentHideSectionLabel = () => {
  const sections = [
    { section: '#experience-section', container: '.experience-cards-list', card: '.experience-card' },
    { section: '#projects-section', container: '.project-list', card: '.project-card', extra: '.more-projects-list' },
    { section: '#education-section', container: '.education-card-list', card: '.education-card' },
    { section: '#tools-section', container: '.tools-card-list', card: '.tool-card' },
  ];

  const events = [
    'displayedExperienceSection',
    'displayedProjectSection',
    'displayedEducationSection',
    'displayedToolsSection'
  ];

  events.forEach(eventName => {
    document.addEventListener(eventName, () => {
      sections.forEach(({ section, container, card, extra }) => {
        const label = document.querySelector(`${section} .section-label`);
        if (!label) return;

        let hasContent = false;

        const mainContainer = document.querySelector(container);
        if (mainContainer && mainContainer.querySelector(card)) hasContent = true;

        if (!hasContent && extra) {
          const extraContainer = document.querySelector(extra);
          if (extraContainer && extraContainer.querySelector(card)) hasContent = true;
        }

        label.classList.toggle('hide', !hasContent);
      });
    });
  });
};



// ================================
// MAIN PAGE FUNCTION
// ================================
function MainScriptFunction() {
  DisplayContentMain();
  AddContentMain();
  DeleteContentMain();
  EditContentMain();
  AuthMain();
  ContactFormEmailer();

  showMoreProjects();
  hideProjectMoreButton();
  noContentHideSectionLabel();
  toggleLoginForm();
  toggleOTPForm();
} 

MainScriptFunction();