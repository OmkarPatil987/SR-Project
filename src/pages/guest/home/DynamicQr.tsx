import React from 'react';
import { RefreshCw, Smartphone, Video, FileText, BarChart3 } from 'lucide-react';

const DynamicQr: React.FC = () => {
    return (
        <section id="dynamic-qr" className="py-20 bg-white relative overflow-hidden scroll-mt-24">
            {/* Decorative BG */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-emerald-50/50 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="lg:grid lg:grid-cols-2 gap-16 items-center">

                    <div className="order-2 lg:order-1">
                        <div className="relative">
                            {/* Mockup of dashboard or phone */}
                            <div className="bg-stone-900 rounded-[2.5rem] p-4 shadow-2xl max-w-sm mx-auto border-4 border-stone-800">
                                <div className="bg-white rounded-[2rem] overflow-hidden h-[500px] relative">
                                    {/* Phone Screen Header */}
                                    <div className="bg-brand-green h-24 p-6 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">Product Info</span>
                                    </div>
                                    {/* Phone Screen Content */}
                                    <div className="p-6 space-y-4">
                                        <div className="h-40 bg-stone-200 rounded-lg animate-pulse w-full"></div>
                                        <div className="h-4 bg-stone-200 rounded animate-pulse w-3/4"></div>
                                        <div className="h-4 bg-stone-200 rounded animate-pulse w-1/2"></div>
                                        <div className="flex gap-2 mt-4">
                                            <div className="h-10 bg-emerald-100 rounded w-1/2"></div>
                                            <div className="h-10 bg-emerald-100 rounded w-1/2"></div>
                                        </div>
                                        <div className="mt-6 p-4 bg-amber-50 rounded border border-amber-100">
                                            <p className="text-xs text-amber-800 text-center">Video Guide Available</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating feature badge */}
                            <div className="absolute top-1/2 -right-4 lg:-right-12 bg-white p-4 rounded-xl shadow-lg border border-stone-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <RefreshCw className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <p className="font-bold text-stone-800">Real-time Updates</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 mb-12 lg:mb-0">
                        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
                            <Smartphone className="h-6 w-6 text-brand-green" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
                            Dynamic QR Code <span className="text-brand-green">Smart Features</span>
                        </h2>
                        <p className="text-lg text-stone-600 mb-8">
                            Go beyond compliance. Use Dynamic QR codes to engage with farmers, build trust, and update product information instantly without reprinting labels.
                        </p>

                        <ul className="space-y-6">
                            {[
                                { icon: <RefreshCw className="text-blue-500" />, title: "Update Anytime", desc: "Change product details, safety instructions, or dosage without changing the QR label." },
                                { icon: <Video className="text-red-500" />, title: "Rich Media", desc: "Show usage videos, PDF manuals, and high-quality product images." },
                                { icon: <FileText className="text-brand-green" />, title: "Detailed Description", desc: "Crop-wise application methods and safety precautions in local languages." },
                                { icon: <BarChart3 className="text-purple-500" />, title: "Manufacturer Dashboard", desc: "Manage all your products and updates from a single, easy-to-use apnQR dashboard." },
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1 bg-white p-2 rounded-lg shadow-sm border border-stone-100">
                                        {React.cloneElement(item.icon as React.ReactElement, { className: `h-6 w-6 ${item.icon.props.className}` })}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-stone-900">{item.title}</h4>
                                        <p className="text-stone-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default DynamicQr;