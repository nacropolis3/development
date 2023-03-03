export function concatString(array) {
  const join = array.join(" ");
  return join;
}

export function upercasePrimaryLetter(string) {
  const value = string.toLowerCase();
  const finalLetter = value.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
  return finalLetter;
}

export function UppercasePrimaryLetter(string) {
  let primaryLetter = string.split("")[0];
  primaryLetter = primaryLetter.toUpperCase();
  return `${primaryLetter}${string.slice(1, string.length)}`;
}

export function ChangeMenu() {
  var menu = document.getElementById("containerMenuAside");
  var iframeCloseMenu = document.getElementById("iframeCloseMenu");

  if (menu.classList.contains("openMenu")) {
    menu.classList.remove("openMenu");
    iframeCloseMenu.classList.remove("open");

    return;
  }
  menu.classList.add("openMenu");
  iframeCloseMenu.classList.add("open");
}
