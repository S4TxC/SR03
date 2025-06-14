import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    });
    const [avatar, setAvatar] = useState(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = e => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleImageChange = e => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const form = new FormData();
            form.append("firstname", formData.firstname);
            form.append("lastname", formData.lastname);
            form.append("email", formData.email);
            form.append("password", formData.password);
            if (avatar) {
                form.append("avatar", avatar);
            }

            await axios.post("http://localhost:8080/api/user/register", form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setSuccess('Account successfully registered!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error('Error during register', err);
            if (err.response?.status === 409) {
                setError('Email address already exists!');
            } else {
                setError("Error during register.");
            }
        }
    };

    const isFormEmpty = formData.firstname === '' || formData.lastname === '' || formData.email === '' || formData.password === '';

    return (
        <div
            className="min-h-screen flex justify-center items-center"
            style={{
                backgroundImage: "url('images/BackgroundRegister.gif')",
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                margin: 0,
                padding: 0
            }}
        >
            <div className="relative w-full max-w-lg">
                <div
                    className={`relative px-8 pt-6 pb-8 mb-4 border-4 border-black transition-all duration-300 ${
                        isFormEmpty ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-80'
                    }`}
                    style={{
                        borderRadius: '0'
                    }}
                >
                    <img
                        src="images/Link.png"
                        alt="Zelda"
                        className="absolute -top-0 -left-0 w-28 h-28 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    <img
                        src="images/BlackMage.png"
                        alt="FF"
                        className="absolute -top-0 -right-0 w-20 h-20 transform translate-x-1/2 -translate-y-1/2"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    <img
                        src="images/Zero.png"
                        alt="Megaman"
                        className="absolute -bottom-0 -left-0 w-20 h-20 transform -translate-x-1/2 translate-y-1/2"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    <img
                        src="images/Raiden.png"
                        alt="MGS"
                        className="absolute -bottom-0 -right-0 w-48 h-48 transform translate-x-1/2 translate-y-1/2"
                        style={{ imageRendering: 'pixelated' }}
                    />

                    <form onSubmit={handleSubmit}>
                        <h1
                            className="text-center text-2xl font-bold mb-6"
                            style={{
                                fontFamily: "'Press Start 2P', cursive"
                            }}
                        >
                            Create Account
                        </h1>

                        {[
                            { id: 'firstname', label: 'Firstname', placeholder: 'Enter your firstname' },
                            { id: 'lastname', label: 'Lastname', placeholder: 'Enter your lastname' },
                            { id: 'email', label: 'Email', placeholder: 'Enter your email address' },
                            { id: 'password', label: 'Password', placeholder: 'Create a password' }
                        ].map((field, i) => (
                            <div key={i} className="mb-4">
                                <label
                                    htmlFor={field.id}
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    style={{
                                        fontFamily: "'Press Start 2P', cursive"
                                    }}
                                >
                                    {field.label}
                                </label>
                                <input
                                    type={field.id === 'password' ? 'password' : field.id === 'email' ? 'email' : 'text'}
                                    id={field.id}
                                    placeholder={field.placeholder}
                                    value={formData[field.id]}
                                    onChange={handleChange}
                                    required
                                    className="shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-2 border-black"
                                    style={{
                                        borderRadius: '0',
                                        fontFamily: "'Press Start 2P', cursive"
                                    }}
                                />
                            </div>
                        ))}

                        <div className="mb-6">
                            <label
                                htmlFor="avatar"
                                className="block text-gray-700 text-sm font-bold mb-2"
                                style={{
                                    fontFamily: "'Press Start 2P', cursive"
                                }}
                            >
                                Avatar (optional)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="avatar"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="shadow appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-2 border-black bg-white hover:bg-gray-50 cursor-pointer"
                                     style={{
                                         borderRadius: '0',
                                         fontFamily: "'Press Start 2P', cursive",
                                         fontSize: '0.8em'
                                     }}>
                                    {avatar ? avatar.name : 'Choose file...'}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mb-4">
                            <input
                                type="submit"
                                value="Register"
                                className="font-bold py-2 px-4 focus:outline-none focus:shadow-outline border-2 border-black text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                                style={{
                                    borderRadius: '0',
                                    fontFamily: "'Press Start 2P', cursive"
                                }}
                            />
                        </div>

                        {error && (
                            <div className="text-red-600 text-center font-bold mt-4">
                                <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}>
                                    {error}
                                </p>
                            </div>
                        )}

                        {success && (
                            <div className="text-green-600 text-center font-bold mt-4">
                                <p style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '0.8em' }}>
                                    {success}
                                </p>
                            </div>
                        )}

                        <p
                            className="text-center mt-6"
                            style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '0.8em'
                            }}
                        >
                            Already registered?{' '}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:underline"
                                style={{
                                    fontFamily: "'Press Start 2P', cursive"
                                }}
                            >
                                Login !
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;