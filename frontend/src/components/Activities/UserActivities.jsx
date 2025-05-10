import React, { useState, useEffect } from 'react';
import { Card, Container, Spinner, Alert, Image, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCommentsByUserId } from '../../Service/CommentService';
import { getLikedPostIdsByUser } from '../../Service/LikeService';
import { getPostsByUserId } from '../../Service/PostService';
import { FaHeart, FaComment, FaUserPlus } from 'react-icons/fa';

const UserActivities = ({ userId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        // Fetch all activities
        const [comments, likedPosts, userPosts] = await Promise.all([
          getCommentsByUserId(userId),
          getLikedPostIdsByUser(userId),
          getPostsByUserId(userId)
        ]);

        // Combine and format activities
        const formattedActivities = [
          // Format comments
          ...comments.map(comment => ({
            type: 'comment',
            content: comment.content,
            postId: comment.postId,
            createdAt: comment.createdAt,
            postDescription: comment.postDescription || 'a post' // Fallback if no description
          })),
          
          // Format likes
          ...likedPosts.map(postId => ({
            type: 'like',
            postId: postId,
            createdAt: new Date() // You might want to add createdAt to your like model
          })),
          
          // Format posts
          ...userPosts.map(post => ({
            type: 'post',
            postId: post.id,
            description: post.description,
            createdAt: post.createdAt
          }))
        ];

        // Sort activities by date
        formattedActivities.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        setActivities(formattedActivities);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchActivities();
    }
  }, [userId]);

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

  const renderActivityIcon = (type) => {
    switch (type) {
      case 'like':
        return <FaHeart className="text-danger" />;
      case 'comment':
        return <FaComment className="text-primary" />;
      case 'post':
        return <FaUserPlus className="text-success" />;
      default:
        return null;
    }
  };

  const renderActivityContent = (activity) => {
    switch (activity.type) {
      case 'like':
        return (
          <span>
            liked a post
          </span>
        );
      case 'comment':
        return (
          <span>
            commented: "{activity.content}"
          </span>
        );
      case 'post':
        return (
          <span>
            created a post: "{activity.description}"
          </span>
        );
      default:
        return null;
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
      {activities.length === 0 ? (
        <Alert variant="info">No activities yet.</Alert>
      ) : (
        activities.map((activity, index) => (
          <Card key={index} className="mb-3">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="me-3">
                  {renderActivityIcon(activity.type)}
                </div>
                <div className="flex-grow-1">
                  {renderActivityContent(activity)}
                  <div className="text-muted small">
                    {formatTimestamp(activity.createdAt)}
                  </div>
                </div>
                {activity.postId && (
                  <Link 
                    to={`/posts/${activity.postId}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    View Post
                  </Link>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default UserActivities;