import React from 'react';
import PostList from '../components/Posts/PostList';
import { Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from '../components/Notifications/NotificationsPanel';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <Container className="mt-4">
      <h1>Dashboard</h1>
      <NotificationPanel recipientId={currentUser?.uid} />
      <PostList currentUser={currentUser} />
    </Container>
  );
};

// Make sure you have this export
export default Dashboard;