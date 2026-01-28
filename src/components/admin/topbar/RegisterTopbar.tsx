import React, { useState, useEffect } from 'react';
import { Menu, X, QrCode, LogIn, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Change background on scroll for better visibility over hero content
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Compliance', href: '#compliance' },
        { name: 'Static QR', href: '#static-qr' },
        { name: 'Dynamic QR', href: '#dynamic-qr' },
        { name: 'Benefits', href: '#benefits' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                        <div className="p-2 bg-brand-green/10 rounded-lg group-hover:bg-brand-green/20 transition-colors">
                            <QrCode className="h-7 w-7 text-brand-green" />
                        </div>
                        <span className="font-bold text-2xl text-stone-900 tracking-tight">
                            apna<span className="text-brand-green">QR</span>
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="px-4 py-2 text-stone-600 hover:text-brand-green font-medium rounded-full hover:bg-stone-100 transition-all duration-200"
                            >
                                {link.name}
                            </a>
                        ))}

                        <div className="h-6 w-[1px] bg-stone-200 mx-4" /> {/* Visual Separator */}

                        <button
                            onClick={() => navigate('/auth/login')}
                            className="flex items-center gap-2 px-5 py-2 text-stone-700 hover:text-brand-green font-semibold transition-colors"
                        >
                            <LogIn className="h-4 w-4" />
                            Login
                        </button>

                    
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                            aria-label="Toggle Menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu with Slide Animation */}
            <div className={`md:hidden absolute w-full bg-white border-b border-stone-100 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}>
                <div className="px-4 pt-2 pb-6 space-y-2 shadow-xl">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-xl text-base font-medium text-stone-700 hover:text-brand-green hover:bg-stone-50"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="pt-4 grid grid-cols-2 gap-3">
                        <button
                            onClick={() => navigate('/auth/login')}
                            className="py-3 rounded-xl font-semibold text-stone-700 bg-stone-100 active:bg-stone-200"
                        >
                            Login
                        </button>
                    
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;