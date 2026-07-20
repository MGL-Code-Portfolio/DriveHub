import '../../css/Modals.css';

function DeleteAccount({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 1100, background: 'rgba(0, 0, 0, 0.7)' }}>
      <div className="modal-box text-center p-4 shadow-lg bg-white" style={{ maxWidth: '400px', borderRadius: '20px' }}>
        <div className="mb-3 text-danger">
          <i className="bi bi-exclamation-octagon-fill" style={{ fontSize: '3.5rem' }}></i>
        </div>

        <h3 className="fw-bold mb-2 text-dark">Delete Account?</h3>
        <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
          This action is <strong>permanent</strong>. All your cars, events and followers will be lost forever. Are you absolutely sure?
        </p>

        <div className="d-flex flex-column gap-2">
          <button
            type="button"
            className="btn btn-danger w-100 py-2 fw-bold"
            onClick={onConfirm}
            style={{ borderRadius: '12px' }}
          >
            Yes, Delete my Account
          </button>
          <button
            type="button"
            className="btn btn-light border w-100 py-2 fw-semibold"
            onClick={onClose}
            style={{ borderRadius: '12px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccount;