import { useState } from 'react';
import '../../css/Modals.css';
import Avatar from '../layout/Avatar.jsx';
import api from '../../api/axios';

function EventDetails({ isOpen, onClose, event, isJoined, onLeave, onJoin }) {
  if (!isOpen || !event) return null;

  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  const handleJoin = async (role = 'spectator') => {
    setError('');
    setJoining(true);

    try {
      await api.post(`/events/${event.id}/participants/`, { role });
      if (onJoin) await onJoin(event.id);
      onClose();
    } catch (err) {
      const data = err.response?.data;
      if (data?.error) {
        setError(data.error);
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError('Failed to join event. Please try again.');
      }
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box event-details-modal">
        <div className="modal-header">
          <div>
            <h2>Event Details</h2>
            <p>{isJoined ? 'You are participating in this event' : 'Discover this event'}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="event-details-content">
          <section className="event-details-main">
            <img src={event.event_image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900'} alt={event.title} className="event-details-image" />
            <div className="event-details-info">
              <h3>{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <div className="event-info-list">
                <p><i className="bi bi-calendar-event"></i><span>{new Date(event.start_date).toLocaleDateString()}</span></p>
                <p><i className="bi bi-clock"></i><span>{new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
                <p><i className="bi bi-geo-alt"></i><span>{event.location}</span></p>
                <p><i className="bi bi-people"></i><span>{event.participants_count}/{event.slots} participants</span></p>
              </div>
              <div className="event-progress">
                <div className="event-progress-text">
                  <span>Spots Filled</span>
                  <span>{Math.round((event.participants_count / event.slots) * 100)}%</span>
                </div>
                <div className="event-progress-bar">
                  <div style={{ width: `${(event.participants_count / event.slots) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </section>

          <aside className="event-details-side">
            <div className="event-organizer">
              <h4>Organizer</h4>
              <div>
                <Avatar src={event.creator_picture} alt={event.creator_name} size="md" />
                <div>
                  <strong>{event.creator_name}</strong>
                </div>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            {isJoined ? (
              <button className="modal-danger-btn" onClick={() => { onClose(); onLeave(event); }}>
                Leave Event
              </button>
            ) : (
              <>
                <button className="modal-primary-btn" onClick={() => handleJoin('spectator')} disabled={joining}>
                  {joining ? 'Joining...' : 'Join as Spectator'}
                </button>
                <button
                  className="modal-secondary-btn"
                  onClick={() => handleJoin('driver')}
                  disabled={joining}
                  style={{ marginTop: '8px' }}
                >
                  {joining ? 'Joining...' : 'Join as Driver'}
                </button>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
