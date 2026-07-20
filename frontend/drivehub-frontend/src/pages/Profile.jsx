import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/layout/SideBar.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Avatar from '../components/layout/Avatar.jsx';
import FriendsList from "../components/modals/FriendsList.jsx";
import ManageAccount from "../components/modals/ManageAccount.jsx";
import '../css/Profile.css';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [eventsCount, setEventsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, eventsRes] = await Promise.all([
          api.get('/vehicles/'),
          api.get('/events/'),
        ]);
        setVehicles(vehiclesRes.data);
        setEventsCount(eventsRes.data.length);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <SideBar />

      <main className="main-content profile-page">
        <section className="profile-card">
          <PageHeader
            action={
              <button className="manage-btn" onClick={() => setIsManageOpen(true)}>
                <i className="bi bi-gear-fill"></i>
                Manage Account
              </button>
            }
          >
            <div className="profile-info">
              <Avatar src={user?.profile_picture} alt={user?.username} size="profile" />
              <div>
                <h1>{user?.first_name} {user?.last_name}</h1>
                <p className="username">@{user?.username}</p>
                <div className="profile-meta">
                  {user?.location && <span><i className="bi bi-geo-alt-fill"></i> {user.location}</span>}
                  <span><i className="bi bi-calendar-fill"></i> Joined {new Date(user?.date_joined).getFullYear()}</span>
                </div>
              </div>
            </div>

            {user?.bio && (
              <p className="profile-bio">{user.bio}</p>
            )}

            <div className="profile-stats">
              <div>
                <strong>{vehicles.length}</strong>
                <span>Vehicles</span>
              </div>
              <div>
                <strong>{eventsCount}</strong>
                <span>Events</span>
              </div>
            </div>
          </PageHeader>

          <div className="profile-content">
            <div className="showcase-title">
              <h2>My Garage</h2>
              <span className="link-aqua" style={{ cursor: 'pointer' }} onClick={() => navigate('/garage')}>View All</span>
            </div>

            {vehicles.length > 0 ? (
              <div className="cars-grid">
                {vehicles.slice(0, 6).map((vehicle) => (
                  <img
                    key={vehicle.id}
                    src={vehicle.car_picture || `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500`}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted">No vehicles yet. <span className="link-aqua" style={{ cursor: 'pointer' }} onClick={() => navigate('/garage')}>Add one!</span></p>
            )}

            <div className="profile-actions">
              <button className="action-btn active" onClick={() => navigate('/my-events')}>
                <i className="bi bi-calendar-event-fill"></i>
                My Events
              </button>
              <button className="action-btn" onClick={() => setIsFriendsOpen(true)}>
                <i className="bi bi-people"></i>
                Friends List
              </button>
              <button className="action-btn" onClick={() => navigate('/garage')}>
                <i className="bi bi-car-front-fill"></i>
                My Garage
              </button>
            </div>
          </div>
        </section>
      </main>

      <ManageAccount isOpen={isManageOpen} onClose={() => setIsManageOpen(false)} />
      <FriendsList isOpen={isFriendsOpen} onClose={() => setIsFriendsOpen(false)} />
    </>
  );
}

export default Profile;
