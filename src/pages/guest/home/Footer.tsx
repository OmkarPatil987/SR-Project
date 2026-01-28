import React from 'react';
import { ArrowRight, QrCode } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-stone-900 text-stone-300">
            {/* Final CTA Strip */}
            <div className="bg-brand-green py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Make Your Agri Products Government-Compliant
                        </h2>
                        <p className="text-green-100">
                            Start generating Static & Dynamic QR codes today.
                        </p>
                    </div>
                    <button className="bg-white text-brand-green hover:bg-stone-100 px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-transform hover:-translate-y-1 flex items-center">
                        Get Started with apnaQR
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <QrCode className="h-8 w-8 text-brand-green" />
                            <span className="font-bold text-2xl text-white tracking-tight">apna<span className="text-brand-green">QR</span></span>
                        </div>
                        <p className="text-stone-400 mb-6 max-w-sm">
                            The trusted platform for digital compliance in Indian Agriculture. Bridging the gap between authenticity and technology.
                        </p>
                        <p className="font-semibold text-white">Visit: www.apnaQR.co.in</p>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><a href="#compliance" className="hover:text-brand-green transition-colors">Compliance</a></li>
                            <li><a href="#static-qr" className="hover:text-brand-green transition-colors">Static QR</a></li>
                            <li><a href="#dynamic-qr" className="hover:text-brand-green transition-colors">Dynamic QR</a></li>
                            <li><a href="#benefits" className="hover:text-brand-green transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Legal</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-brand-green transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-brand-green transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-brand-green transition-colors">FCO Guidelines</a></li>
                            <li><a href="#" className="hover:text-brand-green transition-colors">Contact Support</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-stone-800 mt-12 pt-8 text-center text-sm text-stone-500">
                    <p>&copy; {new Date().getFullYear()} apnaQR. All rights reserved. Made for Indian Agriculture.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;