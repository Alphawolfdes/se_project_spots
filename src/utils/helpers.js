export function setButtonText(
  btn,
  isLoading,
  loadingText = "Saving...",
  defaultText = "Save"
) {
  if (isLoading) {
    btn.textContent = "Saving...";
  } else {
    btn.textContent = "Save";
  }
}
