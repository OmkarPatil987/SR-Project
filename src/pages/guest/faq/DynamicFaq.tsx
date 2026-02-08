import React from 'react';
import { FAQBlock, DYNAMIC_FAQS } from '../home/FAQSection';

const DynamicFaqPage: React.FC = () => {
    return (
        <div className="bg-white">
            <section className="py-16 bg-emerald-50 border-b border-emerald-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-emerald-700 text-sm font-bold uppercase tracking-widest mb-3">Dynamic QR FAQs</p>
                    <h1 className="text-3xl md:text-4xl font-black text-stone-900 mb-3">
                        Dynamic QR Code - Questions Answered
                    </h1>
                    <p className="text-stone-600 max-w-2xl mx-auto">
                        Editable data, update rules, and long-term label use for Dynamic QR codes.
                    </p>
                </div>
            </section>
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FAQBlock title="Dynamic QR Code - FAQs" items={DYNAMIC_FAQS} />
                </div>
            </section>
        </div>
    );
};

export default DynamicFaqPage;
