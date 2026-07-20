import { useState, useRef } from 'react';
import '../../css/Modals.css';
import api from '../../api/axios';

function AddVehicle({ isOpen, onClose, onVehicleAdded }) {
  if (!isOpen) return null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('brand', e.target.brand.value);
    formData.append('model', e.target.model.value);
    formData.append('year', parseInt(e.target.year.value));
    formData.append('vehicle_type', e.target.vehicle_type.value);
    formData.append('description', e.target.description.value || '');
    if (imageFile) {
      formData.append('car_picture', imageFile);
    }

    try {
      await api.post('/vehicles/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (onVehicleAdded) onVehicleAdded();
      handleRemoveImage();
      onClose();
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const messages = Object.entries(errors).map(([key, val]) =>
          `${key}: ${Array.isArray(val) ? val.join(', ') : val}`
        );
        setError(messages.join(' | '));
      } else {
        setError('Failed to add vehicle. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box create-event-modal">
        <div className="modal-header">
          <div>
            <h2>Add New Vehicle</h2>
            <p>Add a new vehicle to your garage</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Vehicle Information</h3>

            {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

            <label>Brand</label>
            <input type="text" name="brand" placeholder="E.g.: Porsche" required />

            <label>Model</label>
            <input type="text" name="model" placeholder="E.g.: 911 Carrera" required />

            <label>Year</label>
            <input type="number" name="year" placeholder="2022" min="1900" max="2030" required />

            <label>Vehicle Type</label>
            <select name="vehicle_type" required>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
            </select>

            <label>Description</label>
            <textarea name="description" placeholder="Describe your vehicle, specs, modifications..." />
          </div>

          <div className="form-section">
            <h3>Photo</h3>

            {imagePreview ? (
              <div className="position-relative rounded-3 overflow-hidden" style={{ height: '180px' }}>
                <img src={imagePreview} alt="Preview" className="w-100 h-100" style={{ objectFit: 'cover', borderRadius: '8px' }} />
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
                className="image-upload-box"
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: 'pointer' }}
              >
                <i className="bi bi-camera"></i>
                <span>Upload vehicle photo</span>
                <small>PNG, JPG up to 5MB</small>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="d-none"
            />

            <button type="submit" className="modal-primary-btn" disabled={loading} style={{ marginTop: '24px' }}>
              {loading ? 'Adding...' : 'Add to Garage'}
            </button>

            <button type="button" className="modal-secondary-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVehicle;
