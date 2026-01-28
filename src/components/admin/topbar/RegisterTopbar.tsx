import React, { useState } from 'react';
import { Menu, X, QrCode } from 'lucide-react';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Compliance', href: '#compliance' },
        { name: 'Static QR', href: '#static-qr' },
        { name: 'Dynamic QR', href: '#dynamic-qr' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Benefits', href: '#benefits' },
    ];

    return (
        <nav className="fixed w-full z-50 bg-white shadow-md border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                            <QrCode className="h-8 w-8 text-brand-green" />
                            <span className="font-bold text-2xl text-stone-900 tracking-tight">apna<span className="text-brand-green">QR</span></span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-stone-600 hover:text-brand-green font-medium transition-colors duration-200"
                            >
                                {link.name}
                            </a>
                        ))}
                        <button className="bg-brand-green hover:bg-emerald-900 text-white px-5 py-2.5 rounded-md font-semibold transition-colors shadow-sm">
                            Get Started
                        </button>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-stone-600 hover:text-stone-900 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-stone-100">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-brand-green hover:bg-stone-50"
                            >
                                {link.name}
                            </a>
                        ))}
                        <button className="w-full mt-4 bg-brand-green text-white px-5 py-3 rounded-md font-semibold">
                            Get Started
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;