"use client";

import React from 'react';
import { motion } from 'framer-motion';

const BRANDS = [
  { name: 'Mercedes-Benz', logo: '/Mercedes-Benz-Logo.wine.png' },
  { name: 'Hero MotoCorp', logo: '/hero_logo.png' },
  { name: 'Caterpillar', logo: '/Caterpillar_Inc.-Logo.wine.png' },
  { name: 'Maruti Suzuki', logo: 'https://logo.clearbit.com/marutisuzuki.com' },
  { name: 'Bajaj Auto', logo: 'https://logo.clearbit.com/bajajauto.com' },
  { name: 'Ashok Leyland', logo: '/Ashok_Leyland-Logo.wine.png' },
  { name: 'Royal Enfield', logo: '/royal-enfield-logo-1.svg' },
  { name: 'Siemens', logo: '/Siemens-Logo.wine.png' },
  { name: 'Honeywell', logo: '/Honeywell-Logo.wine.png' },
  { name: 'Unilever', logo: '/Unilever-Logo.wine.png' },
  { name: 'Aditya Birla', logo: 'https://logo.clearbit.com/adityabirla.com' },
  { name: 'Apollo Tyres', logo: 'https://logo.clearbit.com/apollotyres.com' },
];

export function LogoMarquee() {
  // Duplicate brands to create a seamless loop
  const duplicatedBrands = [...BRANDS, ...BRANDS];

  return (
    <div className="w-full bg-white py-14 border-y border-gray-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 mb-10">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
          Trusted by 1000+ enterprises and 7 lakh+ MSMEs for hiring
        </h2>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="flex overflow-hidden">
        <motion.div 
          className="flex gap-24 items-center whitespace-nowrap"
          animate={{ x: [0, -1920] }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {duplicatedBrands.map((brand, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-center transition-all duration-500 cursor-pointer px-10 group"
            >
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-110" 
              />
              <span className="text-xl font-black text-gray-900 tracking-tighter hidden lg:block group-hover:text-primary transition-colors ml-4">
                {brand.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
