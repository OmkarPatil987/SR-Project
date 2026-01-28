import React from 'react';

const AboutSection: React.FC = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-8">About apnaQR</h2>

                <div className="text-lg md:text-xl text-stone-700 leading-relaxed space-y-8">
                    <p>
                        <span className="font-bold text-brand-green">apnaQR</span> is a dedicated QR Code generation platform developed with a singular focus: to support agri-product manufacturers in meeting the strict compliance standards of the <span className="font-semibold">Fertilizer Control Order (FCO) 1985</span>.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 py-8">
                        <div className="p-4 bg-stone-50 rounded-lg">
                            <div className="text-4xl mb-2">🏭</div>
                            <h3 className="font-bold text-stone-900">Manufacturers</h3>
                            <p className="text-sm text-stone-600">Empowering brands with digital tools.</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                            <div className="text-4xl mb-2">🏛️</div>
                            <h3 className="font-bold text-stone-900">Government</h3>
                            <p className="text-sm text-stone-600">Ensuring regulatory compliance.</p>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-lg">
                            <div className="text-4xl mb-2">👨‍🌾</div>
                            <h3 className="font-bold text-stone-900">Farmers</h3>
                            <p className="text-sm text-stone-600">Providing clear usage knowledge.</p>
                        </div>
                    </div>

                    <p className="font-medium text-2xl text-stone-800">
                        "Our goal is to create a trusted digital bridge between manufacturers, Government authorities, and farmers."
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;