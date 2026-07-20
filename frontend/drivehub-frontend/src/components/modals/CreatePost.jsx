import { useState, useRef } from 'react';
import '../../css/Modals.css';
import api from '../../api/axios';

function CreatePost({ isOpen, onClose, onPostCreated }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('content', e.target.content.value);
    if (imageFile) {
      formData.append('media', imageFile);
    }

    try {
      await api.post('/posts/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (onPostCreated) onPostCreated();
      handleRemoveImage();
      onClose();
    } catch (err) {
      console.error('Error creating post:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100, background: 'rgba(0, 0, 0, 0.6)' }}>
      <div
        className="modal-box"
        style={{
          maxWidth: '550px',
          width: '100%',
          borderRadius: '16px',
          padding: '24px',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          position: 'relative'
        }}
      >
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
          <div>
            <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.25rem' }}>Create New Post</h4>
          </div>
          <button
            type="button"
            className="btn btn-light rounded-circle d-flex align-items-center justify-content-center border-0 p-0"
            onClick={onClose}
            style={{ width: '32px', height: '32px', cursor: 'pointer', backgroundColor: '#f8f9fa' }}
          >
            <i className="bi bi-x-lg text-secondary" style={{ fontSize: '0.9rem' }}></i>
          </button>
        </div>

        <form onSubmit={handlePostSubmit}>
          <textarea
            name="content"
            className="form-control mb-3"
            rows="4"
            placeholder="What's on your mind? Share your latest ride..."
            style={{
              fontSize: '1rem',
              resize: 'none',
              backgroundColor: '#f8f9fa',
              border: '1px solid #dee2e6',
              borderRadius: '12px',
              padding: '15px',
            }}
            required
            autoFocus
          />

          {imagePreview ? (
            <div className="position-relative mb-3 rounded-3 overflow-hidden" style={{ maxHeight: '200px' }}>
              <img src={imagePreview} alt="Preview" className="w-100" style={{ objectFit: 'cover', maxHeight: '200px', borderRadius: '12px' }} />
              <button
                type="button"
                className="btn btn-dark btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                onClick={handleRemoveImage}
                style={{ width: '28px', height: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="bi bi-x-lg" style={{ fontSize: '0.7rem' }}></i>
              </button>
            </div>
          ) : (
            <div
              className="d-flex flex-column align-items-center justify-content-center rounded-3 mb-3"
              style={{
                height: '140px',
                border: '2px dashed #dee2e6',
                cursor: 'pointer',
                backgroundColor: '#f8f9fa',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="bi bi-image text-muted mb-2" style={{ fontSize: '1.8rem' }}></i>
              <span className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>Add a photo</span>
              <span className="text-muted" style={{ fontSize: '0.78rem' }}>Click to browse</span>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="d-none"
          />

          <div className="d-flex justify-content-end pt-2 border-top">
            <button
              type="submit"
              className="btn btn-aqua fw-bold px-4 rounded-3"
              disabled={loading}
              style={{ padding: '10px 24px', fontSize: '0.95rem' }}
            >
              {loading ? 'Posting...' : 'Post to Community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
