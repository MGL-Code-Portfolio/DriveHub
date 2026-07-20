import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from '../assets/logo.png'

function Register() {
    const { register, login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const formFields = [
        { label: 'Full Name', type: 'text', id: 'full_name', placeholder: 'E.g.: John Silva' },
        { label: 'Username', type: 'text', id: 'username', placeholder: '@joaosilva' },
        { label: 'Email', type: 'email', id: 'email', placeholder: 'john@example.com' },
        { label: 'Phone (Optional)', type: 'tel', id: 'phone', placeholder: '+351 123 456 789' },
        { label: 'Location', type: 'text', id: 'location', placeholder: 'E.g.: Lisbon, Portugal' },
        { label: 'Password', type: 'password', id: 'password', placeholder: 'Enter your password' },
        { label: 'Confirm Password', type: 'password', id: 'confirm_password', placeholder: 'Confirm your password' },
    ]

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.target);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        const fullName = formData.get('full_name');
        const nameParts = fullName.split(' ');

        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            password: password,
            phone: formData.get('phone') || '',
            location: formData.get('location') || '',
        };

        try {
            await register(data);
            await login(data.username, password);
        } catch (err) {
            const errors = err.response?.data;
            if (errors) {
                const messages = Object.entries(errors).map(([key, val]) =>
                    `${key}: ${Array.isArray(val) ? val.join(', ') : val}`
                );
                setError(messages.join(' | '));
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4 text-center">
                    <img src={logo} alt="DriveHub Logo" className="w-75 h-75"/>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card shadow p-4">
                        <h2 className="mb-4 text-center"> Create your account </h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            {formFields.map((field) => (
                                <div className="mb-3" key={field.id}>
                                    <label htmlFor={field.id} className="mb-1">
                                        <b>{field.label}</b>
                                    </label>
                                    <input
                                        type={field.type}
                                        className="form-control"
                                        id={field.id}
                                        placeholder={field.placeholder}
                                        name={field.id}
                                        required={field.id !== 'phone'}
                                    />
                                </div>
                            ))}
                            <div className="form-check mb-3">
                                <label className="form-check-label">
                                    <input className="form-check-input" type="checkbox" name="acceptance" required/>
                                    {' '}I accept the{' '} <b>Terms and Conditions</b>
                                    {' '}and the{' '} <b>Privacy Policy</b>
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-aqua text-uppercase w-100"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                    <div className="text-center mt-4 mb-4">
                        <p> Already have an account?
                            <b> {' '} <Link to="/" className="link-aqua"> Login </Link> </b>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
