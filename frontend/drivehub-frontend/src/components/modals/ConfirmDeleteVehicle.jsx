import '../../css/Modals.css';
import api from '../../api/axios';

function ConfirmDeleteVehicle({ isOpen, onClose, onConfirm, vehicleName, vehicleId }) {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await api.delete(`/vehicles/${vehicleId}/`);
      if (onConfirm) onConfirm();
    } catch (err) {
      console.error('Error deleting vehicle:', err.response?.data);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box text-center p-4" style={{ maxWidth: '400px' }}>
        <div className="mb-3 text-danger">
          <i className="bi bi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
        </div>
        <h3 className="fw-bold mb-2">Are you sure?</h3>
        <p className="text-muted mb-4">
          You are about to remove <strong>{vehicleName}</strong> from your garage. This action cannot be undone.
        </p>
        <div className="d-flex gap-2 justify-content-center">
          <button type="button" className="btn btn-secondary px-4 fw-semibold" onClick={onClose} style={{ borderRadius: '10px' }}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger px-4 fw-semibold" onClick={handleConfirm} style={{ borderRadius: '10px' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteVehicle;
