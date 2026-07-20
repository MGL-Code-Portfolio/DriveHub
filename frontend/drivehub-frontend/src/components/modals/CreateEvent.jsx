import '../../css/Modals.css';

function CreateEvent({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box create-event-modal">
        <div className="modal-header">
          <div>
            <h2>Create Event</h2>
            <p>Organize an amazing meetup</p>
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form className="modal-form">
          <div className="form-section">
            <h3>Event Details</h3>

            <label>Event Image</label>
            <div className="image-upload-box">
              <i className="bi bi-image"></i>
              <span>Click to add image</span>
              <small>PNG, JPG up to 5MB</small>
            </div>

            <label>Event Name</label>
            <input type="text" placeholder="E.g.: Classic Cars Meet in Sintra" />

            <label>Description</label>
            <textarea placeholder="Describe the event, route, rules..." />

            <div className="form-row">
              <div>
                <label>Date</label>
                <input type="date" />
              </div>

              <div>
                <label>Time</label>
                <input type="time" />
              </div>
            </div>

            <label>Location</label>
            <input type="text" placeholder="E.g.: Praça do Comércio, Lisbon" />

            <label>Maximum Number of Participants</label>
            <input type="number" placeholder="50" />
          </div>

          <div className="form-section">
            <label>Event Type</label>
            <select>
              <option>Select type</option>
              <option>Meetup</option>
              <option>Track Day</option>
              <option>Road Trip</option>
              <option>Showcase</option>
            </select>

            <label>Car Category</label>
            <select>
              <option>All</option>
              <option>Sports</option>
              <option>Electric</option>
              <option>Luxury</option>
              <option>Muscle</option>
            </select>

            <button type="submit" className="modal-primary-btn">
              Create Event
            </button>

            <button type="button" className="modal-secondary-btn">
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;