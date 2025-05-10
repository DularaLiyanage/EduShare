import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Modal, Image, Form, Dropdown, Alert } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaComment, FaEllipsisH, FaTimes, FaUser, FaThumbsUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getAllPosts, deletePost } from '../../Service/PostService';
import { likePost, unlikePost, getLikeCount, getLikedPostIdsByUser, getUsersWhoLikedPost } from '../../Service/LikeService';
import { getCommentsByPostId, createComment, deleteComment, updateComment } from '../../Service/CommentService';
import CreatePostModal from './CreatePostModal';
import EditPostModal from './EditPostModal';
import { useAuth } from '../../context/AuthContext';
import '../../App.css';
import '../../index.css';
import '../../css/Post.css';

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
  const [expandedComments, setExpandedComments] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

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

      const likedIds = currentUser ? await getLikedPostIdsByUser(currentUser.id) : [];
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
      setExpandedComments(prev => ({ ...prev, [postId]: true }));
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const toggleComments = (postId) => {
    if (!expandedComments[postId]) {
      fetchComments(postId);
    } else {
      setExpandedComments(prev => ({ ...prev, [postId]: false }));
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
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="post-container py-4">
      {currentUser && (
        <Card className="mb-4 create-post-card">
          <Card.Body className="p-3">
            <div className="d-flex align-items-center">
              <Image 
                src={currentUser.photoURL || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'} 
                roundedCircle 
                width={40} 
                height={40} 
                className="me-3"
              />
              <Button 
                variant="light" 
                className="flex-grow-1 text-start post-input-placeholder"
                onClick={() => setShowCreateModal(true)}
              >
                What's on your mind?
              </Button>
            </div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between">
              <Button variant="link" className="text-muted" onClick={() => setShowCreateModal(true)}>
                <i className="bi bi-image-fill me-1"></i> Photo/Video
              </Button>
              <Button variant="link" className="text-muted">
                <i className="bi bi-people-fill me-1"></i> Tag Friends
              </Button>
              <Button variant="link" className="text-muted">
                <i className="bi bi-emoji-smile-fill me-1"></i> Feeling
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {posts.map(post => (
        <Card key={post.id} className="mb-4 post-card">
          <Card.Header className="d-flex justify-content-between align-items-center bg-white">
            <div className="d-flex align-items-center">
              <Link to={`/profile/${post.userId}`} className="text-decoration-none">
                <div className="d-flex align-items-center">
                  <Image 
                    src={post.userAvatar || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'} 
                    roundedCircle 
                    width={40} 
                    height={40} 
                    className="me-2"
                  />
                  <div>
                    <h6 className="mb-0 text-dark">
                      {post.userFullName || 'Anonymous User'}
                    </h6>
                    <small className="text-muted">{formatTimestamp(post.createdAt)}</small>
                  </div>
                </div>
              </Link>
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
          
          <Card.Body className="p-0">
            {post.description && (
              <div className="p-3">
                <Card.Text>{post.description}</Card.Text>
              </div>
            )}
            
            {post.mediaUrls?.length > 0 && (
              <div className="post-media-container">
                {post.mediaUrls.length === 1 ? (
                  <div className="single-media">
                    {post.mediaUrls[0].endsWith('.mp4') ? (
                      <video controls>
                        <source src={post.mediaUrls[0]} type="video/mp4" />
                      </video>
                    ) : (
                      <Image src={post.mediaUrls[0]} />
                    )}
                  </div>
                ) : (
                  <div className="media-carousel">
                    <div className="media-carousel-item">
                      <Image src={post.mediaUrls[currentImageIndex]} />
                    </div>
                    {post.mediaUrls.length > 1 && (
                      <>
                        <button 
                          className="carousel-arrow prev"
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === 0 ? post.mediaUrls.length - 1 : prev - 1
                          )}
                        >
                          ‹
                        </button>
                        <button 
                          className="carousel-arrow next"
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === post.mediaUrls.length - 1 ? 0 : prev + 1
                          )}
                        >
                          ›
                        </button>
                        <div className="image-counter">
                          {currentImageIndex + 1}/{post.mediaUrls.length}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card.Body>
          
          <Card.Footer className="bg-white">
          <div className="d-flex justify-content-between px-3 py-2 border-bottom">
              <div className="d-flex align-items-center">
                <Button
                  variant="link"
                  className="p-0 text-decoration-none text-muted"
                  onClick={() => handleViewLikers(post.id)}
                >
                  <FaThumbsUp className="me-1" /> {likeCounts[post.id] || 0} likes
                </Button>
                <span className="text-muted ms-3">
                  <FaComment className="me-1" /> {comments[post.id]?.length || 0} comments
                </span>
              </div>
            </div>

            <div className="d-flex justify-content-around py-2 border-bottom">
              <Button 
                variant="link" 
                className={`text-decoration-none ${userLikes[post.id] ? 'text-danger' : 'text-muted'}`}
                onClick={() => handleLike(post.id)}
              >
                <FaHeart className="me-1" /> Like
              </Button>
              <Button 
                variant="link" 
                className="text-decoration-none text-muted"
                onClick={() => toggleComments(post.id)}
              >
                <FaComment className="me-1" /> Comment
              </Button>
            </div>
            
            {expandedComments[post.id] && (
              <div className="p-3">
                {comments[post.id]?.map(comment => {
                  const isOwner = currentUser?.id === comment.userId;
                  const isEditing = editingCommentId === comment.id;

                  return (
                    <div key={comment.id} className="mb-3 d-flex">
                      <Image 
                        src={comment.userAvatar || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'} 
                        roundedCircle 
                        width={32} 
                        height={32} 
                        className="me-2"
                      />
                      <div className="flex-grow-1">
                        <div className="bg-light p-2 rounded">
                          <div className="d-flex justify-content-between">
                            <div>
                              <Link to={`/profile/${comment.userId}`} className="text-decoration-none">
                                <strong>{comment.userFullName || comment.userId}</strong>
                              </Link>
                              <small className="text-muted ms-2">{formatTimestamp(comment.createdAt)}</small>
                            </div>
                            {isOwner && (
                              <div>
                                {!isEditing && (
                                  <>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="text-muted p-0 me-1"
                                      onClick={() => {
                                        setEditingCommentId(comment.id);
                                        setEditingCommentText(comment.content);
                                      }}
                                    >
                                      ✏
                                    </Button>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="text-danger p-0"
                                      onClick={() => handleDeleteComment(comment.id, post.id)}
                                    >
                                      <FaTimes />
                                    </Button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="mt-2">
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={editingCommentText}
                                onChange={(e) => setEditingCommentText(e.target.value)}
                                className="mb-2"
                              />
                              <div>
                                <Button
                                  variant="primary"
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
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => setEditingCommentId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="mb-0 mt-1">{comment.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {currentUser && (
                  <Form className="mt-3 d-flex" onSubmit={(e) => {
                    e.preventDefault();
                    handleCommentSubmit(post.id);
                  }}>
                    <Image 
                      src={currentUser.photoURL || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'} 
                      roundedCircle 
                      width={32} 
                      height={32} 
                      className="me-2"
                    />
                    <Form.Group className="flex-grow-1">
                      <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder="Write a comment..."
                        value={commentText[post.id] || ''}
                        onChange={(e) => setCommentText(prev => ({
                          ...prev,
                          [post.id]: e.target.value
                        }))}
                        className="comment-input"
                      />
                    </Form.Group>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      type="submit"
                      className="ms-2 align-self-end"
                      disabled={!commentText[post.id]?.trim()}
                    >
                      Post
                    </Button>
                  </Form>
                )}
              </div>
            )}
          </Card.Footer>
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

      {/* Likes Modal */}
      <Modal show={showLikesModal} onHide={() => setShowLikesModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>People who liked this post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {likedUsers.length > 0 ? (
            <div className="list-group">
              {likedUsers.map((user, index) => (
                <div key={index} className="list-group-item border-0">
                  <div className="d-flex align-items-center">
                    <Image 
                      src={user.avatar || 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'} 
                      roundedCircle 
                      width={40} 
                      height={40} 
                      className="me-3"
                    />
                    <span>{user.fullName || `User ${user.id}`}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3">
              <FaThumbsUp size={24} className="mb-2 text-muted" />
              <p>No likes yet</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>

  );
};

export default PostList;