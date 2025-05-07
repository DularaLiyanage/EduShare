import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Image, Container } from 'react-bootstrap';
import { getPostById, deletePost } from '../../Service/PostService';
import { useAuth } from '../../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setPost(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        navigate('/');
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

  if (!post) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Post not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>{post.description}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Posted by: {post.userId}
          </Card.Subtitle>
          
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="mt-3">
              {post.mediaUrls.map((url, index) => (
                <Image 
                  key={index} 
                  src={url} 
                  thumbnail 
                  fluid 
                  className="mb-3"
                />
              ))}
            </div>
          )}
          
          {currentUser && currentUser.id === post.userId && (
            <div className="mt-3">
              <Button 
                variant="danger"
                onClick={handleDelete}
              >
                Delete Post
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostDetail;