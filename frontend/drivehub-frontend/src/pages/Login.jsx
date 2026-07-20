import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from '../assets/logo.png'

function Login() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            await login(username, password);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4 text-center">
                    <img src={logo} alt={'DriveHub Logo'} className="w-75 h-75"></img>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow p-4">
                        <h2 className="mb-4 text-center">Login</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="username" className="mb-1"> <b>Username</b> </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="username"
                                    placeholder="Enter your username"
                                    name="username"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="mb-1"> <b>Password</b> </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Enter your password"
                                    name="password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-aqua text-uppercase w-100"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                    <div className="text-center mt-4">
                        <p>Don't have an account?
                            <b> <Link className="link-aqua" to="/register"> Sign Up </Link> </b>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
