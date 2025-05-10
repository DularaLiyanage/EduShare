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
        <center><h1 style={{ color: "#4361ee" }}>Dashboard</h1></center>
        <PostList currentUser={currentUser} />
      </Container>
      <Footer />
    </div>
  );
};

export default Dashboard;