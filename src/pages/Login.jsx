import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt:', formData);
        // Hardcoded mock authentication
        if (formData.username === 'azi' && formData.password === '123') {
            navigate('/home');
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-black font-sans">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Borderly</h1>
                </div>

                <div className="space-y-6 pt-8">
                    <h2 className="text-3xl font-bold text-center">Wecome back!</h2>

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                    >
                        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with google
                    </button>

                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    placeholder="Username"
                                    className="block w-full pl-10 pr-3 py-3 bg-gray-100 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    placeholder="Password"
                                    className="block w-full pl-10 pr-10 py-3 bg-gray-100 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="button" className="text-xs text-gray-500 hover:text-gray-700">
                                forget password ?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#0015ff] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </form>

                    <div className="text-center text-xs text-gray-500 mt-4">
                        Don't have an account <Link to="/signup" className="text-black font-bold underline cursor-pointer">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

