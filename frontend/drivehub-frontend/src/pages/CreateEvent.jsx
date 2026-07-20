import { useState, useRef } from 'react';
import SideBar from '../components/layout/SideBar.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import { useNavigate } from 'react-router-dom';
import '../css/CreateEvent.css';
import api from '../api/axios';

function CreateEvent() {
  const navigate = useNavigate();
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
    formData.append('title', e.target.title.value);
    formData.append('description', e.target.description.value);
    formData.append('location', e.target.location.value);
    formData.append('start_date', `${e.target.date.value}T${e.target.time.value}:00`);
    formData.append('end_date', `${e.target.date.value}T${e.target.end_time.value || '18:00'}:00`);
    formData.append('slots', parseInt(e.target.slots.value));
    formData.append('event_type', e.target.event_type.value);
    if (imageFile) {
      formData.append('event_image', imageFile);
    }

    try {
      await api.post('/events/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/events');
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const messages = Object.entries(errors).map(([key, val]) =>
          `${key}: ${Array.isArray(val) ? val.join(', ') : val}`
        );
        setError(messages.join(' | '));
      } else {
        setError('Failed to create event.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SideBar />

      <main className="main-content create-event-page">

        <PageHeader
            subtitle="DriveHub Events"
            title="Create Event"
            description="Organize a meetup, track day or exclusive community experience."
        />

        <form className="create-event-layout" onSubmit={handleSubmit}>
          <div className="create-event-left">
            <div className="create-event-card">
              <h2>Event Details</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <label>Event Image</label>
              {imagePreview ? (
                <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ height: '180px' }}>
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
                  className="event-upload-box mb-3"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="bi bi-image"></i>
                  <span>Click to upload image</span>
                  <small>PNG or JPG up to 5MB</small>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="d-none"
              />

              <label>Event Name</label>
              <input type="text" name="title" placeholder="E.g.: Classic Cars Meet Lisbon" required />

              <label>Description</label>
              <textarea name="description" placeholder="Describe the event, route, rules and atmosphere..." required />

              <div className="create-event-row">
                <div>
                  <label>Date</label>
                  <input type="date" name="date" required />
                </div>
                <div>
                  <label>Start Time</label>
                  <input type="time" name="time" required />
                </div>
              </div>

              <div className="create-event-row">
                <div>
                  <label>End Time</label>
                  <input type="time" name="end_time" defaultValue="18:00" />
                </div>
                <div>
                  <label>Max Participants</label>
                  <input type="number" name="slots" placeholder="50" required />
                </div>
              </div>

              <label>Location</label>
              <input type="text" name="location" placeholder="E.g.: Praça do Comércio, Lisbon" required />
            </div>
          </div>

          <div className="create-event-right">
            <div className="create-event-card">
              <h2>Event Settings</h2>

              <label>Event Type</label>
              <select name="event_type" required>
                <option value="meetup">Meetup</option>
                <option value="trackday">Track Day</option>
                <option value="trip">Road Trip</option>
                <option value="race">Race</option>
              </select>

              <button type="submit" className="publish-event-btn" disabled={loading}>
                {loading ? 'Creating...' : 'Create Event'}
              </button>

              <button type="button" className="draft-event-btn" onClick={() => navigate('/events')}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}

export default CreateEvent;
