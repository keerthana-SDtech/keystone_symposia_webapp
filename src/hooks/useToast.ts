import { useState, useCallback, useRef } from "react";
import type { ToastVariant } from "../components/ui/toast";

interface ToastState {
  message: string;
  variant: ToastVariant;
  visible: boolean;
}

const DEFAULT_DURATION_MS = 3000;

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    variant: "success",
    visible: false,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "success", duration = DEFAULT_DURATION_MS) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setToast({ message, variant, visible: true });
      timerRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, duration);
    },
    []
  );

  const closeToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, closeToast };
}
