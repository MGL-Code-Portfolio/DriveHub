import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Avatar from "./Avatar.jsx";
import logo from '../../assets/logo-simples.png';

export default function SideBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Home', icon: 'bi-house-fill', path: '/home' },
        { name: 'Events', icon: 'bi-geo-alt-fill', path: '/events' },
        { name: 'Garage', icon: 'bi-car-front-fill', path: '/garage' },
        { name: 'Community', icon: 'bi-people-fill', path: '/community' },
        { name: 'Messages', icon: 'bi-chat-dots-fill', path: '/messages' },
    ];

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            if (logout) await logout();
        } catch (error) {
            console.error("Erro ao efetuar logout:", error);
        } finally {
            navigate('/');
        }
    };

    return (
        <aside className="sidebar">
            <div>
                <div className="pt-4 pb-5 px-3">
                    <Link to="/home" className="logo-link">
                        <img src={logo} alt="DriveHub Logo" width={50}/>
                    </Link>
                </div>

                <nav className="d-flex flex-column gap-2 px-2 sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="sidebar-link d-flex align-items-center text-decoration-none"
                        >
                            <div className="sidebar-icon">
                                <i className={`bi ${item.icon}`}></i>
                            </div>
                            <span className="sidebar-text ms-3 fw-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="px-2 pb-4 d-flex flex-column gap-2">
                <Link to="/profile" className="sidebar-link d-flex align-items-center text-decoration-none">
                    <div className="sidebar-icon">
                        <Avatar src={user?.profile_picture} alt={user?.username} size="xs" />
                    </div>
                    <span className="sidebar-text ms-3 fw-medium"> My Profile </span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="sidebar-link d-flex align-items-center text-decoration-none border-0 bg-transparent w-100 text-start"
                    style={{ cursor: 'pointer', padding: 'inherit' }}
                >
                    <div className="sidebar-icon">
                        <i className="bi bi-box-arrow-right"></i>
                    </div>
                    <span className="sidebar-text ms-3 fw-medium"> Logout </span>
                </button>
            </div>
        </aside>
    );
}
