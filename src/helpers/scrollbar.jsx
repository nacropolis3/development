export const disabledScroll = () => {
  var body = document.getElementById("bd-container");
  body.style.overflow = "hidden";
};

export const enabledScroll = () => {
  var body = document.getElementById("bd-container");
  body.style.overflow = "overlay";
};
