import React, { useState, useEffect } from 'react';
import postService from '../../Service/PostService';
import '../../css/PostList.css'; 

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ description: '', files: [] });
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postService.getAllPosts();
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    }
  };

  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append('description', newPost.description);
      formData.append('userId', '123'); // Replace with actual user ID
      Array.from(newPost.files).forEach((file) => formData.append('files', file));

      const createdPost = await postService.createPost(formData);
      setPosts([createdPost, ...posts]);
      setNewPost({ description: '', files: [] });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdatePost = async () => {
    try {
      const formData = new FormData();
      formData.append('description', editingPost.description);
      if (editingPost.files) {
        Array.from(editingPost.files).forEach((file) => formData.append('files', file));
      }

      const updatedPost = await postService.updatePost(editingPost.id, formData);
      setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
      setEditingPost(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await postService.deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Posts</h2>

      {/* Create Post */}
      <div className="card mb-4 p-4">
        <h3>Create Post</h3>
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            placeholder="Description"
            value={newPost.description}
            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="file"
            multiple
            className="form-control"
            onChange={(e) => setNewPost({ ...newPost, files: e.target.files })}
          />
        </div>
        <button className="btn btn-primary" onClick={handleCreatePost}>Create</button>
      </div>

      {/* Edit Post */}
      {editingPost && (
        <div className="card mb-4 p-4">
          <h3>Edit Post</h3>
          <div className="form-group mb-3">
            <textarea
              className="form-control"
              placeholder="Description"
              value={editingPost.description}
              onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="file"
              multiple
              className="form-control"
              onChange={(e) => setEditingPost({ ...editingPost, files: e.target.files })}
            />
          </div>
          <button className="btn btn-success" onClick={handleUpdatePost}>Update</button>
          <button className="btn btn-secondary ml-2" onClick={() => setEditingPost(null)}>Cancel</button>
        </div>
      )}

      {/* List Posts */}
      <div className="post-list">
        <ul className="list-group">
          {posts.map((post) => (
            <li key={post.id} className="list-group-item mb-3">
              <h5>{post.description}</h5>
              {post.mediaUrls &&
                post.mediaUrls.map((url, index) => (
                  <img key={index} src={url} alt="Post media" className="img-fluid mb-2" />
                ))}
              <button className="btn btn-warning mr-2" onClick={() => setEditingPost(post)}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDeletePost(post.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostList;