import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Image, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserPosts from '../components/Posts/UserPosts';
import { getUserProfile } from '../Service/UserService';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../Service/FollowService';
import UserActivities from '../components/Activities/UserActivities';
import './profile.css';

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

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
        setUserProfile(profileData);
        
        // Check if current user is following this user
        if (currentUser && currentUser.id !== userId) {
          const followers = await getFollowers(userId);
          setIsFollowing(followers.some(f => f.id === currentUser.id));
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, currentUser]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(currentUser.id, userId);
      } else {
        await followUser(currentUser.id, userId);
      }
      setIsFollowing(!isFollowing);
      // Refresh profile to update counts
      const profileData = await getUserProfile(userId);
      setUserProfile(profileData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShowFollowers = async () => {
    try {
      const followersList = await getFollowers(userId);
      setFollowers(followersList);
      setShowFollowersModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleShowFollowing = async () => {
    try {
      const followingList = await getFollowing(userId);
      setFollowing(followingList);
      setShowFollowingModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

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
                  <span 
                    className="me-4 clickable" 
                    onClick={handleShowFollowers}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{userProfile?.followersCount || 0}</strong> followers
                  </span>
                  <span 
                    className="clickable" 
                    onClick={handleShowFollowing}
                    style={{ cursor: 'pointer' }}
                  >
                    <strong>{userProfile?.followingCount || 0}</strong> following
                  </span>
                </div>

                {currentUser?.id === userId ? (
                  <Button variant="outline-primary" size="sm">
                    Edit Profile
                  </Button>
                ) : (
                  <Button 
                    variant={isFollowing ? "outline-secondary" : "primary"} 
                    size="sm"
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Followers Modal */}
      <Modal show={showFollowersModal} onHide={() => setShowFollowersModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Followers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {followers.map(follower => (
            <div key={follower.id} className="d-flex align-items-center mb-3">
              <Image
                src={follower.avatarUrl || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'}
                roundedCircle
                width={40}
                height={40}
                className="me-3"
              />
              <span>{follower.fullName}</span>
            </div>
          ))}
        </Modal.Body>
      </Modal>

      {/* Following Modal */}
      <Modal show={showFollowingModal} onHide={() => setShowFollowingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Following</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {following.map(followed => (
            <div key={followed.id} className="d-flex align-items-center mb-3">
              <Image
                src={followed.avatarUrl || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'}
                roundedCircle
                width={40}
                height={40}
                className="me-3"
              />
              <span>{followed.fullName}</span>
            </div>
          ))}
        </Modal.Body>
      </Modal>

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
                  <UserActivities userId={userId} />
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
