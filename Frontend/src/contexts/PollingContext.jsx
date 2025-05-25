import React, { createContext, useContext, useState, useCallback } from "react";
import useMultiPolling from "../hooks/useMultiPolling";

const PollingContext = createContext();

export const PollingProvider = ({ children }) => {
  const [sosUpdateTrigger, setSosUpdateTrigger] = useState(0);
  const [notificationUpdateTrigger, setNotificationUpdateTrigger] = useState(0);
  const [chatUpdateTrigger, setChatUpdateTrigger] = useState(0);

  const triggerSOSUpdate = useCallback(() => {
    setSosUpdateTrigger((prev) => prev + 1);
  }, []);

  const triggerNotificationUpdate = useCallback(() => {
    setNotificationUpdateTrigger((prev) => prev + 1);
  }, []);

  const triggerChatUpdate = useCallback(() => {
    setChatUpdateTrigger((prev) => prev + 1);
  }, []);

  useMultiPolling({
    onSOS: triggerSOSUpdate,
    onNotification: triggerNotificationUpdate,
    onChat: triggerChatUpdate,
  });

  return (
    <PollingContext.Provider
      value={{ sosUpdateTrigger, notificationUpdateTrigger, chatUpdateTrigger }}
    >
      {children}
    </PollingContext.Provider>
  );
};

export const usePolling = () => useContext(PollingContext);
