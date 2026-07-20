import { useState } from 'react';
import '../../css/Modals.css';
import api from '../../api/axios';

function EditEvent({ isOpen, onClose, eventData, onEventUpdated }) {
  if (!isOpen || !eventData) return null;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      location: formData.get('location'),
      slots: parseInt(formData.get('slots')),
      event_type: formData.get('event_type'),
    };

    try {
      await api.put(`/events/${eventData.id}/`, data);
      if (onEventUpdated) onEventUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating event:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box create-event-modal">
        <div className="modal-header">
          <div>
            <h2>Edit Event</h2>
            <p>Update your event details</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Event Information</h3>

            <label>Event Name</label>
            <input type="text" name="title" defaultValue={eventData.title} required />

            <label>Description</label>
            <textarea name="description" defaultValue={eventData.description} required />

            <label>Location</label>
            <input type="text" name="location" defaultValue={eventData.location} required />

            <label>Maximum Participants</label>
            <input type="number" name="slots" defaultValue={eventData.slots} required />
          </div>

          <div className="form-section">
            <h3>Event Settings</h3>

            <label>Event Type</label>
            <select name="event_type" defaultValue={eventData.event_type} required>
              <option value="meetup">Meetup</option>
              <option value="trackday">Track Day</option>
              <option value="trip">Road Trip</option>
              <option value="race">Race</option>
            </select>

            <button type="submit" className="modal-primary-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
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

export default EditEvent;
