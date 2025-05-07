import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../css/NotificationPanel.css';


const NotificationPanel = ({ recipientId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/notifications/${recipientId}`);
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/mark-read/${id}`);
      fetchNotifications(); // refresh after marking
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notifications/${id}`);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="notification-panel">
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p className="empty-msg">No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((note) => (
            <li key={note.id} className={`notification ${note.read ? "read" : "unread"}`}>
              <p><strong>{note.type}</strong> - {note.message}</p>
              <span>{new Date(note.timestamp).toLocaleString()}</span>
              <div className="notification-actions">
                {!note.read && (
                  <button onClick={() => markAsRead(note.id)} className="btn-read">Mark as Read</button>
                )}
                <button onClick={() => deleteNotification(note.id)} className="btn-delete">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;
