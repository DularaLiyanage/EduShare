import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Modal, Image } from 'react-bootstrap';
import { getAllPosts, deletePost } from '../../Service/PostService';
import CreatePostModal from './CreatePostModal';
import EditPostModal from './EditPostModal';
import { useAuth } from '../../context/AuthContext';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        fetchPosts();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
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
        <div className="alert alert-danger">Error: {error}</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {currentUser && (
        <Row className="mb-4">
          <Col>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create New Post
            </Button>
          </Col>
        </Row>
      )}

      {posts.length === 0 ? (
        <div className="text-center mt-5">
          <h4>No posts found</h4>
        </div>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="mb-4">
            <Card.Body>
              <Card.Title>{post.description}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                Posted by: {post.userId}
              </Card.Subtitle>
              
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <Row className="mt-3">
                  {post.mediaUrls.map((url, index) => (
                    <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                      <Image 
                        src={url} 
                        thumbnail 
                        onClick={() => openImageModal(url)}
                        style={{ cursor: 'pointer' }}
                      />
                    </Col>
                  ))}
                </Row>
              )}
              
              {currentUser && currentUser.id === post.userId && (
                <div className="mt-3">
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2"
                    onClick={() => {
                      setSelectedPost(post);
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      <CreatePostModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        refreshPosts={fetchPosts}
      />

      <EditPostModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        post={selectedPost}
        refreshPosts={fetchPosts}
      />

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={selectedImage} fluid />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PostList;