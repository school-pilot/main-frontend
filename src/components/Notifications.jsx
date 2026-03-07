import React from "react";
import { useNotification } from "../context/NotificationContext";

const Notifications = () => {
  const { notifications, markAsRead } = useNotification();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Notifications
          </h2>
          <span className="text-sm text-gray-500">
            {notifications.length} Total
          </span>
        </div>

        {/* Empty State */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">
              No notifications available
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                }}
                className={`cursor-pointer rounded-xl p-5 transition-all duration-200 shadow-sm hover:shadow-md border ${
                  notification.read
                    ? "bg-white border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  
                  {/* Title */}
                  <h4 className={`font-semibold text-lg ${
                    notification.read
                      ? "text-gray-700"
                      : "text-blue-800"
                  }`}>
                    {notification.title}
                  </h4>

                  {/* Unread Badge */}
                  {!notification.read && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-600 text-white">
                      New
                    </span>
                  )}
                </div>

                {/* Message */}
                <p className="text-gray-600 mb-3">
                  {notification.message}
                </p>

                {/* Date */}
                <small className="text-gray-400 text-sm">
                  {new Date(notification.created_at).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;