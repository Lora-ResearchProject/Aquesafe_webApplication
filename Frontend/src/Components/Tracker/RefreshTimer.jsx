import React, { useState, useEffect } from "react";

const RefreshTimer = ({ refreshInterval, lastRefreshed, refreshTrigger }) => {
  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, Math.ceil((lastRefreshed + refreshInterval - Date.now()) / 1000))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(
        Math.max(0, Math.ceil((lastRefreshed + refreshInterval - Date.now()) / 1000))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [lastRefreshed, refreshTrigger]);

  return <div className="text-sm text-gray-600">Refreshing in: <strong>{timeLeft}s</strong></div>;
};

export default RefreshTimer;