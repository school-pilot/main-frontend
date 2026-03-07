import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { communicationsAPI } from "../services/api";
import { getRefreshToken, setTokens, clearTokens } from "../utils/token";

const NotificationContext = createContext(null);
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isAuthenticated, logout } = useAuth();

  // Refresh token manually
  const refreshAccessToken = async () => {
    try {
      const refresh = getRefreshToken();
      if (!refresh) throw new Error("No refresh token available");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/accounts/token/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Token refresh failed");

      setTokens({ access: data.access });
      return data.access;
    } catch (error) {
      clearTokens();
      logout();
      return null;
    }
  };

  // Wrap API calls to auto-refresh token on 401
  const fetchWithTokenRefresh = async (apiCall) => {
    try {
      return await apiCall();
    } catch (error) {
      if (error.response?.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          return await apiCall(); // retry original call
        }
      }
      throw error;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

 const fetchNotifications = async () => {
  try {
    const response = await fetchWithTokenRefresh(
      () => communicationsAPI.notifications()
    );

    const data = Array.isArray(response.data)
      ? response.data
      : response.data?.results || [];

    const transformed = data.map((n) => ({
      id: n.id,
      title: n.title || "",
      message: n.message || "",
      type: n.type || "info",
      read: !n.unread,
      created_at: n.timestamp || n.created_at,
    }));

    // Merge with local notifications to prevent disappearing
    setNotifications((prev) => {
      const existingIds = new Set(prev.map((n) => n.id));
      const merged = [...transformed, ...prev.filter((n) => !existingIds.has(n.id))];
      return merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });

    setUnreadCount((prev) => {
      const unread = transformed.filter((n) => !n.read).length;
      return unread;
    });
    console.log("RAW API DATA:", response.data);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  }
};

  const markAsRead = async (notificationId) => {
    try {
      if (notificationId === "all") {
        await fetchWithTokenRefresh(async () => {
          await Promise.all(
            notifications.filter((n) => !n.read).map((n) =>
              communicationsAPI.markRead(n.id)
            )
          );
        });

        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      } else {
        await fetchWithTokenRefresh(() =>
          communicationsAPI.markRead(notificationId)
        );

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: notification.id || Date.now(),
      title: notification.title || "",
      message: notification.message || "",
      type: notification.type || "info",
      read: notification.read || false,
      created_at: notification.created_at || new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    if (!newNotification.read) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    refreshNotifications: fetchNotifications,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};