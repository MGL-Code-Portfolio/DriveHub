import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../components/layout/SideBar.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Avatar from '../components/layout/Avatar.jsx';
import '../css/Profile.css';
import api from '../api/axios';

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, vehiclesRes] = await Promise.all([
          api.get(`/users/${id}/`),
          api.get(`/vehicles/?user_id=${id}`),
        ]);
        setProfileUser(userRes.data);
        setVehicles(vehiclesRes.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <>
        <SideBar />
        <main className="main-content profile-page">
          <p className="text-muted p-4">Loading profile...</p>
        </main>
      </>
    );
  }

  if (!profileUser) {
    return (
      <>
        <SideBar />
        <main className="main-content profile-page">
          <p className="text-muted p-4">User not found.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <SideBar />

      <main className="main-content profile-page">
        <section className="profile-card">
          <PageHeader>
            <div className="profile-info">
              <Avatar src={profileUser.profile_picture} alt={profileUser.username} size="profile" />
              <div>
                <h1>{profileUser.first_name} {profileUser.last_name}</h1>
                <p className="username">@{profileUser.username}</p>
                <div className="profile-meta">
                  {profileUser.location && <span><i className="bi bi-geo-alt-fill"></i> {profileUser.location}</span>}
                  <span><i className="bi bi-calendar-fill"></i> Joined {new Date(profileUser.date_joined).getFullYear()}</span>
                </div>
              </div>
            </div>

            {profileUser.bio && (
              <p className="profile-bio">{profileUser.bio}</p>
            )}
          </PageHeader>

          <div className="profile-content">
            <div className="showcase-title">
              <h2>Garage</h2>
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
              <p className="text-muted">No vehicles yet.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default UserProfile;
