import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/', { replace: true })
        setMobileMenuOpen(false)
    }

    const navLinks = [
        { label: 'About Us', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Why Choose Us', href: '#features' },
        { label: 'Contact', href: '#contact' },
    ]

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl lg:text-3xl font-bold text-slate-900">
                    Borderly
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {!user && navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    {user && (
                        <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                            My Applications
                        </Link>
                    )}
                </div>

                {/* Desktop User CTA */}
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-slate-600 font-medium flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {user.phone ? `+91 ${user.phone.slice(-4)}` : 'User'}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-slate-100 text-slate-700 font-semibold px-5 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-slate-900 text-white font-semibold px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden text-slate-900 focus:outline-none p-2"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100">
                    {!user && navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-3 px-6 text-sm text-slate-600 hover:bg-slate-50"
                        >
                            {link.label}
                        </a>
                    ))}
                    {user && (
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-3 px-6 text-sm text-slate-600 hover:bg-slate-50"
                        >
                            My Applications
                        </Link>
                    )}
                    <div className="px-6 py-4 border-t border-slate-100">
                        {user ? (
                            <div className="space-y-3">
                                <span className="block text-slate-600 font-medium">
                                    +91 {user.phone?.slice(-4) || '****'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-center bg-slate-100 text-slate-700 font-semibold px-5 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-center bg-slate-900 text-white font-semibold px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar
