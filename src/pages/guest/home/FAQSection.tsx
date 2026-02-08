import React from 'react';

export const STATIC_FAQS = [
    {
        q: 'What is a Static QR Code?',
        a: 'A Static QR Code is a QR code where the information is fixed and permanent once created.',
    },
    {
        q: 'Can I change the data of a Static QR Code later?',
        a: 'No. Once a Static QR Code is generated, the data is locked. If you need new information, you must create a new Static QR Code.',
    },
    {
        q: 'What kind of product information can I show?',
        a: [
            'Gazette Notification No & Date',
            'Product Title',
            'Composition',
            'Crops',
            'Dosage',
            'Application method',
            'Manufacturer details',
            'Mfg Date',
            'Expire Date',
            'Batch No (optional)',
        ],
    },
    {
        q: 'If I create a new Static QR every week, what happens to old ones?',
        a: 'All Static QR Codes are saved safely with full history. Old QR codes are never overwritten or deleted.',
    },
    {
        q: 'Can I reprint an old Static QR Code?',
        a: 'Yes. Static QR Codes can be reprinted unlimited times.',
    },
    {
        q: 'Where are Static QR Codes best used?',
        a: ['Product labels (Mfg Date, Expire Date, Batch Number)'],
    },
    {
        q: 'How does the QR code work for customers?',
        a: 'Customers scan the QR code using their mobile camera. A mobile-friendly product page opens in their browser showing product details.',
    },
    {
        q: 'Does the customer need to install any app?',
        a: 'No app is required. The QR works on any smartphone browser (Android or iPhone).',
    },
    {
        q: 'Can I manage multiple products under one company account?',
        a: 'Yes. Each company gets a secure dashboard to manage multiple products under one login.',
    },
    {
        q: 'Will a new QR code be generated when I update product data?',
        a: 'Yes. For Static QR Codes, any change requires a new QR code and reprinting the label.',
    },
    {
        q: 'Can I download and share the QR code?',
        a: 'Yes. You can download the QR code in PNG or PDF format and share it via WhatsApp, email, or print it on labels.',
    },
    {
        q: 'How can I send QR codes directly for label printing?',
        a: [
            'PDF QR downloads in print-ready format',
            'Bulk QR sharing for printers',
            'Auto QR Print Link System (print-ready QR link)',
            'Example: https://apnaqr.co.in/p/e1e06a15-9bdc-429a-b059-85e4ff92cf91',
        ],
    },
];

export const DYNAMIC_FAQS = [
    {
        q: 'What is a Dynamic QR Code?',
        a: 'A Dynamic QR Code allows you to update the content anytime without changing the QR code itself.',
    },
    {
        q: 'If I update the data, will the QR Code change?',
        a: 'No. The QR Code remains the same, only the linked information is updated.',
    },
    {
        q: 'What kind of product information can I show?',
        a: [
            'Gazette Notification No & Date',
            'Product Title',
            'Composition',
            'Crops',
            'Dosage',
            'Application method',
            'Manufacturer details',
            'Product description',
        ],
    },
    {
        q: 'Do I need to reprint the QR code if product details change?',
        a: 'No. Once printed, the QR code can be used for years. You can update product data anytime, and customers will automatically see the latest information.',
    },
    {
        q: 'How many times can I update a Dynamic QR Code?',
        a: 'Unlimited times. You can update the data whenever required.',
    },
    {
        q: 'Will Dynamic QR Codes work on already printed labels?',
        a: 'Yes. Dynamic QR Codes are ideal for long-term printed labels.',
    },
    {
        q: 'Where are Dynamic QR Codes best used?',
        a: [
            'Product information updates',
            'Customer support & contact information',
            'Product labels (excluding Mfg Date, Expire Date, Batch Number)',
        ],
    },
    {
        q: 'How does the QR code work for customers?',
        a: 'Customers scan the QR code using their mobile camera. A mobile-friendly product page opens in their browser showing product details.',
    },
    {
        q: 'Does the customer need to install any app?',
        a: 'No app is required. The QR works on any smartphone browser (Android or iPhone).',
    },
    {
        q: 'Can I manage multiple products under one company account?',
        a: 'Yes. Each company gets a secure dashboard to manage multiple products under one login.',
    },
    {
        q: 'Will a new QR code be generated when I update product data?',
        a: 'No. The same QR code remains active. Only the data behind it is updated.',
    },
    {
        q: 'Can I download and share the QR code?',
        a: 'Yes. You can download the QR code in PNG or PDF format and share it via WhatsApp, email, or print it on labels.',
    },
    {
        q: 'How can I send QR codes directly for label printing?',
        a: [
            'PDF QR downloads in print-ready format',
            'Bulk QR sharing for printers',
            'Auto QR Print Link System (print-ready QR link)',
            'Example: https://apnaqr.co.in/p/e1e06a15-9bdc-429a-b059-85e4ff92cf91',
        ],
    },
];

export const QUICK_COMPARISON = [
    {
        title: 'Static QR Code',
        subtitle: 'Use Static QR for fixed information.',
        points: ['Fixed data', 'Version & history maintained'],
    },
    {
        title: 'Dynamic QR Code',
        subtitle: 'Use Dynamic QR for future updates.',
        points: ['Editable data', 'Same QR for years', 'Ideal for updates'],
    },
];

const renderAnswer = (answer: string | string[]) => {
    if (Array.isArray(answer)) {
        return (
            <ul className="list-disc pl-5 space-y-1 text-sm text-stone-600">
                {answer.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
        );
    }
    return <p className="text-sm text-stone-600">{answer}</p>;
};

export const FAQBlock: React.FC<{ title: string; items: { q: string; a: string | string[] }[] }> = ({ title, items }) => (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 md:px-8 py-5 border-b border-stone-100 bg-stone-50">
            <h3 className="text-xl font-bold text-stone-900">{title}</h3>
        </div>
        <div className="divide-y divide-stone-100">
            {items.map((item, idx) => (
                <details key={idx} className="group px-6 md:px-8 py-4">
                    <summary className="cursor-pointer list-none font-semibold text-stone-800 flex items-center justify-between gap-3">
                        <span>{item.q}</span>
                        <span className="text-emerald-600 text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <div className="mt-3">{renderAnswer(item.a)}</div>
                </details>
            ))}
        </div>
    </div>
);

const FAQSection: React.FC = () => {
    return (
        <section id="faq" className="py-20 bg-stone-50 border-t border-stone-200 scroll-mt-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-3">Frequently Asked Questions</h2>
                    <p className="text-stone-600 max-w-2xl mx-auto">
                        Quick answers to the most common questions about Static and Dynamic QR codes.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <FAQBlock title="Static QR Code - FAQs" items={STATIC_FAQS} />
                    <FAQBlock title="Dynamic QR Code - FAQs" items={DYNAMIC_FAQS} />
                </div>

                <div className="mt-12 grid md:grid-cols-2 gap-6">
                    {QUICK_COMPARISON.map((item) => (
                        <div key={item.title} className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">
                            <h3 className="text-xl font-bold text-stone-900 mb-1">{item.title}</h3>
                            <p className="text-sm text-stone-600 mb-4">{item.subtitle}</p>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-stone-700">
                                {item.points.map((point) => (
                                    <li key={point}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
