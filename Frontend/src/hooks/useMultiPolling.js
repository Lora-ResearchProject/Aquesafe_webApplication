import { useEffect } from 'react';
import { baseURL } from "../config/config";

const API_BASE_URL = baseURL + "/api/users";

export default function useMultiPolling({ onChat, onNotification, onSOS }) {
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/poll`);
        const json = await res.json();

        if (json.chat && onChat) onChat();
        if (json.notification && onNotification) onNotification();
        if (json.sos && onSOS) onSOS();

        poll(); // Continue polling
      } catch (err) {
        console.error("Polling failed:", err);
        setTimeout(poll, 5000); // Retry after delay
      }
    };

    poll();
    return () => {};
  }, [onChat, onNotification, onSOS]);
}