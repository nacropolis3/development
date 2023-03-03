import { useState } from "react";

export function useToggle(initialValue) {
  const [value, set] = useState(initialValue);
  const setValue = (value) => {
    set(value);
  };
  return [value, setValue];
}
