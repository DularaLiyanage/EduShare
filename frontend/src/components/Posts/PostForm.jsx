import React, { useState } from 'react';
import { Image } from 'react-bootstrap';

export function CreatePostForm({ onPostSubmit }) {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.slice(0, 3 - images.length);
    if (newFiles.length === 0) return;

    setImages([...images, ...newFiles]);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    const updatedPreviews = [...previewUrls];
    updatedPreviews.splice(index, 1);
    setPreviewUrls(updatedPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() && images.length === 0) return;

    const formData = new FormData();
    formData.append("description", description);
    formData.append("userId", "123"); // Replace with real user ID

    images.forEach((file) => formData.append("files", file));

    // Example use of PostService (must be defined)
    // PostService.createPost(formData).then(onPostSubmit);

    setDescription('');
    setImages([]);
    setPreviewUrls([]);
  };

  return (
    <div className="card shadow-sm p-3 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            placeholder="What's on your mind?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        {previewUrls.length > 0 && (
          <div className="d-flex gap-2 flex-wrap mb-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="position-relative">
                <Image
                  src={url}
                  alt="preview"
                  thumbnail
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="btn-close position-absolute top-0 end-0"
                  aria-label="Remove"
                  onClick={() => removeImage(index)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Add Images</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            disabled={images.length >= 3}
          />
          <small className="text-muted">{images.length}/3 images</small>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!description.trim() && images.length === 0}
        >
          Post
        </button>
      </form>
    </div>
  );
}
