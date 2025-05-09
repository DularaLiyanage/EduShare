import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import UserPosts from '../components/Posts/UserPosts'; // Ensure UserPosts is imported
import './profile.css';  // Import the Profile CSS file

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [email, setEmail] = useState(currentUser ? currentUser.email : '');  // Set the initial email from currentUser if available
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setError('You must be logged in to view your profile.');
    }
  }, [currentUser]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const fetchRegisteredEvents = async () => {
    if (!email) {
      setError('Please provide an email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:8080/api/users/${email}/events`);
      setRegisteredEvents(response.data);
    } catch (err) {
      setError('Error fetching registered events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="profile-container mt-4">
      <h1>User Profile</h1>
      {currentUser ? (
        <>
          <h3>Hi, {currentUser.fullName}!</h3>
          <p><strong>Email:</strong> {currentUser.email}</p>

          {/* Displaying the user's posts below */}
          <h4>My Posts</h4>
          <div className="user-posts-section">
            <UserPosts userId={currentUser.id} />
          </div>
        </>
      ) : (
        <Alert variant="info">{error || 'Please log in to view your profile.'}</Alert>
      )}
    </Container>
  );
};

export default Profile;
