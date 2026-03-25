"use client";
import React, { useEffect, useState } from "react";

export type NotificationType =
  | "warning"
  | "success"
  | "error"
  | "info"
  | "danger";

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // ms, default 5000
}

interface NotificationCardProps {
  notification: NotificationData;
  onDismiss: (id: string) => void;
}

// const icons: Record<NotificationType, string> = {
//   warning: "⚠️",
//   success: "✅",
//   error: "❌",
//   info: "ℹ️",
// };

const styles: Record<NotificationType, string> = {
  warning: "bg-yellow-50 text-yellow-600",
  success: "bg-green-50 text-green-600",
  error: "bg-red-50 text-red-600",
  info: "bg-blue-50 text-blue-600",
  danger: "bg-red-50 text-red-600",
};

const progressStyles: Record<NotificationType, string> = {
  warning: "bg-yellow-400",
  success: "bg-green-400",
  error: "bg-red-400",
  info: "bg-blue-400",
  danger: "bg-red-400",
};

// ─── Single Card ────────────────────────────────────────────────────────────
const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onDismiss,
}) => {
  const { id, type, title, message, duration = 10000 } = notification;
  const [visible, setVisible] = useState(false); // controls slide-in
  const [leaving, setLeaving] = useState(false); // controls slide-out

  // Slide in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(() => handleDismiss(), duration);
    return () => clearTimeout(t);
  }, [duration]);

  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(id), 300); // wait for slide-out
  };

  return (
    <div
      className={`
        relative w-[340px] rounded-md shadow-effect-2
        overflow-hidden transition-all duration-300 ease-out
        ${styles[type]}
        ${
          visible && !leaving
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }
      `}
    >
      {/* Content */}
      <div className="flex flex-row items-start gap-sm p-sm">
        {/* <span className="text-xl leading-none mt-[2px]">{icons[type]}</span> */}
        <div className="flex-1 flex flex-col gap-0.5">
          <p className="font-nunitosans font-bold text-body leading-[130%]">
            {title}
          </p>
          <p className="font-nunitosans font-normal text-body leading-[130%] opacity-90">
            {message}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="opacity-60 hover:opacity-100 transition-opacity text-lg leading-none font-bold"
        >
          ×
        </button>
      </div>

      {/* Progress bar */}
      <div
        className={`h-[3px] ${progressStyles[type]}`}
        style={{
          animation: `shrink ${duration}ms linear forwards`,
        }}
      />

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

// ─── Container ──────────────────────────────────────────────────────────────
interface NotificationContainerProps {
  notifications: NotificationData[];
  onDismiss: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onDismiss,
}) => {
  return (
    <div className="fixed top-md right-md z-50 flex flex-col gap-sm items-end">
      {notifications.map((n) => (
        <NotificationCard key={n.id} notification={n} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
