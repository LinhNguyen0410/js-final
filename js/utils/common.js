//set text content for createPostElement in home.js
export function setTextContent(parent, selector, text) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function textTruncate(text, maxLength) {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 1)}…`;
}
export function setFieldValue(formParent, selector, dataValue) {
  if (!formParent) return;

  const fieldInput = formParent.querySelector(selector);
  if (fieldInput) fieldInput.value = dataValue;
}

export function setBackgroundImage(parentElement, selector, imageUrl) {
  if (!parentElement) return;
  const element = parentElement.querySelector(selector);

  if (element) element.style.backgroundImage = `url('${imageUrl}')`;
}

// random a number from 1 to 1000
export function randomIDImage(number) {
  if (typeof number !== 'number' || number <= 0) return;
  const random = Math.random() * number;
  return Math.round(random);
}
export function showModal(modalElement) {
  if (!window.bootstrap) return;
  const modal = new bootstrap.Modal(modalElement);
  if (modal) modal.show();
}
