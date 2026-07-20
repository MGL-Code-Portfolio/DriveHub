import { useState } from 'react';
import '../../css/Modals.css';
import api from '../../api/axios';

function EditVehicle({ isOpen, onClose, vehicleData, onVehicleUpdated }) {
  if (!isOpen || !vehicleData) return null;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = {
      brand: formData.get('brand'),
      model: formData.get('model'),
      year: parseInt(formData.get('year')),
      vehicle_type: formData.get('vehicle_type'),
      description: formData.get('description') || '',
    };

    try {
      await api.put(`/vehicles/${vehicleData.id}/`, data);
      if (onVehicleUpdated) onVehicleUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating vehicle:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box create-event-modal">
        <div className="modal-header">
          <div>
            <h2>Edit Vehicle</h2>
            <p>Update vehicle details</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Vehicle Information</h3>

            <label>Brand</label>
            <input type="text" name="brand" defaultValue={vehicleData.brand} required />

            <label>Model</label>
            <input type="text" name="model" defaultValue={vehicleData.model} required />

            <label>Year</label>
            <input type="number" name="year" defaultValue={vehicleData.year} required />

            <label>Vehicle Type</label>
            <select name="vehicle_type" defaultValue={vehicleData.vehicle_type} required>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
            </select>

            <label>Description</label>
            <textarea name="description" defaultValue={vehicleData.description || ''} />
          </div>

          <button type="submit" className="modal-primary-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="modal-secondary-btn" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditVehicle;
