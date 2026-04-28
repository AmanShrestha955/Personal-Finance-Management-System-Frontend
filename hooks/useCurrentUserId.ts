import { useMemo } from "react";

export const useCurrentUserId = (): string | null => {
  return useMemo(() => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) return null;

      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded JWT payload:", payload);
      return payload.id ?? payload._id ?? payload.sub ?? null;
    } catch {
      return null;
    }
  }, []);
};
