import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { createPost } from '../../Service/PostService';
import { useAuth } from '../../context/AuthContext';

const CreatePostModal = ({ show, onHide, refreshPosts }) => {
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileErrors, setFileErrors] = useState([]);
  const fileInputRef = useRef(null);
  const { currentUser } = useAuth();

  const MAX_FILES = 3;
  const MAX_VIDEO_DURATION = 30; // seconds
  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    // Check file type
    if (![...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].includes(file.type)) {
      return `${file.name}: File type not allowed. Only JPEG, PNG, GIF, MP4, MOV, and AVI are supported.`;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name}: File size exceeds the maximum limit of 10MB.`;
    }

    return null;
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('video/')) {
        resolve(null); // Not a video, no duration check needed
        return;
      }

      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > MAX_VIDEO_DURATION) {
          reject(`${file.name}: Video must be ${MAX_VIDEO_DURATION} seconds or less (current: ${Math.round(video.duration)}s).`);
        } else {
          resolve(null);
        }
      };
      
      video.onerror = () => {
        reject(`${file.name}: Invalid video file or cannot read video metadata.`);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate number of files
    if (selectedFiles.length > MAX_FILES) {
      setFileErrors([`Maximum ${MAX_FILES} files allowed per post.`]);
      fileInputRef.current.value = '';
      return;
    }

    // Basic validation for each file
    const basicErrors = selectedFiles.map(validateFile).filter(Boolean);
    
    if (basicErrors.length > 0) {
      setFileErrors(basicErrors);
      fileInputRef.current.value = '';
      return;
    }

    // Validate video durations
    setLoading(true);
    try {
      // Process all video validation promises
      const videoValidationPromises = selectedFiles.map(file => 
        file.type.startsWith('video/') ? validateVideoDuration(file) : Promise.resolve(null)
      );
      
      const results = await Promise.allSettled(videoValidationPromises);
      const videoErrors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);
      
      if (videoErrors.length > 0) {
        setFileErrors(videoErrors);
        fileInputRef.current.value = '';
        setLoading(false);
        return;
      }
      
      // If all validations pass
      setFiles(selectedFiles);
      setFileErrors([]);

    } catch (err) {
      setFileErrors(['Error validating files. Please try again.']);
      fileInputRef.current.value = '';
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (fileErrors.length > 0) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      await createPost(files, description, currentUser.id);
      refreshPosts();
      onHide();
      setDescription('');
      setFiles([]);
      setFileErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setFiles([]);
    setDescription('');
    setError(null);
    setFileErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={handleModalClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {fileErrors.length > 0 && (
          <Alert variant="warning">
            <strong>File issues:</strong>
            <ul className="mb-0 mt-2">
              {fileErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your knowledge, ask a question, or share a skill..."
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Attach Files (Optional)</Form.Label>
            <Form.Control
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif,video/mp4,video/quicktime,video/x-msvideo"
            />
            <Form.Text className="text-muted">
              <ul className="mt-2 ps-3">
                <li>Maximum {MAX_FILES} files per post</li>
                <li>Videos must be {MAX_VIDEO_DURATION} seconds or less</li>
                <li>Maximum file size: 10MB</li>
                <li>Allowed types: JPEG, PNG, GIF, MP4, MOV, AVI</li>
              </ul>
            </Form.Text>
          </Form.Group>

          {files.length > 0 && (
            <div className="mb-3">
              <p className="mb-2">Selected files:</p>
              <div className="d-flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <Badge 
                    key={index} 
                    bg={file.type.startsWith('video/') ? 'danger' : 'primary'}
                    className="p-2"
                  >
                    {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    {file.type.startsWith('video/') && ' [VIDEO]'}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleModalClose} className="me-2">
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading || fileErrors.length > 0}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" />
                  <span className="ms-2">Posting...</span>
                </>
              ) : (
                'Share'
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;