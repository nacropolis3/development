import { useState } from "react";
export function useObject(initialValue) {
  const [value, setValue] = useState(initialValue);
  return [value, setValue];
}
