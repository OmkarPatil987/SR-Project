import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Cloud, Server, Sparkles } from 'lucide-react';

const PricingSection: React.FC = () => {
    const navigate = useNavigate();
    const cloudFeatures = [
        'Hosted on apnaQR Cloud Servers',
        'No Server or IT Team Required',
        'Ready to Use in Minutes',
        'Automatic Updates & Backups',
        '99.9% Uptime Guarantee',
        'Unlimited QR Code Generation',
        'Static & Dynamic QR Options',
        'Email & Chat Support',
    ];

    const onPremFeatures = [
        'Installed on Your Own Server',
        'Complete Data Control & Privacy',
        'Custom Security Configuration',
        'Dedicated Technical Support',
        'One-Time License Fee Option',
        'Annual Maintenance Contract (AMC)',
        'Custom Integrations Available',
        'White-Label Option',
    ];

    return (
        <section id="pricing" className="py-14 md:py-20 bg-[#f8fbf9]">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <p className="text-emerald-700 text-xs md:text-sm font-bold tracking-[0.3em] uppercase">
                        Flexible Deployment
                    </p>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-stone-900 mt-3">
                        Choose Your Deployment Model
                    </h2>
                    <p className="text-stone-600 text-base md:text-lg mt-4 max-w-3xl mx-auto">
                        Whether you prefer cloud convenience or full infrastructure control, apnaQR supports both deployment
                        models tailored to your business needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                    <div className="relative bg-white rounded-3xl p-6 md:p-10 shadow-lg border-2 border-emerald-200 hover:shadow-2xl transition">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-700 text-white text-[11px] md:text-xs font-bold px-4 py-1 rounded-full tracking-widest">
                            MOST POPULAR
                        </div>
                        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-semibold text-sm px-4 py-2 rounded-full">
                            <Cloud className="h-4 w-4" />
                            Cloud SaaS
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                            <Sparkles className="h-10 w-10 text-emerald-600" />
                            <div>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-stone-900">Cloud Hosted Plan</h3>
                                <p className="text-stone-600 text-sm md:text-base mt-1">
                                    Perfect for manufacturers who want to get started quickly without any infrastructure setup.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="text-4xl md:text-5xl font-black text-emerald-800">
                                ₹499 <span className="text-base md:text-lg text-stone-500 font-semibold">/month</span>
                            </div>
                            <p className="text-xs md:text-sm text-stone-500 mt-2">Billed annually (₹5,988/year)</p>
                            <p className="text-xs text-stone-400 mt-1">*Terms & Conditions apply</p>
                        </div>

                        <ul className="mt-6 space-y-3">
                            {cloudFeatures.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-sm md:text-base text-stone-700">
                                    <span className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mt-0.5">
                                        <Check className="h-4 w-4" />
                                    </span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={() => navigate('/company/register')}
                            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-emerald-700 text-white font-bold py-3.5 hover:bg-emerald-800 transition"
                        >
                            Get Started Now
                        </button>
                    </div>

                    <div className="relative bg-gradient-to-br from-white to-amber-50 rounded-3xl p-6 md:p-10 shadow-lg border-2 border-amber-200 hover:shadow-2xl transition">
                        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 font-semibold text-sm px-4 py-2 rounded-full">
                            <Server className="h-4 w-4" />
                            On-Premise
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                            <Server className="h-10 w-10 text-amber-700" />
                            <div>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-stone-900">Enterprise Deployment</h3>
                                <p className="text-stone-600 text-sm md:text-base mt-1">
                                    For large manufacturers who need complete control over their data and infrastructure.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="text-3xl md:text-4xl font-black text-amber-800">Custom Pricing</div>
                            <p className="text-sm text-stone-600 mt-2 italic">Based on infrastructure & requirements</p>
                        </div>

                        <ul className="mt-6 space-y-3">
                            {onPremFeatures.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-sm md:text-base text-stone-700">
                                    <span className="h-6 w-6 rounded-full bg-amber-600 text-white flex items-center justify-center mt-0.5">
                                        <Check className="h-4 w-4" />
                                    </span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <a
                            href="mailto:contact@apnaqr.co.in"
                            className="mt-8 inline-flex w-full items-center justify-center rounded-xl border-2 border-amber-800 text-amber-900 font-bold py-3.5 hover:bg-amber-800 hover:text-white transition"
                        >
                            Contact Sales Team
                        </a>
                    </div>
                </div>

                <div className="mt-12 md:mt-16 bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-stone-100">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-stone-900 text-center">
                        Feature Comparison
                    </h3>
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left">
                            <thead>
                                <tr className="bg-stone-50 text-stone-700 text-sm">
                                    <th className="py-4 px-4 font-bold">Feature</th>
                                    <th className="py-4 px-4 font-bold">Cloud SaaS</th>
                                    <th className="py-4 px-4 font-bold">On-Premise</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm md:text-base text-stone-700">
                                <tr className="border-t">
                                    <td className="py-4 px-4 font-semibold">Setup Time</td>
                                    <td className="py-4 px-4">5 Minutes</td>
                                    <td className="py-4 px-4">1-2 Weeks</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-4 px-4 font-semibold">Infrastructure Required</td>
                                    <td className="py-4 px-4">None</td>
                                    <td className="py-4 px-4">Your Own Server</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-4 px-4 font-semibold">Data Hosting</td>
                                    <td className="py-4 px-4">apnaQR Cloud</td>
                                    <td className="py-4 px-4">Your Server</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-4 px-4 font-semibold">Updates</td>
                                    <td className="py-4 px-4">Automatic</td>
                                    <td className="py-4 px-4">Scheduled with AMC</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-4 px-4 font-semibold">Customization</td>
                                    <td className="py-4 px-4">Standard Features</td>
                                    <td className="py-4 px-4">Fully Customizable</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-4 px-4 font-semibold">Support</td>
                                    <td className="py-4 px-4">Email & Chat</td>
                                    <td className="py-4 px-4">Dedicated Support Team</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="py-4 px-4 font-semibold">Best For</td>
                                    <td className="py-4 px-4">MSMEs & Mid-size Manufacturers</td>
                                    <td className="py-4 px-4">Large Enterprises</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-10 md:mt-12 bg-emerald-50 border-l-4 border-emerald-600 rounded-2xl p-5 md:p-6">
                    <p className="font-bold text-stone-900">Not sure which option is right for you?</p>
                    <p className="text-stone-700 mt-1">
                        Contact us at <span className="font-semibold">+91 9834521541</span> or{' '}
                        <span className="font-semibold">contact@apnaqr.co.in</span> for a free consultation.
                    </p>
                </div>

                <div className="mt-8 md:mt-10 bg-white border border-stone-200 rounded-2xl p-6 md:p-8">
                    <h4 className="text-lg md:text-xl font-bold text-stone-900">Terms & Conditions</h4>
                    <ul className="mt-4 space-y-2 text-sm md:text-base text-stone-600 list-disc list-inside">
                        <li>Cloud SaaS plan requires 12 months advance payment (₹5,988).</li>
                        <li>No refunds available once the subscription is activated.</li>
                        <li>Subscription auto-renews annually unless cancelled 30 days before renewal date.</li>
                        <li>Service availability is subject to 99.9% uptime SLA.</li>
                        <li>Fair usage policy applies - unlimited QR generation for legitimate business use.</li>
                        <li>On-Premise pricing is customized based on infrastructure requirements and includes one-time setup fee.</li>
                        <li>AMC (Annual Maintenance Contract) for On-Premise is billed separately and includes updates & support.</li>
                        <li>Prices are subject to change with 30 days notice to existing customers.</li>
                        <li>All prices are exclusive of applicable GST.</li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
