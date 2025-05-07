import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Modal, Image, Form } from 'react-bootstrap';
import { getAllPosts, deletePost } from '../../Service/PostService';
import { likePost, unlikePost, getLikeCount } from '../../Service/LikeService';
import { getCommentsByPostId, createComment, deleteComment } from '../../Service/CommentService';
import CreatePostModal from './CreatePostModal';
import EditPostModal from './EditPostModal';
import { useAuth } from '../../context/AuthContext';
import '../../index.css';  // Default styles
import '../../App.css';


const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
      
      const counts = {};
      const likes = {};
      for (const post of data) {
        counts[post.id] = await getLikeCount(post.id);
        likes[post.id] = false;
      }
      setLikeCounts(counts);
      setUserLikes(likes);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const data = await getCommentsByPostId(postId);
      setComments(prev => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        fetchPosts();
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText[postId]?.trim()) return;
    
    try {
      await createComment({
        content: commentText[postId],
        postId,
        userId: currentUser.id
      });
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      fetchComments(postId);
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await deleteComment(commentId);
      fetchComments(postId);
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handleLike = async (postId) => {
    try {
      if (userLikes[postId]) {
        await unlikePost(currentUser.id, postId);
        setUserLikes(prev => ({ ...prev, [postId]: false }));
        setLikeCounts(prev => ({ ...prev, [postId]: prev[postId] - 1 }));
      } else {
        await likePost(currentUser.id, postId);
        setUserLikes(prev => ({ ...prev, [postId]: true }));
        setLikeCounts(prev => ({ ...prev, [postId]: prev[postId] + 1 }));
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
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

      {posts.map(post => (
        <Card key={post.id} className="post-card mb-4">
          <Card.Body>
            <Card.Title>{post.description}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Posted by: {post.userId}
            </Card.Subtitle>
            
            {post.mediaUrls?.length > 0 && (
              <Row className="mt-3">
                {post.mediaUrls.map((url, index) => (
                  <Col key={index} xs={6} md={4} lg={3} className="mb-3">
                    <Image src={url} thumbnail style={{ cursor: 'pointer' }} />
                  </Col>
                ))}
              </Row>
            )}
            
            <div className="d-flex align-items-center mt-3">
              <Button 
                variant={userLikes[post.id] ? 'primary' : 'outline-primary'} 
                size="sm"
                onClick={() => handleLike(post.id)}
                className="me-2"
              >
                Like
              </Button>
              <span>{likeCounts[post.id] || 0} likes</span>
            </div>
            
            <div className="mt-3">
              <h6>Comments</h6>
              {!comments[post.id] && (
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => fetchComments(post.id)}
                >
                  View comments
                </Button>
              )}
              
              {comments[post.id]?.map(comment => (
                <div key={comment.id} className="mb-2 p-2 bg-light rounded">
                  <div className="d-flex justify-content-between">
                    <strong>{comment.userId}</strong>
                    {currentUser?.id === comment.userId && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-danger"
                        onClick={() => handleDeleteComment(comment.id, post.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  <p className="mb-0">{comment.content}</p>
                </div>
              ))}
              
              {currentUser && (
                <Form className="mt-2" onSubmit={(e) => {
                  e.preventDefault();
                  handleCommentSubmit(post.id);
                }}>
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Add a comment..."
                      value={commentText[post.id] || ''}
                      onChange={(e) => setCommentText(prev => ({
                        ...prev,
                        [post.id]: e.target.value
                      }))}
                    />
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    type="submit"
                    className="mt-2"
                  >
                    Post Comment
                  </Button>
                </Form>
              )}
            </div>
            
            {currentUser?.id === post.userId && (
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
      ))}

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
    </Container>
  );
};

export default PostList;
