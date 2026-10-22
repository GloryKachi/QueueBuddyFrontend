"use client";
import { useCallback, useEffect, useState } from "react";

export function useCountdown(initial = 0) {
  const [secondsLeft, setSecondsLeft] = useState(initial);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const start = useCallback((s: number) => setSecondsLeft(s), []);
  return { secondsLeft, start };
}
