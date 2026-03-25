"use client";
import React, { createContext, useContext, useState } from "react";
import {
  NotificationContainer,
  NotificationData,
  NotificationType,
} from "@/component/Notifiction";

interface NotificationContextType {
  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
    duration?: number,
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = (
    type: NotificationType,
    title: string,
    message: string,
    duration?: number,
  ) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [
      ...prev,
      { id, type, title, message, duration },
    ]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider");
  return context;
};
