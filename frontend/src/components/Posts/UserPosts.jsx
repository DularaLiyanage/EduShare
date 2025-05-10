import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner, Alert, Image, Row, Col, Dropdown, Button } from 'react-bootstrap';
import { getPostsByUserId, deletePost } from '../../Service/PostService';
import { useAuth } from '../../context/AuthContext';
import { FaEllipsisH } from 'react-icons/fa';
import EditPostModal from './EditPostModal';

const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { currentUser } = useAuth();

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const data = await getPostsByUserId(userId);
      setPosts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        fetchUserPosts();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {posts.length === 0 ? (
        <Alert variant="info">This user hasn't posted anything yet.</Alert>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center bg-white">
              <div>
                <h6 className="mb-0">You</h6>
                <small className="text-muted">
                  {formatTimestamp(post.createdAt)}
                </small>
              </div>
              {currentUser?.id === post.userId && (
                <Dropdown>
                  <Dropdown.Toggle variant="link" id="post-options" className="text-muted p-0">
                    <FaEllipsisH />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {
                      setSelectedPost(post);
                      setShowEditModal(true);
                    }}>
                      Edit Post
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDelete(post.id)} className="text-danger">
                      Delete Post
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Card.Header>
            <Card.Body>
              <Card.Text>{post.description}</Card.Text>
              
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <Row className="mt-3">
                  {post.mediaUrls.map((url, index) => (
                    <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                      <Image src={url} thumbnail fluid />
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      <EditPostModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        post={selectedPost}
        refreshPosts={fetchUserPosts}
      />
    </Container>
  );
};

export default UserPosts;