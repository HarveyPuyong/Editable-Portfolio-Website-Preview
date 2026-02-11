export default function setDirtyDataTag(root = document) {
  const elements = root.querySelectorAll(`
    #select-work-availability,
    .editable-text,
    input:not([type="password"]):not([type="email"]):not(.otp-form__input):not(.email-form__name-input),
    input[type="file"],
    img.image-preview
  `);

  elements.forEach(el => {
    if (!el.dataset.dirty) {
      el.dataset.dirty = "false";
    }
  });
}
