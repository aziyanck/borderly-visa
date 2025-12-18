import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

function Footer() {
    const links = [
        { label: 'About', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Features', href: '#features' },
        { label: 'Contact', href: '#contact' },
    ]

    return (
        <>
            <footer className="bg-slate-900 text-slate-300">
                <div className="max-w-7xl mx-auto py-12 px-6 text-center">
                    <h2 className="text-2xl font-bold text-white">Borderly</h2>
                    <div className="mt-6 flex justify-center flex-wrap gap-6">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="hover:text-white transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                    <p className="mt-8 text-sm text-slate-400">
                        © 2025 Borderly Visa. All rights reserved.
                    </p>
                </div>
            </footer>

            {/* WhatsApp Floating Button */}
            <a
                href="https://wa.me/9048955437"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
            >
                <MessageCircle className="h-7 w-7" />
            </a>
        </>
    )
}

export default Footer
