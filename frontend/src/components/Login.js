import { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:8080/api/login',
                { email, password },
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log('Login success', response.data);
            if (response.data.isAdmin) {
                window.location.href = '/admin';
            } else {
                window.location.href = '/home';
            }
        } catch (err) {
            console.error('Login error', err);
            setError('Invalid credentials. Please try again later');
        }
    };

    return (
        <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h1>Login</h1>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <input type="submit" value="Login" />
                </div>

                {error && (
                    <div className="error-message" style={{ color: 'red' }}>
                        <p>{error}</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Login;
