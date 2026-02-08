import React from 'react';
import { FAQBlock, STATIC_FAQS } from '../home/FAQSection';

const StaticFaqPage: React.FC = () => {
    return (
        <div className="bg-white">
            <section className="py-16 bg-stone-50 border-b border-stone-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-amber-700 text-sm font-bold uppercase tracking-widest mb-3">Static QR FAQs</p>
                    <h1 className="text-3xl md:text-4xl font-black text-stone-900 mb-3">
                        Static QR Code - Questions Answered
                    </h1>
                    <p className="text-stone-600 max-w-2xl mx-auto">
                        Fixed information, compliance rules, and reprint guidance for Static QR codes.
                    </p>
                </div>
            </section>
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FAQBlock title="Static QR Code - FAQs" items={STATIC_FAQS} />
                </div>
            </section>
        </div>
    );
};

export default StaticFaqPage;
