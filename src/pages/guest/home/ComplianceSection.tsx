import React from 'react';
import { FileText, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

const ComplianceSection: React.FC = () => {
    const purposes = [
        { icon: <CheckCircle2 className="h-6 w-6 text-brand-green" />, text: "Verify authenticity of agri products" },
        { icon: <AlertTriangle className="h-6 w-6 text-brand-gold" />, text: "Prevent fake and duplicate products" },
        { icon: <Search className="h-6 w-6 text-blue-600" />, text: "Provide transparent product information" },
        { icon: <FileText className="h-6 w-6 text-stone-600" />, text: "Enable farmers to access correct usage details" },
    ];

    return (
        <section id="compliance" className="py-20 bg-white scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                    <div>
                        <h2 className="text-brand-green font-bold text-lg mb-2 uppercase tracking-wide">Government Mandate</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
                            Why QR Code on Agri Product Labels?
                        </h3>

                        <div className="bg-stone-50 border-l-4 border-brand-gold p-6 rounded-r-lg mb-8">
                            <p className="text-stone-700 italic text-lg leading-relaxed">
                                "As per the Fertilizer Control Order (FCO), 1985 and the Ministry of Agriculture & Farmers Welfare, Government of India, it is mandatory to print a QR Code on biostimulant product labels."
                            </p>
                        </div>

                        <p className="text-stone-600 mb-6">
                            apnaQR is developed specifically to support these Government requirements in a simple, reliable, and cost-effective way for manufacturers across India.
                        </p>
                    </div>

                    <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 shadow-sm">
                        <h4 className="text-xl font-bold text-stone-900 mb-6 border-b border-emerald-200 pb-4">
                            Key Objectives of the Mandate
                        </h4>
                        <div className="space-y-6">
                            {purposes.map((item, index) => (
                                <div key={index} className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        {item.icon}
                                    </div>
                                    <p className="ml-4 text-lg text-stone-700 font-medium">
                                        {item.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ComplianceSection;