import React, { useEffect } from "react";

const useDebounce = <T,>(value?: T, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay || 400);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
