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

    const isFormEmpty = email === '' || password === '';

    return (
        <div
            className="min-h-screen flex justify-center items-center"
            style={{
                backgroundImage: "url('images/BackgroundLogin.gif')",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                margin: 0,
                padding: 0
            }}
        >
            <div className="relative w-full max-w-md">
                <div
                    className={`relative px-8 pt-6 pb-8 mb-4 border-4 border-black transition-all duration-300 ${
                        isFormEmpty ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-80'
                    }`}
                    style={{
                        borderRadius: '0'
                    }}
                >
                    <img
                        src="/images/Kuriboh.png"
                        alt="YGO"
                        className="absolute -top-0 -left-0 w-60 h-60 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    <img
                        src="/images/LuffyHat.png"
                        alt="OP"
                        className="absolute -top-0 -right-0 w-32 h-32 transform translate-x-1/2 -translate-y-1/2"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    <img
                        src="/images/Gintoki.png"
                        alt="Gintama"
                        className="absolute -bottom-0 -left-0 w-40 h-40 transform -translate-x-1/2 translate-y-1/2"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    <img
                        src="/images/Goku.png"
                        alt="DBZ"
                        className="absolute -bottom-0 -right-0 w-28 h-28 transform translate-x-1/2 translate-y-1/2"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    <h1
                        className="text-center text-2xl font-bold mb-4"
                        style={{
                            fontFamily: "'Press Start 2P', cursive"
                        }}
                    >
                        Login
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="email"
                                style={{
                                    fontFamily: "'Press Start 2P', cursive"
                                }}
                            >
                                Email
                            </label>
                            <input
                                className="shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-2 border-black disabled:bg-gray-100"
                                style={{
                                    borderRadius: '0',
                                    fontFamily: "'Press Start 2P', cursive"
                                }}
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="mb-6">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="password"
                                style={{
                                    fontFamily: "'Press Start 2P', cursive"
                                }}
                            >
                                Password
                            </label>
                            <input
                                className="shadow appearance-none w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline border-2 border-black disabled:bg-gray-100"
                                style={{
                                    borderRadius: '0',
                                    fontFamily: "'Press Start 2P', cursive"
                                }}
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                className={`font-bold py-2 px-4 focus:outline-none focus:shadow-outline border-2 border-black text-white ${
                                    isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                                style={{
                                    borderRadius: '0',
                                    fontFamily: "'Press Start 2P', cursive"
                                }}
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Connection...' : 'Sign In'}
                            </button>
                        </div>

                        {error && (
                            <div className="text-red-600 text-center font-bold mt-4">
                                <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}>
                                    {error}
                                </p>
                            </div>
                        )}
                    </form>
                    <div className="text-center mt-4">
                        <p
                            className="text-sm"
                            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.7em' }}
                        >
                            Don't have an account?{' '}
                            <a
                                href="/register"
                                className="text-blue-600 hover:underline"
                            >
                                Register!
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;