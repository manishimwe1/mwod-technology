"use client";

import Image from "next/image";
import HeroCarrousel from "./HeroCarrousel";
import { Button } from "./ui/button";

export default function TechEditorsBento() {
  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Bento Grid Container */}
        <div className="grid grid-cols-12 gap-6 auto-rows-[180px] md:auto-rows-[280px]">
          {/* Main Hero Card - Tech editors' top picks */}
          <div className="col-span-12 lg:col-span-6 row-span-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 lg:p-10 flex flex-col justify-between relative overflow-hidden hover:shadow-lg transition-shadow">
            {/* Text Content */}
            <div className="relative z-20 max-w-md">
              <p className="text-blue-800 text-sm font-medium mb-2">
                Computers, Phones, Beats & more
              </p>
              <h1 className="sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-6 leading-tight">
                Tech editors top picks
              </h1>
              
            </div>

            {/* Carousel */}
            <div className="absolute mx-auto bottom-4 md:-bottom-8 w-[90%] bg-white h-[66%] md:h-[60%] lg:w-[600px] lg:h-[400px] z-10 rounded-xl overflow-hidden">
              <HeroCarrousel />
            </div>
            <div className="absolute left-1/2 bottom-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <Button className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 border border-gray-200 px-6 py-3 rounded-full text-blue-950 font-bold hover:bg-gradient-to-r hover:from-white hover:to-blue-200 transition-all">
                Shop now
              </Button>
            </div>
          </div>

          {/* Portable Beats Card */}
          <div className="col-span-12 lg:col-span-6 bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="relative z-10 max-w-sm">
              <p className="text-blue-200 text-sm mb-1">Get it in as fast as 1 hour*</p>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">Portable Beats</h2>
              <h3 className="text-lg font-semibold mb-6">speakers & more</h3>
              <button className="text-blue-200 underline hover:text-white transition-colors">
                Shop now
              </button>
            </div>

            {/* Speaker Image */}
            <div className="absolute bottom-6 right-6 w-[220px] h-[120px] lg:w-[300px] lg:h-[150px]">
              <Image
                src="/jbl2.png"
                alt="Featured electronics and tech deals"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Smart Watches Card */}
          <div className="col-span-6 lg:col-span-3 bg-blue-50 rounded-2xl p-6 relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-blue-900 mb-1">Smart Watches</h3>
              <p className="text-blue-800 mb-4">Track your life</p>
              <button className="text-blue-700 underline text-sm hover:text-blue-900 transition-colors">
                Shop now
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-[150px] h-[150px] lg:w-[220px] lg:h-[220px]">
              <Image
                src="/watch.png"
                alt="Smart watches"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Smart Home Tech Card */}
          <div className="col-span-6 lg:col-span-3 bg-white rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Smart Home</h3>
              <p className="text-gray-700 mb-4">Tech</p>
              <button className="text-gray-700 underline text-sm hover:text-gray-900 transition-colors">
                Shop now
              </button>
            </div>
            <div className="absolute bottom-6 right-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full shadow-xl border-4 border-orange-300 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full"></div>
                <div className="relative z-10 text-white font-bold text-xl">70</div>
                <div className="absolute inset-2 border-2 border-orange-200 rounded-full opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
