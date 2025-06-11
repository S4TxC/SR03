import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Authentication';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                if (result.data.isAdmin) {
                    navigate('/admin');
                } else {
                    navigate('/userMenu');
                }
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Error while logging in. Please try again');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-800 font-sans">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md"
            >
                <h1 className="text-3xl text-blue-600 text-center mb-8 font-semibold">
                    Login
                </h1>

                <div className="mb-6 flex flex-col">
                    <label htmlFor="email" className="mb-2 font-semibold">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                </div>

                <div className="mb-6 flex flex-col">
                    <label htmlFor="password" className="mb-2 font-semibold">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                </div>

                <input
                    type="submit"
                    value={isLoading ? "Connection..." : "Login"}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl cursor-pointer transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                />

                {error && (
                    <div className="text-red-600 text-center font-bold mt-4">
                        <p>{error}</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Login;