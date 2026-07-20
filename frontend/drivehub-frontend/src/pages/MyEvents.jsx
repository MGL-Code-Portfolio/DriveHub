import { useState, useEffect } from 'react';
import SideBar from '../components/layout/SideBar.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import EventDetails from '../components/modals/EventDetails.jsx';
import ConfirmLeaveEvent from '../components/modals/ConfirmLeaveEvent.jsx';
import ConfirmDeleteEvent from '../components/modals/ConfirmDeleteEvent.jsx';
import EditEvent from '../components/modals/EditEvent.jsx';
import '../css/MyEvents.css';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

function MyEvents() {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [leaveEventModal, setLeaveEventModal] = useState(null);
  const [editEventModal, setEditEventModal] = useState(null);
  const [deleteEventModal, setDeleteEventModal] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createdEvents = events.filter(e => e.creator === user?.id);
  const joinedEvents = events.filter(e => e.creator !== user?.id);

  return (
    <>
      <SideBar />

      <main className="main-content my-events-page">
        <PageHeader
            title="My Events"
            description="Manage the events you created and the ones you joined."
        />

        <section id="created" className="my-events-section">
          <div className="section-heading">
            <div>
              <h2>My Created Events</h2>
              <p>{createdEvents.length} active events</p>
            </div>
          </div>

          {loading ? (
            <p className="text-muted">Loading events...</p>
          ) : (
            <div className="my-events-grid">
              {createdEvents.map((event) => (
                <article className="my-event-card" key={event.id}>
                  <img src={event.event_image || 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=900'} alt={event.title} />
                  <div className="my-event-content">
                    <div className="event-title-row">
                      <h3>{event.title}</h3>
                      <span className={event.is_finished ? 'status-warning' : 'status-active'}>
                        {event.is_finished ? 'Finished' : 'Active'}
                      </span>
                    </div>
                    <p><i className="bi bi-calendar-event"></i>{new Date(event.start_date).toLocaleDateString()}</p>
                    <p><i className="bi bi-geo-alt"></i>{event.location}</p>
                    <p><i className="bi bi-people"></i>{event.participants_count}/{event.slots} participants</p>
                    <div className="progress-bar"><div style={{ width: `${(event.participants_count / event.slots) * 100}%` }}></div></div>
                    <div className="event-actions">
                      <button className="edit-btn" onClick={() => setEditEventModal(event)}>
                        <i className="bi bi-pencil-square"></i> Edit
                      </button>
                      <button className="delete-btn" onClick={() => setDeleteEventModal(event)}>
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="joined" className="my-events-section">
          <div className="section-heading">
            <div>
              <h2>Events Joined</h2>
              <p>Events you are participating in</p>
            </div>
          </div>

          {loading ? (
            <p className="text-muted">Loading events...</p>
          ) : (
            <div className="my-events-grid">
              {joinedEvents.map((event) => (
                <article className="my-event-card" key={event.id}>
                  <img src={event.event_image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900'} alt={event.title} />
                  <div className="my-event-content">
                    <h3>{event.title}</h3>
                    <p><i className="bi bi-calendar-event"></i>{new Date(event.start_date).toLocaleDateString()}</p>
                    <p><i className="bi bi-geo-alt"></i>{event.location}</p>
                    <p><i className="bi bi-people"></i>{event.participants_count}/{event.slots} participants</p>
                    <div className="progress-bar"><div style={{ width: `${(event.participants_count / event.slots) * 100}%` }}></div></div>
                    <div className="event-actions">
                      <button className="leave-btn" onClick={() => setLeaveEventModal(event)}>
                        Leave Event
                      </button>
                      <button className="details-btn" onClick={() => setSelectedEvent(event)}>
                        <i className="bi bi-info-circle"></i> Event Details
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <EventDetails
          isOpen={selectedEvent !== null}
          event={selectedEvent}
          isJoined={true}
          onClose={() => setSelectedEvent(null)}
          onLeave={(event) => setLeaveEventModal(event)}
        />

        <ConfirmLeaveEvent
          isOpen={leaveEventModal !== null}
          eventName={leaveEventModal?.title}
          eventId={leaveEventModal?.id}
          onClose={() => setLeaveEventModal(null)}
          onConfirm={() => { setLeaveEventModal(null); fetchEvents(); }}
        />

        <ConfirmDeleteEvent
          isOpen={deleteEventModal !== null}
          eventName={deleteEventModal?.title}
          eventId={deleteEventModal?.id}
          onClose={() => setDeleteEventModal(null)}
          onConfirm={() => { setDeleteEventModal(null); fetchEvents(); }}
        />

        <EditEvent
          isOpen={editEventModal !== null}
          eventData={editEventModal}
          onClose={() => setEditEventModal(null)}
          onEventUpdated={fetchEvents}
        />
      </main>
    </>
  );
}

export default MyEvents;
