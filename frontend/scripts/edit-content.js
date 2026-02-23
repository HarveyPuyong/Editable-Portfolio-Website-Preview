import { popupError, popupSuccess } from "./../utils/popup-alert.js";
import { enableLoading, disableLoading } from "./../utils/loading-animation.js";
import {setResetTime, scheduleResetDatabase} from "./../utils/handle-reset-db.js"

import { editMainInfoAPI, editMainEmailAPI } from "./../api/main-info-api.js";
import { editAchievementAPI } from "./../api/achievement-api.js";
import { editSkillAPI } from "./../api/skill-api.js";
import { editExperiencesAPI } from "./../api/experience-api.js";
import { editProjectAPI } from "./../api/project-api.js";
import { editEducationAPI } from "./../api/education-api.js";
import { editToolAPI } from "./../api/tool-api.js";


// ================================
// TRACK DIRTY ELEMENT OF EDITED ELEMENT
// ================================
const trackDirtyElement = () => {
  document.addEventListener("input", (e) => {
    const target = e.target;

    const editableText = target.classList.contains("editable-text");
    const editableInput =
      target.tagName === "INPUT" &&
      !["password", "email"].includes(target.type) &&
      !target.classList.contains("otp-form__input") &&
      !target.classList.contains("email-form__name-input");

    if (editableText || editableInput) {
      target.dataset.dirty = "true";
      // console.log('Marked dirty:', target);
    }
  });
};

// ================================
// IMAGE PREVIEW
// ================================
const imagePreview = () => {
  const eventsName = [
    "displayedToolsSection",
    "displayedProjectSection",
    "displayedProfileCard",
  ];

  eventsName.forEach((eventName) =>
    document.addEventListener(eventName, () => {
      document.addEventListener("change", (e) => {
        if (!e.target.classList.contains("image-input")) return;

        const container = e.target.closest(".with-image-content");
        if (!container) return;

        const image = container.querySelector(".image-preview");
        const file = e.target.files[0];
        if (!file || !image) return;

        const reader = new FileReader();
        reader.onload = (ev) => (image.src = ev.target.result);
        reader.readAsDataURL(file);
      });
    }),
  );
};

// ================================
// POPUP ALERT AFTER UPLOADING FILE
// ================================
const popupAfterUploadingFile = () => {
  document.addEventListener("edit-mode", () => {
    const cvInput = document.querySelector("#CV-upload");
    if (!cvInput) return;

    // Prevent attaching multiple identical listeners if edit-mode fires repeatedly
    if (cvInput.dataset.changeListenerAttached === "true") return;

    cvInput.addEventListener("change", () => {
      if (cvInput?.files && cvInput?.files[0])
        popupSuccess("Successfully Uploaded the file");
      else popupError("Error to upload the file");
    });

    cvInput.dataset.changeListenerAttached = "true";
  });
};

// ==========================================
// EDIT MAIN INFO
// ==========================================
export const editMainInfo = async () => {
  const formData = new FormData();

  const nameEl = document.querySelector(".profile-card__name");
  if (nameEl.dataset.dirty === "true")
    formData.append("name", nameEl.innerText);

  const workAvailabilityEl = document.querySelector(
    "#select-work-availability",
  );
  if (workAvailabilityEl.dataset.dirty === "true")
    formData.append("workAvailability", workAvailabilityEl.value);

  const aboutMeEl = document.querySelector(".about-section__about-me");
  if (aboutMeEl.dataset.dirty === "true")
    formData.append("aboutMe", aboutMeEl.innerText);

  const contactNumberEl = document.querySelector("#contact-number");
  if (contactNumberEl.dataset.dirty === "true")
    formData.append("contactNumber", contactNumberEl.innerText);

  const addressEl = document.querySelector("#address");
  if (addressEl.dataset.dirty === "true")
    formData.append("address", addressEl.innerText);

  const emailEl = document.querySelector("#email");
  if (emailEl.dataset.dirty === "true")
    await editMainEmailAPI({ email: emailEl.innerText });

  const instagramLinkInput = document.querySelector(".instagram-input-link");
  if (instagramLinkInput.dataset.dirty === "true")
    formData.append("instagramLink", instagramLinkInput.value);

  const tiktokLinkInput = document.querySelector(".tiktok-input-link");
  if (tiktokLinkInput.dataset.dirty === "true")
    formData.append("tiktokLink", tiktokLinkInput.value);

  const youtubeLinkInput = document.querySelector(".youtube-input-link");
  if (youtubeLinkInput.dataset.dirty === "true")
    formData.append("youtubeLink", youtubeLinkInput.value);

  const facebookLinkInput = document.querySelector(".facebook-input-link");
  if (facebookLinkInput.dataset.dirty === "true")
    formData.append("facebookLink", facebookLinkInput.value);

  const profileImageInput = document.querySelector(".profile-image-input");
  if (profileImageInput?.files[0])
    formData.append("profileImage", profileImageInput.files[0]);

  const cvInput = document.querySelector("#CV-upload");
  if (cvInput?.files[0]) formData.append("cvFile", cvInput.files[0]);

  try {
    await editMainInfoAPI(formData);

    // Reset dirty flags
    [
      nameEl,
      workAvailabilityEl,
      aboutMeEl,
      contactNumberEl,
      addressEl,
      emailEl,
      instagramLinkInput,
      tiktokLinkInput,
      youtubeLinkInput,
      facebookLinkInput,
    ].forEach((el) => {
      if (el) el.dataset.dirty = "false";
    });
  } catch (err) {
    console.log("Edit main info error:", err);
    popupError(err?.response?.data?.message || "Failed to edit main info");
  }
};

// ==========================================
// EDIT SKILL
// ==========================================
export const editSkill = async () => {
  const allSkills = document.querySelectorAll(
    ".about-section__skill-input input",
  );
  const dirtySkills = Array.from(allSkills).filter(
    (input) => input.dataset.dirty === "true",
  );

  const promises = dirtySkills.map(async (skill) => {
    const skillId = skill.dataset.id;
    const skillValue = skill.value;

    try {
      await editSkillAPI(skillId, { skillName: skillValue });
      skill.dataset.dirty = "false";
      return { success: true, skillId };
    } catch (err) {
      console.log("Edit skill error:", err);
      popupError(err?.response?.data?.message || "Failed to edit skill");
      throw { skillId, err };
    }
  });

  const results = await Promise.allSettled(promises);
  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0)
    popupError(`Failed to save ${failures.length} skill(s)`);
};

// ==========================================
// EDIT ACHIEVEMENT
// ==========================================
export const editAchievement = async () => {
  const allAchievements = document.querySelectorAll(
    ".achievements-list__achievement",
  );
  const dirtyAchievements = Array.from(allAchievements).filter((a) => {
    return a.dataset.dirty === "true" || a.querySelector('[data-dirty="true"]');
  });

  const promises = dirtyAchievements.map(async (achievement) => {
    const achievementId = achievement.dataset.id;
    const achievementNumber = achievement.querySelector(
      ".achivements-list__achievement--number",
    )?.innerText;
    const achievementName = achievement.querySelector(
      ".achivements-list__achivement--label",
    )?.innerText;

    try {
      await editAchievementAPI(achievementId, {
        number: achievementNumber,
        name: achievementName,
      });
      achievement.dataset.dirty = "false";
      return { success: true, achievementId };
    } catch (err) {
      console.log("Edit achievement error:", err);
      popupError(err?.response?.data?.message || "Failed to edit achievement");
      throw { achievementId, err };
    }
  });

  const results = await Promise.allSettled(promises);
  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0)
    popupError(`Failed to save ${failures.length} achievement(s)`);
};

// ==========================================
// EDIT EXPERIENCE
// ==========================================
export const editExperience = async () => {
  const allExperience = document.querySelectorAll(".experience-card");
  const dirtyExperience = Array.from(allExperience).filter((exp) => {
    return (
      exp.dataset.dirty === "true" || exp.querySelector('[data-dirty="true"]')
    );
  });

  const promises = dirtyExperience.map(async (experience) => {
    const experienceId = experience.dataset.id;

    const title = experience
      .querySelector(".experience-card__title")
      ?.innerText.trim();
    const company = experience
      .querySelector(".experience-card__company")
      ?.innerText.trim();
    const dateRange = experience
      .querySelector(".experience-card__date-range")
      ?.innerText.trim();
    const details = experience
      .querySelector(".experience-card__details")
      ?.innerText.trim();
    const imageInput = experience.querySelector(".image-input");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("company", company);
      formData.append("dateRange", dateRange);
      formData.append("details", details);
      if (imageInput?.files[0]) formData.append("img", imageInput.files[0]);

      await editExperiencesAPI(experienceId, formData);
      experience.dataset.dirty = "false";
      return { success: true, experienceId };
    } catch (err) {
      console.log("Edit experience error:", err);
      popupError(err?.response?.data?.message || "Failed to edit experience");
      throw { experienceId, err };
    }
  });

  const results = await Promise.allSettled(promises);
  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0) {
    popupError(`Failed to save ${failures.length} experience(s)`);
    failures.forEach((f) => console.error(f.reason));
  }
};

// ==========================================
// EDIT PROJECT
// ==========================================
export const editProject = async () => {
  const allProject = document.querySelectorAll(".project-card");
  const dirtyProject = Array.from(allProject).filter((p) => {
    return p.dataset.dirty === "true" || p.querySelector('[data-dirty="true"]');
  });

  const promises = dirtyProject.map(async (project) => {
    const projectId = project.dataset.id;

    const title = project
      .querySelector(".project-card__title")
      ?.innerText.trim();
    const type = project.querySelector(".project-card__type")?.innerText.trim();
    const link = project
      .querySelector(".profile-card__input-link")
      ?.value.trim();
    const imageInput = project.querySelector(".image-input");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("type", type);
      formData.append("link", link);
      if (imageInput?.files[0]) formData.append("img", imageInput.files[0]);

      await editProjectAPI(projectId, formData);
      project.dataset.dirty = "false";
      return { success: true, projectId };
    } catch (err) {
      console.log("Edit project error:", err);
      popupError(err?.response?.data?.message || "Failed to edit project");
      throw { projectId, err };
    }
  });

  const results = await Promise.allSettled(promises);
  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0) {
    popupError(`Failed to save ${failures.length} project(s)`);
    failures.forEach((f) => console.error(f.reason));
  }
};

// ==========================================
// EDIT EDUCATION
// ==========================================
export const editEducation = async () => {
  const allEducation = document.querySelectorAll(".education-card");
  const dirtyEducation = Array.from(allEducation).filter((e) => {
    return e.dataset.dirty === "true" || e.querySelector('[data-dirty="true"]');
  });

  const promises = dirtyEducation.map(async (education) => {
    const educationId = education.dataset.id;

    const title = education
      .querySelector(".education-card__title")
      ?.innerText.trim();
    const institution = education
      .querySelector(".education-card__program")
      ?.innerText.trim();
    const details = education
      .querySelector(".education-card__details")
      ?.innerText.trim();
    const dateRange = education
      .querySelector(".education-card__date-range")
      ?.innerText.trim();

    try {
      await editEducationAPI(educationId, {
        title,
        institution,
        details,
        dateRange,
      });
      education.dataset.dirty = "false";
      return { success: true, educationId };
    } catch (err) {
      console.log("Edit education error:", err);
      popupError(err?.response?.data?.message || "Failed to edit education");
      throw { educationId, err };
    }
  });

  const results = await Promise.allSettled(promises);
  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0) {
    popupError(`Failed to save ${failures.length} education(s)`);
    failures.forEach((f) => console.error(f.reason));
  }
};

// ==========================================
// EDIT TOOL
// ==========================================
export const editTool = async () => {
  const allTool = document.querySelectorAll(".tool-card");
  const dirtyTool = Array.from(allTool).filter((t) => {
    return t.dataset.dirty === "true" || t.querySelector('[data-dirty="true"]');
  });

  const promises = dirtyTool.map(async (tool) => {
    const toolId = tool.dataset.id;

    const name = tool.querySelector(".tool-card__name")?.innerText.trim();
    const details = tool.querySelector(".tool-card__details")?.innerText.trim();
    const imageInput = tool.querySelector(".image-input");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("details", details);
      if (imageInput?.files[0]) formData.append("img", imageInput.files[0]);

      await editToolAPI(toolId, formData);
      tool.dataset.dirty = "false";
      return { success: true, toolId };
    } catch (err) {
      console.log("Edit tool error:", err);
      popupError(err?.response?.data?.message || "Failed to edit tool");
      throw { toolId, err };
    }
  });

  const results = await Promise.allSettled(promises);
  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0) {
    popupError(`Failed to save ${failures.length} tool(s)`);
    failures.forEach((f) => console.error(f.reason));
  }
};



// ==========================================
// HANDLE SUBMIT FORM
// ==========================================
const handleSubmitForm = () => {
  document.addEventListener("edit-mode", () => {
    const editForm = document.querySelector("#edit-content-form");

    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      enableLoading();

      try {
        await editMainInfo();
        await editSkill();
        await editAchievement();
        await editExperience();
        await editProject();
        await editEducation();
        await editTool();
        await setResetTime();

        popupSuccess("Changes saved successfully");
      } catch (err) {
        console.error("Error saving edits:", err);
      } finally {
        disableLoading();
      }
    });
  });
};

// ==========================================
// MAIN FUNCTION
// ==========================================
export function EditContentMain() {
  trackDirtyElement();
  imagePreview();
  popupAfterUploadingFile();
  handleSubmitForm();
  scheduleResetDatabase();
}
