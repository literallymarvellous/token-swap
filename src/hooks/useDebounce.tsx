import { useEffect, useState } from "react";

const useDebounce = <T,>(
  fromAmount: T,
  toAmount: T,
  inputId: T,
  delay?: number
) => {
  const [debouncedFromValue, setDebouncedFromValue] = useState<T>(fromAmount);
  const [debouncedToValue, setDebouncedToValue] = useState<T>(toAmount);

  console.log("debounce starting");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputId === "fromAmount") {
        setDebouncedFromValue(fromAmount);
      } else {
        setDebouncedToValue(toAmount);
      }
    }, delay || 500);

    return () => {
      clearTimeout(handler);
    };
  }, [fromAmount, toAmount, inputId, delay]);

  return { debouncedFromValue, debouncedToValue };
};

export default useDebounce;
