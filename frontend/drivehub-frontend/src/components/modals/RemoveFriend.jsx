import '../../css/Modals.css';

function RemoveFriend({ isOpen, onClose, onConfirm, friendName }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1100, background: 'rgba(0, 0, 0, 0.6)' }}>
      <div className="modal-box text-center p-4 shadow-lg bg-white" style={{ maxWidth: '400px', borderRadius: '16px', zIndex: 1110 }}>
        <div className="mb-3 text-danger">
          <i className="bi bi-person-x" style={{ fontSize: '3.5rem' }}></i>
        </div>

        <h3 className="fw-bold mb-2 text-dark">Remove Friend?</h3>
        <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
          Are you sure you want to remove <strong>{friendName}</strong> from your connections? This action will remove them from your friends list.
        </p>

        <div className="d-flex gap-2 justify-content-center">
          <button
            type="button"
            className="btn btn-light border px-4 fw-semibold"
            onClick={onClose}
            style={{ borderRadius: '10px', fontSize: '0.9rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger px-4 fw-semibold"
            onClick={onConfirm}
            style={{ borderRadius: '10px', fontSize: '0.9rem' }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemoveFriend;