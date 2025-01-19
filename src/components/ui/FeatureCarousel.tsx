import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface Feature {
    title: string;
    description: string;
    image: string;
    bulletPoints: string[];
}

interface FeatureCarouselProps {
    autoPlayInterval?: number;
    swipeThreshold?: number;
}

const FeatureCarousel: React.FC<FeatureCarouselProps> = ({
    autoPlayInterval = 5000,
    swipeThreshold = 75,
}) => {
    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [touchStart, setTouchStart] = useState<number>(0);
    const [touchEnd, setTouchEnd] = useState<number>(0);

    const features: Feature[] = [
        {
            title: "Smart Task Organization",
            description: "Automatically categorize and prioritize tasks based on your team's needs.",
            image: "https://res.cloudinary.com/dml6gxfmn/image/upload/v1735849601/authImage_seuq1p.jpg",
            bulletPoints: [
                "AI-powered task categorization",
                "Smart priority assignment",
                "Custom workflow automation"
            ]
        },
        {
            title: "Real-time Collaboration",
            description: "Work together seamlessly, no matter where your team is located.",
            image: "https://res.cloudinary.com/dml6gxfmn/image/upload/v1735850134/behnam-norouzi-GAgEfSQMPa4-unsplash_uqwnej.jpg",
            bulletPoints: [
                "Live document editing",
                "Team chat integration",
                "Project timeline sync"
            ]
        },
        {
            title: "Advanced Analytics",
            description: "Get insights into your team's performance and project progress.",
            image: "https://res.cloudinary.com/dml6gxfmn/image/upload/v1735849601/authImage_seuq1p.jpg",
            bulletPoints: [
                "Custom report generation",
                "Performance metrics",
                "Trend analysis"
            ]
        }
    ];

    const nextSlide = useCallback((): void => {
        setCurrentSlide((prev) => (prev === features.length - 1 ? 0 : prev + 1));
    }, [features.length]);

    const prevSlide = (): void => {
        setCurrentSlide((prev) => (prev === 0 ? features.length - 1 : prev - 1));
    };

    const handleTouchStart = (e: React.TouchEvent): void => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent): void => {
        setTouchEnd(e.touches[0].clientX);
    };

    const handleTouchEnd = (): void => {
        if (touchStart - touchEnd > swipeThreshold) {
            nextSlide();
        }
        if (touchStart - touchEnd < -swipeThreshold) {
            prevSlide();
        }
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, autoPlayInterval);
        return () => clearInterval(timer);
    }, [nextSlide, autoPlayInterval]);

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <div className="relative">
                <div
                    className="overflow-hidden rounded-2xl"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {features.map((feature, index) => (
                            <div key={index} className="w-full flex-shrink-0 relative">
                                <div className="h-[50vh] md:max-h-[80vh] relative">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent hidden md:block" />

                                    <div className="absolute bottom-14 left-0 right-0 p-6 sm:p-8 text-white hidden md:block">
                                        <div className="max-w-5xl mx-auto">
                                            <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                                                {feature.title}
                                            </h3>
                                            <p className="text-base sm:text-lg text-gray-200 mb-4">
                                                {feature.description}
                                            </p>
                                            <ul className="grid grid-cols-3 gap-3">
                                                {feature.bulletPoints.map((point, idx) => (
                                                    <li key={idx} className="flex items-center space-x-2">
                                                        <CheckCircle className="text-green-400 flex-shrink-0 w-5 h-5" />
                                                        <span className="text-gray-200 text-sm sm:text-base">{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 md:hidden bg-white">
                                    <div className="max-w-5xl mx-auto">
                                        <h3 className="text-xl font-bold mb-2 text-gray-900">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {feature.description}
                                        </p>
                                        <ul className="space-y-2">
                                            {feature.bulletPoints.map((point, idx) => (
                                                <li key={idx} className="flex items-center space-x-2">
                                                    <CheckCircle className="text-green-500 flex-shrink-0 w-4 h-4" />
                                                    <span className="text-gray-600 text-sm">{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/3 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all md:top-1/2"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/3 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all md:top-1/2"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {features.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`w-2 h-2 rounded-full transition-all ${
                                currentSlide === index ? 'bg-white w-4' : 'bg-white/60'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeatureCarousel;