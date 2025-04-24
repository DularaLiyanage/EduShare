import React, { useState, useEffect } from 'react';
import postService from '../Service/PostService';
import '../css/PostList.css'; 

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
    <div className="post-list-container">
      <h2>Posts</h2>

      {/* Create Post */}
      <div className="create-post">
        <h3>Create Post</h3>
        <textarea
          placeholder="Description"
          value={newPost.description}
          onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
        />
        <input
          type="file"
          multiple
          onChange={(e) => setNewPost({ ...newPost, files: e.target.files })}
        />
        <button onClick={handleCreatePost}>Create</button>
      </div>

      {/* Edit Post */}
      {editingPost && (
        <div className="edit-post">
          <h3>Edit Post</h3>
          <textarea
            placeholder="Description"
            value={editingPost.description}
            onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
          />
          <input
            type="file"
            multiple
            onChange={(e) => setEditingPost({ ...editingPost, files: e.target.files })}
          />
          <button onClick={handleUpdatePost}>Update</button>
          <button className="cancel" onClick={() => setEditingPost(null)}>Cancel</button>
        </div>
      )}

      {/* List Posts */}
      <div className="post-list">
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.description}</h3>
              {post.mediaUrls &&
                post.mediaUrls.map((url, index) => (
                  <img key={index} src={url} alt="Post media" />
                ))}
              <button onClick={() => setEditingPost(post)}>Edit</button>
              <button className="delete" onClick={() => handleDeletePost(post.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostList;