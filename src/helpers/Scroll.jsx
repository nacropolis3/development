//disable scroll
export function disableScroll() {
  var TopScroll = window.pageYOffset || document.documentElement.scrollTop;
  var LeftScroll = window.pageXOffset || document.documentElement.scrollLeft;
  window.onscroll = function () {
    window.scrollTo(LeftScroll, TopScroll);
  };
  var body = document.getElementById("bdy_scll_theme");
  body.classList.add("ov_hidden");
  body.classList.remove("ov_scroll");
}

//enable Scroll
export function enableScroll() {
  window.onscroll = function () {};
  var body = document.getElementById("bdy_scll_theme");
  body.classList.add("ov_scroll");
  body.classList.remove("ov_hidden");
}
