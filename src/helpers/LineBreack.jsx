//Text line
export function FormatLineBreak(text) {
    return text.split("\n").map((str, index) => <li key={index}>{str}</li>);
  }