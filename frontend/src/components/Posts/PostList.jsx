import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Modal, Image, Form } from 'react-bootstrap';
import { getAllPosts, deletePost } from '../../Service/PostService';
import { likePost, unlikePost, getLikeCount, getLikedPostIdsByUser, getUsersWhoLikedPost  } from '../../Service/LikeService';
import { getCommentsByPostId, createComment, deleteComment, updateComment } from '../../Service/CommentService';
import CreatePostModal from './CreatePostModal';
import EditPostModal from './EditPostModal';
import { useAuth } from '../../context/AuthContext';

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
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [showLikesModal, setShowLikesModal] = useState(false);
const [likedUsers, setLikedUsers] = useState([]);



  useEffect(() => {
    fetchPosts();
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString(); // outputs like "5/7/2025, 4:31:20 AM"
  };
  

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
  
      // Like counts
      const counts = {};
      for (const post of data) {
        counts[post.id] = await getLikeCount(post.id);
      }
      setLikeCounts(counts);
  
      // Liked post IDs for current user
      const likedIds = currentUser ? await getLikedPostIdsByUser(currentUser.id) : [];
      const likes = {};
      for (const post of data) {
        likes[post.id] = likedIds.includes(post.id);
      }
      setUserLikes(likes);
  
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts or likes:', err);
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

  const handleViewLikers = async (postId) => {
    try {
      const users = await getUsersWhoLikedPost(postId);
      setLikedUsers(users);
      setShowLikesModal(true);
    } catch (err) {
      console.error('Error loading liked users:', err);
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
        <Card key={post.id} className="mb-4">
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
            
            {/* Like Button and Count */}
            <div className="d-flex align-items-center mt-3">
  <Button 
    variant={userLikes[post.id] ? 'primary' : 'outline-primary'} 
    size="sm"
    onClick={() => handleLike(post.id)}
    className="me-2"
  >
    {userLikes[post.id] ? 'Liked' : 'Like'}
  </Button>
  <Button
  variant="link"
  className="p-0 text-decoration-none"
  onClick={() => handleViewLikers(post.id)}
>
  {likeCounts[post.id] || 0} likes
</Button>

</div>

            
            {/* Comments Section */}
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
              
              {comments[post.id]?.map(comment => {
                const isOwner = currentUser?.id === comment.userId;
                const isEditing = editingCommentId === comment.id;

                return (
                  <div key={comment.id} className="mb-2 p-2 bg-light rounded">
                    <div className="d-flex justify-content-between">
                    <div>
  <strong>{comment.userFullName || comment.userId}</strong>
  <small className="text-muted ms-2">{formatTimestamp(comment.createdAt)}</small>
</div>


                      {isOwner && !isEditing && (
                        <div>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-primary"
                            onClick={() => {
                              setEditingCommentId(comment.id);
                              setEditingCommentText(comment.content);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="text-danger"
                            onClick={() => handleDeleteComment(comment.id, post.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                        />
                        <div className="mt-1">
                          <Button
                            variant="success"
                            size="sm"
                            className="me-2"
                            onClick={async () => {
                              try {
                                await updateComment(comment.id, editingCommentText);
                                setEditingCommentId(null);
                                fetchComments(post.id);
                              } catch (err) {
                                console.error('Error updating comment:', err);
                              }
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setEditingCommentId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <p className="mb-0">{comment.content}</p>
                    )}
                  </div>
                );
              })}

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

            {/* Edit/Delete Buttons (for post owner) */}
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

      {/* Post Creation & Editing Modals */}
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
      <Modal show={showLikesModal} onHide={() => setShowLikesModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Users who liked this post</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {likedUsers.length > 0 ? (
      <ul className="list-group">
        {likedUsers.map((user, index) => (
          <li key={index} className="list-group-item">
            {user.fullName}
          </li>
        ))}
      </ul>
    ) : (
      <p>No likes yet.</p>
    )}
  </Modal.Body>
</Modal>

    </Container>
  );
};

export default PostList;
