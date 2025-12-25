import { Link } from 'react-router-dom';

const Signup = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-black font-sans">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Borderly</h1>
                </div>

                <div className="space-y-6 pt-8">
                    <h2 className="text-3xl font-bold text-center">welcome to borderly!</h2>

                    <div className="text-center py-10 text-gray-500">
                        <p>Signup functionality coming soon.</p>
                    </div>

                    <div className="text-center text-xs text-gray-500 mt-4">
                        Already have an account <Link to="/login" className="text-black font-bold underline cursor-pointer">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
