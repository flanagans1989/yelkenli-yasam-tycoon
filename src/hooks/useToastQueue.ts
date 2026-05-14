import { useState, useEffect, useRef } from "react";
import type { ToastType, ToastItem } from "../types/game";

export function useToastQueue() {
  const toastIdRef = useRef(0);
  const [toastQueue, setToastQueue] = useState<ToastItem[]>([]);
  const [activeToast, setActiveToast] = useState<ToastItem | null>(null);
  const [isToastLeaving, setIsToastLeaving] = useState(false);

  useEffect(() => {
    if (activeToast || toastQueue.length === 0) return;
    const next = toastQueue[0];
    setToastQueue(prev => prev.slice(1));
    setIsToastLeaving(false);
    setActiveToast(next);
  }, [activeToast, toastQueue]);

  useEffect(() => {
    if (!activeToast) return;
    const leaveId = window.setTimeout(() => setIsToastLeaving(true), 3200);
    const clearId = window.setTimeout(() => setActiveToast(null), 3500);
    return () => {
      window.clearTimeout(leaveId);
      window.clearTimeout(clearId);
    };
  }, [activeToast]);

  const pushToast = (type: ToastType, title: string, text: string) => {
    const id = ++toastIdRef.current;
    setToastQueue(prev => [...prev, { id, type, title, text }]);
  };

  return { activeToast, isToastLeaving, pushToast, dismissToast: () => setActiveToast(null) };
}
