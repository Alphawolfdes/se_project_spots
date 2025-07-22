export function setButtonText(
  btn,
  isLoading,
  loadingText = "Saving...",
  defaultText = "Save"
) {
  btn.textContent = isLoading ? loadingText : defaultText;
}
