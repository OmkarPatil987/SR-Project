import { useEffect, useState } from "react";

const HERO_SLIDES = [
    "/images/home/b4.png",
    "/images/home/b5.png",
];

export const HeroSlider = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) =>
                prev === HERO_SLIDES.length - 1 ? 0 : prev + 1
            );
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        /* REMOVED absolute positioning relative to top. 
           Added 'block' to ensure it sits BELOW the header.
        */
        <div className="relative block w-full h-[60vh] md:h-[80vh] max-h-[700px] overflow-hidden bg-gray-100">
            {HERO_SLIDES.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <img
                        src={slide}
                        alt="Agri Banner"
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
};