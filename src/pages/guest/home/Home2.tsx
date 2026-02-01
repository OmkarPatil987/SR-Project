// "use client";
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     Search, Menu, Facebook, Twitter, Instagram,
//     Linkedin, Youtube, MessageCircle, ChevronRight,
//     Users, BarChart2, FileText, PlayCircle,
//     CheckSquare, QrCode, ShieldCheck, RefreshCw,
//     Globe, Smartphone, Printer, Info,
//     PanelsTopLeft, Plus, Minus, AlertCircle
// } from 'lucide-react';

// // --- Data Constants ---

// const FAQ_DATA = {
//     static: [
//         {
//             q: "What is a Static QR Code?",
//             a: "A Static QR Code is a QR code where the information is fixed and permanent once created. It is ideal for data that never changes, ensuring a reliable permanent record."
//         },
//         {
//             q: "Can I change the data later?",
//             a: "No. Once a Static QR Code is generated, the data is locked. If you need new information (e.g., for a new batch), you must create a new Static QR Code. Old codes are never overwritten or deleted."
//         },
//         {
//             q: "What product information can I show?",
//             a: "You can display detailed info including: Gazette Notification No & Date, Product Title, Composition, Crops, Dosage, Application methods, Manufacturer details, Mfg/Expiry Dates, and Batch Numbers."
//         },
//         {
//             q: "How does it work for customers?",
//             a: "Farmers scan the QR with any smartphone camera. A mobile-friendly page opens in their browser showing verified product details. No special app installation is required."
//         },
//         {
//             q: "Can I manage multiple products?",
//             a: "Yes. Every company gets a secure dashboard to manage multiple products, each with its own history and QR codes, under a single secure login."
//         },
//         {
//             q: "How can I send QR codes for label printing?",
//             a: "apnaQR generates print-ready PDF formats and bulk sharing links. You can shared a direct 'Auto QR Print Link' with your vendor so they can download the high-res files directly."
//         }
//     ],
//     dynamic: [
//         {
//             q: "What is a Dynamic QR Code?",
//             a: "A Dynamic QR Code allows you to update the content anytime without changing the QR code itself. It is the gold standard for long-term marketing and product portals."
//         },
//         {
//             q: "If I update data, will the QR Code change?",
//             a: "No. The QR Code remains identical on your labels for years. Only the information shown to the farmer is updated via your dashboard. No re-printing is needed!"
//         },
//         {
//             q: "How many times can I update it?",
//             a: "You can update the data unlimited times. This makes Dynamic QR ideal for products where dosage recommendations or marketing content might evolve."
//         },
//         {
//             q: "Where are Dynamic QR Codes best used?",
//             a: "They are perfect for general product information, customer support portals, and any label where the core product details stay the same but marketing or contact info changes."
//         },
//         {
//             q: "Will they work on already printed labels?",
//             a: "Yes! Since the QR pattern stays the same, your existing labels will automatically point to the new information as soon as you save changes in the dashboard."
//         },
//         {
//             q: "Can I download and share the codes?",
//             a: "Yes. You can download in PNG/PDF format, share via WhatsApp/Email, or use the 'Print Link System' to send high-res files to your printing vendor instantly."
//         }
//     ]
// };

// const NAV_LINKS = [
//     "Home", "Compliance", "Static QR", "Dynamic QR", "How it Works", "About Us"
// ];

// const HERO_SLIDES = [
//     "/images/home/b4.png",
//     "/images/home/b5.png",
// ];

// const STATS_DATA = [
//     { label: "Registered Mfgs", count: "12,450+", icon: <Users size={32} />, color: "bg-green-700" },
//     { label: "QR Codes Generated", count: "8.5 + Lakh", icon: <QrCode size={28} />, color: "bg-green-600" },
//     { label: "Farmer Scans", count: "45.11 + Lakh", icon: <Globe size={28} />, color: "bg-emerald-600" },
//     { label: "Verified Products", count: "1.02 + Lakh", icon: <ShieldCheck size={28} />, color: "bg-lime-600" },
// ];

// // --- Components ---

// const TopBar = () => (
//     <div className="bg-green-900 text-white text-xs py-2 px-4 hidden md:flex justify-between items-center">
//         <div className="flex gap-4 font-semibold">
//             <span>GOVERNMENT COMPLIANT QR PLATFORM (FCO 1985)</span>
//         </div>
//         <div className="flex gap-4 items-center">
//             <div className="flex items-center gap-1 border-l border-r px-2 border-green-700">
//                 <span>English</span>
//                 <ChevronRight size={12} className="rotate-90" />
//             </div>
//             <div className="flex gap-2">
//                 <Facebook size={14} className="cursor-pointer hover:text-green-400" />
//                 <Twitter size={14} className="cursor-pointer hover:text-green-400" />
//                 <Instagram size={14} className="cursor-pointer hover:text-green-400" />
//                 <Youtube size={14} className="cursor-pointer hover:text-green-400" />
//             </div>
//         </div>
//     </div>
// );

// const Navbar = () => {
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//         <nav className="bg-white shadow-md sticky top-0 z-50">
//             <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//                 <a href="/" className="flex items-center gap-2">
//                     <div className="bg-green-600 p-1.5 rounded-lg text-white">
//                         <QrCode size={28} />
//                     </div>
//                     <span className="text-2xl font-black text-green-800 tracking-tighter">apna<span className="text-orange-500">QR</span></span>
//                 </a>

//                 <div className="hidden lg:flex items-center gap-6 text-gray-700 font-medium text-sm">
//                     {NAV_LINKS.map((link) => (
//                         <a key={link} href="#" className="hover:text-green-600 transition-colors">{link}</a>
//                     ))}
//                     <div className="flex gap-2 text-xs ml-4">
//                         <button className="px-4 py-2 border border-green-600 text-green-600 rounded-md font-bold hover:bg-green-50 transition">Login</button>
//                         <button className="px-4 py-2 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 shadow-md transition">Generate QR</button>
//                     </div>
//                 </div>

//                 <button className="lg:hidden text-green-800" onClick={() => setIsOpen(!isOpen)}>
//                     <Menu size={28} />
//                 </button>
//             </div>
//         </nav>
//     );
// };

// const HeroSlider = () => {
//     const [current, setCurrent] = useState(0);

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setCurrent((prev) =>
//                 prev === HERO_SLIDES.length - 1 ? 0 : prev + 1
//             );
//         }, 5000);

//         return () => clearInterval(timer);
//     }, []);

//     return (
//         <div className="relative w-full h-[60vh] md:h-[80vh] max-h-[700px] overflow-hidden">
//             {HERO_SLIDES.map((slide, index) => (
//                 <div
//                     key={index}
//                     className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
//                         }`}
//                 >
//                     <img
//                         src={slide}
//                         alt="Agri Banner"
//                         className="w-full h-full object-cover"
//                     />
//                 </div>
//             ))}
//         </div>
//     );
// };


// const ProductDifference = () => {
//     const [activeTab, setActiveTab] = useState('qr_types');

//     const qrComparison = [
//         { feature: "Data Type", static: "Fixed product information", dynamic: "Changeable / updatable information" },
//         { feature: "Editable After Generation", static: "❌ No", dynamic: "✅ Yes" },
//         { feature: "QR Code Change on Update", static: "Required", dynamic: "Not required" },
//         { feature: "Label Reprinting", static: "Required", dynamic: "Not required" },
//         { feature: "Content Control", static: "Fixed at creation", dynamic: "Managed via dashboard" },
//         { feature: "Cost Impact", static: "Reprinting increases cost", dynamic: "Cost-effective long term" },
//     ];

//     const serviceComparison = [
//         { feature: "Compliance Support", apnaqr: "Full FCO 1985 Support", traditional: "Manual tracking only" },
//         { feature: "Vendor Sharing", apnaqr: "One-click print links", traditional: "Large file attachments" },
//         { feature: "Farmer Verification", apnaqr: "Instant Mobile Page", traditional: "No digital verification" },
//         { feature: "Dashboard", apnaqr: "Centralized Management", traditional: "Scattered data/Excel" },
//         { feature: "Authenticity", apnaqr: "Tamper-proof history", traditional: "Easy to counterfeit" },
//     ];

//     return (
//         <section className="flex w-full flex-col items-center pb-14 bg-white py-16 px-4">
//             <div className="flex flex-col gap-8 w-full max-w-6xl">
//                 <div className="flex flex-col items-center gap-6 xl:flex-row xl:items-end xl:justify-between">
//                     <header className="flex flex-col gap-1 text-center xl:text-left">
//                         <span className="inline font-bold text-[#FF6D33] text-sm xl:text-lg">What makes us different?</span>
//                         <h4 className="inline font-black text-2xl xl:text-[2.5rem] leading-tight text-green-800">
//                             The smartest way to manage <br className="hidden xl:inline" /> Agri-Compliance and Marketing.
//                         </h4>
//                     </header>
//                     <div className="flex w-full flex-col items-center gap-2 xl:w-fit">
//                         <span className="inline font-medium text-gray-400 text-sm xl:text-base">Compare our solutions</span>
//                         <div className="bg-gray-100 inline-flex items-center justify-center gap-2 rounded-xl px-2 py-2 w-full xl:w-fit border border-gray-200">
//                             <button
//                                 onClick={() => setActiveTab('qr_types')}
//                                 className={`rounded-lg px-6 py-3 font-bold text-sm whitespace-nowrap transition-all flex w-full flex-col items-center xl:w-auto ${activeTab === 'qr_types' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
//                                     }`}
//                             >
//                                 QR Types
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('service')}
//                                 className={`rounded-lg px-6 py-3 font-bold text-sm whitespace-nowrap transition-all flex w-full flex-col items-center xl:w-auto ${activeTab === 'service' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
//                                     }`}
//                             >
//                                 Why apnaQR?
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="pt-8 w-full overflow-hidden">
//                     <div className="relative w-full overflow-x-auto rounded-2xl border-2 border-green-800/20 shadow-xl overflow-hidden">
//                         <table className="w-full text-sm border-collapse">
//                             <thead>
//                                 <tr className="bg-green-50">
//                                     <th className="text-left font-bold p-6 border-b-2 border-r-2 border-green-800/10 min-w-[200px]">
//                                         <span className="text-lg text-gray-800">Key Feature</span>
//                                     </th>
//                                     <th className="text-left font-bold p-6 border-b-2 border-r-2 border-green-800/10 bg-green-800 text-white min-w-[250px]">
//                                         <div className="flex items-center gap-2">
//                                             <QrCode size={24} />
//                                             <span className="text-lg font-black uppercase tracking-tight">
//                                                 {activeTab === 'qr_types' ? 'Dynamic QR' : 'apnaQR Platform'}
//                                             </span>
//                                         </div>
//                                     </th>
//                                     <th className="text-left font-bold p-6 border-b-2 border-green-800/10 bg-gray-50 min-w-[250px]">
//                                         <span className="text-lg text-gray-600">
//                                             {activeTab === 'qr_types' ? 'Static QR Code' : 'Manual / Traditional'}
//                                         </span>
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {(activeTab === 'qr_types' ? qrComparison : serviceComparison).map((row, idx) => (
//                                     <motion.tr
//                                         key={idx}
//                                         initial={{ opacity: 0, x: -10 }}
//                                         animate={{ opacity: 1, x: 0 }}
//                                         transition={{ delay: idx * 0.05 }}
//                                         className="hover:bg-gray-50 transition-colors"
//                                     >
//                                         <td className="p-5 border-b border-r border-green-800/10 font-bold text-gray-800">{row.feature}</td>
//                                         <td className="p-5 border-b border-r border-green-800/10 bg-green-50/50 font-medium text-green-800">
//                                             {activeTab === 'qr_types' ? row.dynamic : row.apnaqr}
//                                         </td>
//                                         <td className="p-5 border-b border-green-800/10 text-gray-500 italic">
//                                             {activeTab === 'qr_types' ? row.static : row.traditional}
//                                         </td>
//                                     </motion.tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// const StepGrid = () => {
//     const steps = [
//         {
//             title: "Register & Verify Identity",
//             icon: <ShieldCheck size={24} />,
//             img: "/images/home/p1.webp",
//             desc: "Create your government-verified profile on apnaQR platform."
//         },
//         {
//             title: "Upload Product Details",
//             icon: <FileText size={24} />,
//             img: "/images/home/p2.webp",
//             desc: "Add batch info, chemical composition and FCO compliance data."
//         },
//         {
//             title: "Generate Compliant QR",
//             icon: <QrCode size={24} />,
//             img: "/images/home/p3.webp",
//             desc: "Instantly create high-resolution printable codes for your labels."
//         },
//         {
//             title: "Share Print-Ready Links",
//             icon: <Printer size={24} />,
//             img: "/images/home/p4.webp",
//             desc: "Send direct links to your printing vendor for bulk production."
//         },
//         {
//             title: "Product Verification Portal",
//             icon: <Smartphone size={24} />,
//             img: "/images/home/p5.webp",
//             desc: "Empower farmers with transparency through instant mobile pages."
//         }
//     ];

//     return (
//         <section className="py-24 bg-white overflow-hidden">
//             <div className="container mx-auto px-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {/* Header Card */}
//                     <div className="flex flex-col justify-center p-10 bg-green-50 rounded-3xl border border-green-100 lg:h-[400px]">
//                         <span className="text-orange-500 font-bold text-xs uppercase tracking-[0.2em] mb-4">
//                             Platform for Manufacturers
//                         </span>
//                         <h2 className="text-3xl xl:text-4xl font-black text-green-900 leading-tight mb-6 uppercase tracking-tighter">
//                             Built for Compliance. <br /> Designed for Growth.
//                         </h2>
//                         <div className="flex flex-wrap gap-4">
//                             <button className="bg-green-700 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-800 transition-all shadow-lg shadow-green-200 w-fit uppercase text-sm tracking-wide">
//                                 Get Started with apnaQR
//                             </button>
//                             <button className="bg-white text-green-700 border border-green-200 px-8 py-3.5 rounded-xl font-bold hover:bg-green-50 transition-all w-fit uppercase text-sm tracking-wide">
//                                 View Compliance Guide
//                             </button>
//                         </div>
//                     </div>

//                     {/* Step Cards */}
//                     {steps.map((step, idx) => (
//                         <motion.div
//                             key={idx}
//                             initial={{ opacity: 0, y: 20 }}
//                             whileInView={{ opacity: 1, y: 0 }}
//                             viewport={{ once: true }}
//                             transition={{ delay: idx * 0.1 }}
//                             className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 bg-gray-100"
//                         >
//                             <img
//                                 src={step.img}
//                                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
//                                 alt={step.title}
//                             />

//                             {/* Gradient Blur Effect Simulator */}
//                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>

//                             {/* Layered Gradient/Blur Overlay */}
//                             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:via-black/50 transition-all duration-500 z-10"></div>

//                             <div className="absolute inset-0 p-8 flex flex-col justify-end text-white z-30">
//                                 <div className="flex items-center gap-3 mb-2 group-hover:mb-4 transition-all duration-300">
//                                     <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20 shadow-lg">
//                                         {step.icon}
//                                     </div>
//                                     <h3 className="text-xl font-bold leading-tight drop-shadow-lg">
//                                         {step.title}
//                                     </h3>
//                                 </div>
//                                 <p className="text-white/70 text-sm font-medium h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden leading-relaxed">
//                                     {step.desc}
//                                 </p>
//                                 <div className="absolute top-8 right-8 opacity-40 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
//                                     <ChevronRight size={24} />
//                                 </div>
//                             </div>
//                         </motion.div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// };

// const FAQSection = () => {
//     const [activeTab, setActiveTab] = useState('static');
//     const [openIdx, setOpenIdx] = useState(0);

//     return (
//         <section className="py-24 bg-gray-50 border-t border-gray-100">
//             <div className="container mx-auto px-4 max-w-4xl">
//                 <div className="text-center mb-12">
//                     <h2 className="text-3xl font-black text-green-900 mb-4">Frequently Asked Questions</h2>
//                     <p className="text-gray-500">Everything you need to know about apnaQR solutions.</p>
//                 </div>

//                 {/* FAQ Tabs */}
//                 <div className="flex bg-gray-200 p-1 rounded-2xl mb-12 w-fit mx-auto border border-gray-200 shadow-inner">
//                     <button
//                         onClick={() => { setActiveTab('static'); setOpenIdx(0); }}
//                         className={`px-8 py-3 rounded-[14px] font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'static' ? 'bg-white text-green-700 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
//                     >
//                         <ShieldCheck size={18} /> Static QR
//                     </button>
//                     <button
//                         onClick={() => { setActiveTab('dynamic'); setOpenIdx(0); }}
//                         className={`px-8 py-3 rounded-[14px] font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'dynamic' ? 'bg-white text-green-700 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
//                     >
//                         <RefreshCw size={18} /> Dynamic QR
//                     </button>
//                 </div>

//                 {/* Accordion List */}
//                 <div className="space-y-4">
//                     <AnimatePresence mode="wait">
//                         <motion.div
//                             key={activeTab}
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -10 }}
//                             className="space-y-4"
//                         >
//                             {FAQ_DATA[activeTab].map((item, idx) => (
//                                 <div
//                                     key={idx}
//                                     className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${openIdx === idx ? 'border-green-600 shadow-lg shadow-green-100' : 'border-gray-100 hover:border-gray-200'}`}
//                                 >
//                                     <button
//                                         onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
//                                         className="w-full p-6 text-left flex justify-between items-center gap-4"
//                                     >
//                                         <span className="font-bold text-gray-800 text-lg leading-tight">{item.q}</span>
//                                         <div className={`flex-shrink-0 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : 'rotate-0'}`}>
//                                             {openIdx === idx ? <Minus className="text-green-600" /> : <Plus className="text-gray-400" />}
//                                         </div>
//                                     </button>
//                                     <motion.div
//                                         initial={false}
//                                         animate={{ height: openIdx === idx ? 'auto' : 0, opacity: openIdx === idx ? 1 : 0 }}
//                                         className="overflow-hidden"
//                                     >
//                                         <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
//                                             {item.a}
//                                         </div>
//                                     </motion.div>
//                                 </div>
//                             ))}
//                         </motion.div>
//                     </AnimatePresence>
//                 </div>

//                 {/* Quick Comparison Note */}
//                 <div className="mt-16 p-8 bg-green-900 rounded-3xl text-white relative overflow-hidden group">
//                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors"></div>
//                     <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
//                         <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
//                             <AlertCircle size={40} className="text-orange-400" />
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-bold mb-2">Static vs Dynamic – Quick Tip</h3>
//                             <p className="text-green-100 text-sm opacity-80 max-w-lg">
//                                 Use **Static QR** for fixed batch compliance data (Mfg/Exp).
//                                 Use **Dynamic QR** for marketing and product portals that you'll update frequently over several years.
//                             </p>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// const Footer = () => (
//     <footer className="bg-gray-900 text-white pt-16 pb-8 border-t-4 border-green-600">
//         <div className="container mx-auto px-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
//                 <div>
//                     <span className="text-2xl font-black text-white mb-6 block italic">apna<span className="text-green-500">QR</span></span>
//                     <p className="text-gray-400 text-sm leading-relaxed">
//                         Dedicated QR generation platform for Agri-manufacturers. Ensuring farmer trust and government compliance under FCO 1985.
//                     </p>
//                 </div>
//                 <div>
//                     <h4 className="text-green-500 font-bold mb-6 uppercase text-sm tracking-widest">Solutions</h4>
//                     <ul className="space-y-3 text-sm text-gray-400">
//                         <li><a href="#" className="hover:text-white">Static QR Labels</a></li>
//                         <li><a href="#" className="hover:text-white">Dynamic Information Portals</a></li>
//                         <li><a href="#" className="hover:text-white">Bulk Printing Links</a></li>
//                         <li><a href="#" className="hover:text-white">Counterfeit Protection</a></li>
//                     </ul>
//                 </div>
//                 <div>
//                     <h4 className="text-green-500 font-bold mb-6 uppercase text-sm tracking-widest">Support</h4>
//                     <ul className="space-y-3 text-sm text-gray-400">
//                         <li><a href="#" className="hover:text-white">Compliance Guide</a></li>
//                         <li><a href="#" className="hover:text-white">FAQs</a></li>
//                         <li><a href="#" className="hover:text-white">Terms of Service</a></li>
//                         <li><a href="#" className="hover:text-white">Contact Us</a></li>
//                     </ul>
//                 </div>
//                 <div className="bg-white/5 p-6 rounded-xl border border-white/10">
//                     <h4 className="font-bold mb-4 text-white">Print-Ready Solutions</h4>
//                     <p className="text-xs text-gray-400 mb-4">Directly share high-res PDF links with your label printing vendors.</p>
//                     <button className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded font-bold text-sm hover:bg-green-700 transition w-full justify-center">
//                         <Printer size={16} /> Vendor Login
//                     </button>
//                 </div>
//             </div>
//             <div className="border-t border-white/10 pt-8 text-center">
//                 <p className="text-xs text-gray-500">© 2026 apnaQR. Dedicated to the Prosperity of Indian Farmers. <br /> Developed as per Ministry of Agriculture Guidelines.</p>
//             </div>
//         </div>
//     </footer>
// );

// export default function App() {
//     return (
//         <div className="font-sans bg-gray-50 min-h-screen text-[#333]">
//             <TopBar />
//             <Navbar />
//             <HeroSlider />

//             {/* Ticker */}
//             <div className="bg-green-700 text-white py-2 overflow-hidden flex items-center">
//                 <div className="bg-green-900 px-4 py-1 text-xs font-bold uppercase z-10">Alert</div>
//                 <div className="whitespace-nowrap flex gap-8 px-4 text-sm animate-pulse">
//                     <span className="font-medium">Mandatory: QR Codes required for all Biostimulants as per FCO 1985 guidelines.</span>
//                 </div>
//             </div>

//             <section className="py-16 bg-white">
//                 <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
//                     <div className="md:w-1/2">
//                         <img src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800" alt="Farmer scanning" className="rounded-2xl shadow-2xl" />
//                     </div>
//                     <div className="md:w-1/2">
//                         <h2 className="text-3xl font-bold text-green-800 mb-6">Empowering Farmers with Transparency</h2>
//                         <p className="text-gray-600 mb-4">apnaQR bridges the gap between manufacturers and farmers. By scanning our government-compliant QR codes, farmers instantly access:</p>
//                         <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             {[
//                                 "Authenticity Verification", "Correct Dosage Guides",
//                                 "Batch Expiry Checks", "Composition Details",
//                                 "Official Gazette Info", "Application Methods"
//                             ].map(feat => (
//                                 <li key={feat} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
//                                     <div className="w-2 h-2 bg-orange-500 rounded-full"></div> {feat}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>
//             </section>

//             <ProductDifference />
//             <StepGrid />
//             <FAQSection />

//             {/* Stats */}
//             <section className="py-16 bg-gray-50">
//                 <div className="container mx-auto px-4">
//                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//                         {STATS_DATA.map((stat, idx) => (
//                             <div key={idx} className="bg-white rounded-xl shadow-md p-6 text-center">
//                                 <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white mx-auto mb-4 ${stat.color}`}>
//                                     {stat.icon}
//                                 </div>
//                                 <h3 className="text-xl font-bold text-gray-800">{stat.count}</h3>
//                                 <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </section>

//             <Footer />
//         </div>
//     );
// }

import React from 'react'

const Home2 = () => {
  return (
    <div>
      
    </div>
  )
}

export default Home2
