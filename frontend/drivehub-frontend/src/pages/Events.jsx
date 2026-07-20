import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../components/layout/SideBar.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import EventDetails from '../components/modals/EventDetails.jsx';
import ConfirmLeaveEvent from '../components/modals/ConfirmLeaveEvent.jsx';
import { Link } from 'react-router-dom';
import '../css/Events.css';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

function Events() {
  const { user } = useAuth();
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [leaveEventModal, setLeaveEventModal] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/');
      setEvents(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (eventId && events.length > 0) {
      const event = events.find(e => e.id === parseInt(eventId));
      if (event) {
        setSelectedEvent(event);
      }
    }
  }, [eventId, events]);

  const handleCloseDetails = () => {
    setSelectedEvent(null);
    navigate('/events', { replace: true });
  };

  const handleJoinEvent = async (joinEventId) => {
    try {
      await api.post(`/events/${joinEventId}/participants/`, { role: 'spectator' });
      await fetchEvents();
    } catch (err) {
      console.error('Error joining event:', err.response?.data);
    }
  };

  const createdEvents = events.filter(e => e.creator === user?.id);
  const joinedEvents = events.filter(e => e.is_participating && e.creator !== user?.id);

  return (
    <>
      <SideBar />

      <main className="main-content events-page">

        <PageHeader
            subtitle="DriveHub Events"
            title="Events"
            description="Discover car meetups, track days and exclusive community experiences."
            action={
              <Link to="/create-event" className="create-event-btn">
                <i className="bi bi-plus-lg"></i>
                Create Event
              </Link>
            }
        />

        {error && (
          <div className="alert alert-danger mx-4 mt-3">{error}</div>
        )}

        <section className="events-layout">

          <aside className="events-left-column">

            <div className="events-section-title">
              <h2>Created Events</h2>
            </div>

            {loading ? (
              <p className="text-muted">Loading events...</p>
            ) : createdEvents.length === 0 ? (
              <div className="text-center text-muted py-3">
                <p className="mb-1">No created events.</p>
                <Link to="/create-event" className="link-aqua small">Create one</Link>
              </div>
            ) : (
              <div className="mini-events-grid">
                {createdEvents.slice(0, 2).map((event) => (
                  <article className="mini-event-card" key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
                    <img src={event.event_image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600'} alt={event.title} />
                    <div>
                      <h3>{event.title}</h3>
                      <p>{event.location}</p>
                      <span>{new Date(event.start_date).toLocaleDateString()}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <Link to="/my-events#created" className="view-all-btn">
              View All
            </Link>

            <div className="events-section-title joined-title">
              <h2>Joined Events</h2>
            </div>

            {loading ? (
              <p className="text-muted">Loading events...</p>
            ) : joinedEvents.length === 0 ? (
              <div className="text-center text-muted py-3">
                <p className="mb-1">No joined events yet.</p>
              </div>
            ) : (
              <div className="mini-events-grid">
                {joinedEvents.slice(0, 2).map((event) => (
                  <article className="mini-event-card" key={event.id} onClick={() => navigate(`/events/${event.id}`)}>
                    <img src={event.event_image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600'} alt={event.title} />
                    <div>
                      <h3>{event.title}</h3>
                      <p>{event.location}</p>
                      <span>{new Date(event.start_date).toLocaleDateString()}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <Link to="/my-events#joined" className="view-all-btn">
              View All
            </Link>

          </aside>

          <section className="events-main-column">
            <div className="events-section-title">
              <h2>Upcoming Events</h2>
            </div>

            {loading ? (
              <p className="text-muted">Loading events...</p>
            ) : events.length === 0 ? (
              <div className="text-center text-muted py-4">
                <i className="bi bi-calendar-plus" style={{ fontSize: '2.5rem' }}></i>
                <p className="mt-2">No upcoming events.</p>
                <p>Be the first to <Link to="/create-event" className="link-aqua">create an event</Link>!</p>
              </div>
            ) : (
              <div className="upcoming-events-list">
                {events.map((event) => (
                  <article className="event-card" key={event.id}>
                    <img src={event.event_image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900'} alt={event.title} />
                    <div className="event-card-content">
                      <div>
                        <h3>{event.title}</h3>
                        <p><i className="bi bi-calendar-event"></i>{new Date(event.start_date).toLocaleDateString()}</p>
                        <p><i className="bi bi-geo-alt"></i>{event.location}</p>
                        <p><i className="bi bi-people"></i>{event.participants_count}/{event.slots} participants</p>
                      </div>
                      <div className="event-buttons">
                        <button className="details-btn" onClick={() => navigate(`/events/${event.id}`)}>
                          Event Details
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>

        <EventDetails
          isOpen={selectedEvent !== null}
          event={selectedEvent}
          isJoined={selectedEvent?.is_participating || false}
          onClose={handleCloseDetails}
          onLeave={(event) => setLeaveEventModal(event)}
          onJoin={handleJoinEvent}
        />

        <ConfirmLeaveEvent
          isOpen={leaveEventModal !== null}
          eventName={leaveEventModal?.title}
          eventId={leaveEventModal?.id}
          onClose={() => setLeaveEventModal(null)}
          onConfirm={() => { setLeaveEventModal(null); fetchEvents(); }}
        />
      </main>
    </>
  );
}

export default Events;
