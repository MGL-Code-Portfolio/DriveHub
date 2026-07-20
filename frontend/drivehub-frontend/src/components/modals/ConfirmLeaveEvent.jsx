import '../../css/Modals.css';
import api from '../../api/axios';

function ConfirmLeaveEvent({ isOpen, onClose, onConfirm, eventName, eventId }) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await api.delete(`/events/${eventId}/participants/`);
      if (onConfirm) onConfirm();
    } catch (err) {
      console.error('Error leaving event:', err.response?.data);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="confirm-modal-box">
        <div className="confirm-modal-icon warning-icon">
          <i className="bi bi-exclamation-triangle"></i>
        </div>
        <h2>Leave Event?</h2>
        <p>
          You are about to leave
          <strong> {eventName}</strong>.
          You will no longer participate in this event.
        </p>
        <div className="confirm-modal-actions">
          <button className="confirm-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-danger-btn" onClick={handleConfirm}>
            Leave Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmLeaveEvent;
