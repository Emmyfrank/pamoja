import { useState, useCallback, useEffect } from "react";

export const useWarning = (duration = 3000) => {
  const [warning, setWarning] = useState<string>("");

  const showWarning = useCallback((message: string) => {
    setWarning(message);
  }, []);

  const clearWarning = useCallback(() => {
    setWarning("");
  }, []);

  useEffect(() => {
    if (warning && duration > 0) {
      const timer = setTimeout(clearWarning, duration);
      return () => clearTimeout(timer);
    }
  }, [warning, duration, clearWarning]);

  return {
    warning,
    showWarning,
    clearWarning,
  };
};
