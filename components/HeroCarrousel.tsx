'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Pause, Play, ChevronRight } from 'lucide-react';

interface SlideData {
  id: number;
  bgColor: string;
  textColor: string;
  subTextColor: string;
  buttonColor: string;
  buttonTextColor: string;
  title: string;
  subtitle: string;
  ctaText: string;
  type: 'grid' | 'feature'; 
  content?: any;
}

const slides: SlideData[] = [
  {
    id: 0,
    bgColor: 'bg-[#00aee5]', // The bright blue
    textColor: 'text-[#191919]',
    subTextColor: 'text-[#191919]',
    buttonColor: 'bg-[#191919]',
    buttonTextColor: 'text-white',
    title: "All your faves are here",
    subtitle: "Refresh your space, elevate your style and power your work.",
    ctaText: "Do your thing",
    type: 'grid',
    content: [
      { 
        label: "Home and Garden", 
        img: "https://images.unsplash.com/photo-1596238618776-8803ccb6f376?q=80&w=400&auto=format&fit=crop", 
        alt: "Patio furniture" 
      },
      { 
        label: "Fashion", 
        img: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=400&auto=format&fit=crop", 
        alt: "Fashion bag and shoes" 
      },
      { 
        label: "Business & Industrial", 
        img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=400&auto=format&fit=crop", 
        alt: "Power drill" 
      }
    ]
  },
  {
    id: 1,
    bgColor: 'bg-[#181818]', // Dark black/grey
    textColor: 'text-white',
    subTextColor: 'text-white',
    buttonColor: 'bg-white',
    buttonTextColor: 'text-[#191919]',
    title: "Endless accessories. Epic prices.",
    subtitle: "Browse millions of upgrades for your ride.",
    ctaText: "Shop now",
    type: 'feature',
    content: [
      { img: "https://images.unsplash.com/photo-1563720360172-67b8f3dcebb8?q=80&w=500&auto=format&fit=crop" }, // Car seat
      { img: "https://images.unsplash.com/photo-1622616231267-36cb43de888c?q=80&w=500&auto=format&fit=crop" }, // Mat/Part
    ]
  },
  {
    id: 2,
    bgColor: 'bg-[#f7f7f7]',
    textColor: 'text-[#191919]',
    subTextColor: 'text-[#555]',
    buttonColor: 'bg-transparent border border-[#191919]',
    buttonTextColor: 'text-[#191919]',
    title: "Score the new Pixel 9 Pro.",
    subtitle: "Get a generic phone with amazing features today.",
    ctaText: "Shop now",
    type: 'feature',
    content: [
      { img: "https://images.unsplash.com/photo-1598327770170-66916578e99e?q=80&w=600&auto=format&fit=crop" }
    ]
  },
   {
    id: 3,
    bgColor: 'bg-[#feb786]',
    textColor: 'text-[#4a1a00]',
    subTextColor: 'text-[#5e2e00]',
    buttonColor: 'bg-[#4a1a00]',
    buttonTextColor: 'text-[#feb786]',
    title: "Collectibles you crave.",
    subtitle: "Find rare cards, coins, and more.",
    ctaText: "Start collecting",
    type: 'grid',
    content: [
      { label: "Trading Cards", img: "https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?q=80&w=400&auto=format&fit=crop", alt: "Cards" },
      { label: "Coins", img: "https://images.unsplash.com/photo-1518563222391-a6202058428f?q=80&w=400&auto=format&fit=crop", alt: "Coins" },
      { label: "Comics", img: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=400&auto=format&fit=crop", alt: "Comics" }
    ]
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = slides[currentSlide];

  return (
    <div className={`mt-6 relative w-full h-[330px] rounded-lg overflow-hidden transition-colors duration-500 ease-in-out ${slide.bgColor}`}>
      <div className="flex h-full">
        
        {/* Text Section */}
        <div className="w-full md:w-1/3 flex flex-col justify-center px-8 md:pl-16 z-10 relative">
           <h2 className={`text-3xl md:text-[32px] font-bold leading-tight mb-3 ${slide.textColor}`}>
             {slide.title}
           </h2>
           <p className={`text-[17px] mb-6 font-normal ${slide.subTextColor}`}>
             {slide.subtitle}
           </p>
           <div>
             <button className={`${slide.buttonColor} ${slide.buttonTextColor} px-6 py-2.5 rounded-full font-semibold text-[15px] hover:opacity-90 transition-opacity`}>
               {slide.ctaText}
             </button>
           </div>
        </div>

        {/* Content/Image Section */}
        <div className="hidden md:flex flex-grow items-center justify-around pr-12 relative z-0">
          
          {/* Layout for Slide 1 (Grid of 3) */}
          {slide.type === 'grid' && (
             <div className="flex w-full justify-end space-x-8 lg:space-x-12 mt-8">
                {slide.content.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col items-center group cursor-pointer">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 relative transition-transform duration-300 transform group-hover:-translate-y-2">
                      {/* Using mix-blend-multiply to attempt to simulate transparent product shots on colored bg if white bg images are used, 
                          though real ebay uses transparent PNGs. We will use object-contain. */}
                      <img 
                        src={item.img} 
                        alt={item.alt} 
                        className="w-full h-full object-contain drop-shadow-xl rounded-lg"
                      />
                    </div>
                    <div className={`mt-4 flex items-center text-[15px] font-medium ${slide.textColor} hover:underline`}>
                      {item.label} <ChevronRight size={16} className="ml-1" />
                    </div>
                  </div>
                ))}
             </div>
          )}

          {/* Layout for Slide 2 (Feature/Motors) */}
          {slide.type === 'feature' && (
            <div className="flex w-full justify-end items-center space-x-4 pr-10">
               {slide.content.map((item: any, idx: number) => (
                  <div key={idx} className={`relative transition-transform duration-500 transform ${idx === 0 ? 'scale-100 z-10 translate-x-10' : 'scale-90 -rotate-6 -translate-x-4 opacity-80 z-0'}`}>
                    <div className="w-56 h-56 bg-white p-2 rounded-xl shadow-2xl flex items-center justify-center">
                       <img src={item.img} className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>
               ))}
            </div>
          )}
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-6 right-8 flex items-center gap-3">
         <button 
           onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
           className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm text-[#191919] transition-colors"
         >
           <ArrowLeft size={16} />
         </button>
         <button 
           onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
           className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm text-[#191919] transition-colors"
         >
           <ArrowRight size={16} />
         </button>
         <button 
            onClick={() => setIsPaused(!isPaused)}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm text-[#191919] transition-colors"
         >
           {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
         </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSlide === idx 
                ? (slide.id === 1 ? 'bg-white' : 'bg-[#191919]') 
                : (slide.id === 1 ? 'bg-white/40 hover:bg-white/60' : 'bg-[#191919]/30 hover:bg-[#191919]/50')
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;