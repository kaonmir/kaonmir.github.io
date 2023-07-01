function setGithubIcon(currentStyle) {
  const iconElement = document.getElementById("github-icon");
  if (iconElement) {
    if (currentStyle === "light") iconElement.src = "images/github-light.png";
    else iconElement.src = "images/github-dark.png";
  }
}

function switchTheme() {
  const currentStyle = currentTheme();
  if (currentStyle === "light") setTheme("dark");
  else setTheme("light");
}

function setTheme(style) {
  document.querySelectorAll(".isInitialToggle").forEach((elem) => {
    elem.classList.remove("isInitialToggle");
  });
  document.documentElement.setAttribute("data-color-mode", style);
  localStorage.setItem("data-color-mode", style);
  setGithubIcon(style);
}

function currentTheme() {
  const localStyle = localStorage.getItem("data-color-mode");
  const systemStyle =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  return localStyle || systemStyle;
}

(() => {
  setTheme(currentTheme());
})();
