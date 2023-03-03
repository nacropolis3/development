import moment from "moment/moment";
import "moment/locale/es";
moment.locale("es");

//time ago moment format
export function TimeAgoHourFormat(date) {
  return moment(date).fromNow();
}
export function TimeAgoDateComplete(date) {
  if (date) {
    return moment(date).format("LLL");
  }
  return moment().format("LLL");
}

export function TimeAgoHourFormatSimple(date) {
  return moment(date).calendar();
}
export function FormatDate() {
  return moment().format();
}
export function TimeAgoDate(date) {
  return moment(date).format("MMM Do YY");
}

export function converterDate(date) {
  return moment(date).format();
}
export function getDayMoment() {
  return moment().format("dddd");
}
export function getMonthoment() {
  return moment().format("MMMM");
}
