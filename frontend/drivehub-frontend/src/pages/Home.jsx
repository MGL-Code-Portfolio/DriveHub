import SideBar from '../components/layout/SideBar.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Avatar from '../components/layout/Avatar.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

function Home() {
    const { user } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [events, setEvents] = useState([]);
    const [posts, setPosts] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsRes, postsRes, usersRes] = await Promise.all([
                    api.get('/events/'),
                    api.get('/posts/'),
                    api.get('/users/?limit=5'),
                ]);
                setEvents(eventsRes.data);
                setPosts(postsRes.data);
                setDrivers(usersRes.data);
            } catch (err) {
                console.error('Error fetching home data:', err);
            }
        };
        fetchData();
    }, []);

    const recentActivity = events.slice(0, 5).map(e => `New event: ${e.title} — ${e.location}`);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= posts.length - 2 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? posts.length - 2 : prev - 1));
    };

    return (
        <>
            <SideBar />

            <main className="main-content home-page">

                <PageHeader
                    title={`Welcome, ${user?.first_name || user?.username || 'Driver'}`}
                    description="Here's what's happening in your garage."
                />

                <section className="row mb-5">

                    <div className="col-lg-9">
                        <h2 className="mb-4 home-section-title">Upcoming Events</h2>
                        <div className="row g-4">
                            {events.slice(0, 4).map((event) => (
                                <div className="col-xl-3 col-md-6" key={event.id}>
                                    <div className="card h-100 shadow-sm">
                                        <img
                                            src={event.event_image || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600'}
                                            className="card-img-top event-card-img"
                                            alt={event.title}
                                        />
                                        <div className="card-body d-flex flex-column p-3">
                                            <h5 className="fw-bold fs-6 text-dark mb-2">{event.title}</h5>
                                            <p className="card-text text-muted small mb-3">{event.location}</p>
                                            <button
                                                className="btn btn-aqua btn-sm mt-auto rounded-3"
                                                onClick={() => navigate(`/events/${event.id}`)}
                                            >
                                                View Event
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {events.length === 0 && (
                                <p className="text-muted">No events yet. <span className="link-aqua" style={{ cursor: 'pointer' }} onClick={() => navigate('/create-event')}>Create one!</span></p>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-3 mt-4 mt-lg-0">
                        <h2 className="mb-4 home-section-title">Recent Activity</h2>
                        <ul className="list-group activity-list">
                            {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                                <li key={index} className="list-group-item fw-medium">
                                    {activity}
                                </li>
                            )) : (
                                <li className="list-group-item text-muted">No recent activity</li>
                            )}
                        </ul>
                    </div>

                </section>

                <section className="row">

                    <div className="col-lg-9">
                        <h2 className="mb-4 home-section-title">Community Highlights</h2>
                        <div className="position-relative overflow-hidden slider-container">

                            <div
                                className="d-flex slider-track"
                                style={{ transform: `translateX(-${currentIndex * 340}px)` }}
                            >
                                {posts.map((post) => (
                                    <div key={post.id} className="flex-shrink-0 p-2" style={{ width: '340px' }}>
                                        <div className="card h-100 shadow-sm">
                                            {post.media && (
                                                <img src={post.media} className="card-img-top highlight-card-img" alt="post" />
                                            )}
                                            <div className="card-body p-3">
                                                <h5 className="fw-bold text-dark fs-6 mb-1">{post.author_name}</h5>
                                                <p className="card-text text-muted small mb-0">{post.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex-shrink-0 p-2" style={{ width: '340px' }}>
                                    <div
                                        className="card h-100 community-link-card shadow-sm p-4"
                                        onClick={() => navigate('/community')}
                                    >
                                        <div className="community-link-icon">
                                            <i className="bi bi-people-fill"></i>
                                        </div>
                                        <h5 className="fw-bold mb-2">Explore Community</h5>
                                        <p className="small opacity-75">Join the conversation and see more amazing builds from our drivers.</p>
                                        <button className="btn btn-aqua btn-sm mt-3 px-4 rounded-pill" onClick={() => navigate('/community')}>
                                            Enter Feed
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="btn slider-arrow position-absolute top-50 start-0 translate-middle-y z-3 ms-2 text-white"
                                onClick={prevSlide}
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <button
                                className="btn slider-arrow position-absolute top-50 end-0 translate-middle-y z-3 me-2 text-white"
                                onClick={nextSlide}
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                    <div className="col-lg-3 mt-4 mt-lg-0">
                        <h2 className="mb-4 home-section-title">Community Drivers</h2>
                        <div className="d-flex flex-column gap-3">
                            {drivers.map((driver) => (
                                <div
                                    className="card shadow-sm border-0 p-2"
                                    key={driver.id}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/profile/${driver.id}`)}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <Avatar src={driver.profile_picture} alt={driver.username} size="md" />
                                        <div>
                                            <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.9rem' }}>
                                                {driver.first_name} {driver.last_name}
                                            </h6>
                                            <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>
                                                @{driver.username}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {drivers.length === 0 && (
                                <p className="text-muted small">No other users yet.</p>
                            )}
                        </div>
                    </div>

                </section>

            </main>
        </>
    );
}

export default Home;
