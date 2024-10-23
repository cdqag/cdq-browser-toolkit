export const isActiveElementEditable = () => {
  const element = document.activeElement;
  if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") { return true; }
  if (element.contentEditable === "true") { return true; }
  return false;
};
