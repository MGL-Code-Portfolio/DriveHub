import '../../css/Modals.css';
import api from '../../api/axios';

function ConfirmDeleteEvent({ isOpen, onClose, onConfirm, eventName, eventId }) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await api.delete(`/events/${eventId}/`);
      if (onConfirm) onConfirm();
    } catch (err) {
      console.error('Error deleting event:', err.response?.data);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-box">
        <div className="confirm-modal-icon danger-icon">
          <i className="bi bi-trash"></i>
        </div>
        <h2>Delete Event?</h2>
        <p>
          You are about to permanently delete
          <strong> {eventName}</strong>.
          This action cannot be undone.
        </p>
        <div className="confirm-modal-actions">
          <button className="confirm-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-delete-btn" onClick={handleConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteEvent;
