import React from 'react';
import PostList from '../components/Posts/PostList';
import { Container } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="dashboard-page">
      <Container className="mt-4">
        <h1>Dashboard</h1>
        <PostList currentUser={currentUser} />
      </Container>
      <Footer />
    </div>
  );
};

export default Dashboard;