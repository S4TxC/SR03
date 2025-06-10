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

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans text-gray-800">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md"
            >
                <h1 className="text-3xl text-blue-600 text-center mb-8 font-semibold">Create an account</h1>

                {[
                    { id: 'firstname', label: 'Firstname', placeholder: 'Enter your firstname' },
                    { id: 'lastname', label: 'Lastname', placeholder: 'Enter your lastname' },
                    { id: 'email', label: 'Email', placeholder: 'Enter your email address' },
                    { id: 'password', label: 'Password', placeholder: 'Create a password' }
                ].map((field, i) => (
                    <div key={i} className="mb-6 flex flex-col">
                        <label htmlFor={field.id} className="mb-2 font-semibold">
                            {field.label}
                        </label>
                        <input
                            type={field.id === 'password' ? 'password' : field.id === 'email' ? 'email' : 'text'}
                            id={field.id}
                            placeholder={field.placeholder}
                            value={formData[field.id]}
                            onChange={handleChange}
                            required
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                ))}
                    <div className="mb-6 flex flex-col">
                        <label htmlFor="avatar" className="mb-2 font-semibold">
                            Avatar (optional)
                        </label>
                        <input
                            type="file"
                            id="avatar"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <input
                        type="submit"
                        value="Register"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl cursor-pointer transition-colors duration-300"
                    />

                {error && <p className="text-red-600 text-center mt-4 font-bold">{error}</p>}
                {success && <p className="text-green-600 text-center mt-4 font-bold">{success}</p>}

                <p className="text-center text-sm mt-6">
                    Already registered?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login&nbsp;!
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
