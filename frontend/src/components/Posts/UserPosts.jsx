import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner, Alert, Image, Row, Col } from 'react-bootstrap';
import { getPostsByUserId } from '../../Service/PostService';

const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

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
    </Container>
  );
};

export default UserPosts;