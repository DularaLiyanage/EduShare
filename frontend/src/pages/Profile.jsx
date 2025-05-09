// Profile.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import UserPosts from '../components/Posts/UserPosts';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();

  return (
    <Container className="mt-4">
      <h1>User Profile</h1>
      {currentUser && userId === currentUser.id && (
        <div className="mb-4">
          <h3>My Posts</h3>
        </div>
      )}
      <UserPosts userId={userId} />
    </Container>
  );
};

export default Profile;
