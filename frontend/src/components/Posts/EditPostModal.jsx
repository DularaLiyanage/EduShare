import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner, Image } from 'react-bootstrap';
import { updatePost } from '../../Service/PostService';

const EditPostModal = ({ show, onHide, post, refreshPosts }) => {
  const [description, setDescription] = useState(post?.description || '');
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updatePost(post.id, files, description);
      refreshPosts();
      onHide();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          {post.mediaUrls?.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Current Media</Form.Label>
              <div className="d-flex flex-wrap">
                {post.mediaUrls.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    thumbnail
                    className="me-2 mb-2"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                ))}
              </div>
              <Form.Text className="text-muted">
                Upload new files to replace these.
              </Form.Text>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>New Files (Optional)</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*,video/*"
            />
            <Form.Text className="text-muted">
              Leave empty to keep existing files.
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" />
                  <span className="ms-2">Updating...</span>
                </>
              ) : (
                'Update'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditPostModal;