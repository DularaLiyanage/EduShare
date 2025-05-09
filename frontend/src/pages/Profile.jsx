import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Image, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserPosts from '../components/Posts/UserPosts';
import { getUserProfile } from '../Service/UserService';
import './profile.css';

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profileData = await getUserProfile(userId);
        setUserProfile({
          ...profileData,
          postsCount: 0, // This would come from the backend
          followersCount: 0,
          followingCount: 0
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="profile-container mt-4">
      {/* Profile Header */}
      <Card className="profile-header mb-4">
        <Card.Body>
          <Row>
            <Col md={3} className="text-center">
              <Image
                src={userProfile?.avatarUrl || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'}
                roundedCircle
                className="profile-avatar"
                width={150}
                height={150}
              />
            </Col>
            <Col md={9}>
              <div className="profile-info">
                <h2>{userProfile?.fullName || 'User'}</h2>
                <p className="text-muted">{userProfile?.email}</p>
                
                <div className="profile-stats mb-3">
                  <span className="me-4">
                    <strong>{userProfile?.postsCount || 0}</strong> posts
                  </span>
                  <span className="me-4">
                    <strong>{userProfile?.followersCount || 0}</strong> followers
                  </span>
                  <span>
                    <strong>{userProfile?.followingCount || 0}</strong> following
                  </span>
                </div>

                {currentUser?.id === userId && (
                  <Button variant="outline-primary" size="sm">
                    Edit Profile
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Profile Content */}
      <Card>
        <Card.Body>
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="posts">Posts</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="activities">Activities</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="posts">
                <div className="user-posts-section">
                  <UserPosts userId={userId} />
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="activities">
                <div className="activities-section">
                  <Alert variant="info">
                    Activities feature coming soon!
                  </Alert>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
