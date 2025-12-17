'use client';

import { useState } from 'react';
import { Bell, ShoppingCart, ChevronDown, Search } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="font-sans text-[13px] border-b border-gray-200">
      {/* Top Utility Bar */}
      <div className="max-w-[1366px] mx-auto px-4 h-8 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-[#333]">
          <span className="text-xs sm:text-[13px]">
            Hi! <a href="#" className="text-blue-600 underline decoration-transparent hover:decoration-blue-600">Sign in</a> or <a href="#" className="text-blue-600 underline decoration-transparent hover:decoration-blue-600">register</a>
          </span>
          <a href="#" className="hidden md:block hover:underline">Daily Deals</a>
          <a href="#" className="hidden md:block hover:underline">Brand Outlet</a>
          <a href="#" className="hidden md:block hover:underline">Gift Cards</a>
          <a href="#" className="hidden md:block hover:underline">Help & Contact</a>
        </div>
        <div className="flex items-center space-x-6 text-[#333]">
          <a href="#" className="hover:underline hidden sm:block">Ship to</a>
          <a href="#" className="hover:underline hidden sm:block">Sell</a>
          <div className="md:flex items-center cursor-pointer hover:underline group hidden sm:flex">
            <span>Watchlist</span>
            <ChevronDown size={14} className="ml-1" />
          </div>
          <div className="flex items-center cursor-pointer hover:underline group">
            <span>My account</span>
            <ChevronDown size={14} className="ml-1" />
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <Bell size={20} className="text-[#333]" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-full">
            <ShoppingCart size={20} className="text-[#333]" />
          </button>
        </div>
      </div>

      {/* Main Header Area */}
      <div className="max-w-[1366px] mx-auto px-4 py-4 flex flex-col md:flex-row items-center gap-4">
        {/* Logo */}
        <a href="#" className="shrink-0 mr-2">
           <img 
            src="/logo-no.png" 
            alt="logo" 
            className="w-[110px] h-auto -mt-2"
          />
        </a>

        {/* Shop by Category Dropdown trigger */}
        <div className="hidden lg:flex items-center text-sm text-[#555] cursor-pointer hover:text-blue-600 shrink-0 gap-1 group">
          <span>Shop by<br /> category</span>
          <ChevronDown size={14} className="mt-2 text-[#777] group-hover:text-blue-600" />
        </div>

        {/* Search Bar Container */}
        <div className="flex-grow w-full md:w-auto relative">
          <div className="flex w-full h-[44px] border-2 border-[#191919] rounded-full overflow-hidden focus-within:ring-1 focus-within:ring-[#3665f3]">
             <div className="flex items-center pl-3 text-gray-400">
               <Search size={18} />
             </div>
             <input 
                type="text" 
                placeholder="Search for anything" 
                className="flex-grow px-3 outline-none text-[15px] text-[#191919] placeholder-gray-500"
             />
             
             {/* Category Select Inside Search */}
             <div className="hidden sm:flex items-center border-l border-gray-300 px-4 bg-white cursor-pointer hover:bg-gray-50 h-full text-[13px]">
                <span className="whitespace-nowrap">All Categories</span>
                <ChevronDown size={14} className="ml-2 text-[#555]" />
             </div>
          </div>
          
           {/* Search Button Absolute to ensure rounded corners styling matches exact ebay pill */}
           <button className="absolute right-0 top-0 bottom-0 bg-[#3665f3] hover:bg-[#2d54cc] text-white px-10 md:px-12 font-semibold text-[15px] rounded-r-full h-[44px] -mr-[2px] -mt-[2px] -mb-[2px] border-2 border-[#3665f3]">
             Search
           </button>
        </div>

        {/* Advanced Search Link */}
        {/* <a href="#" className="hidden lg:block text-[#555] text-[13px] hover:text-[#3665f3] shrink-0 ml-2">
          Advanced
        </a> */}
      </div>

      {/* Secondary Navigation (Categories) */}
      <div className="max-w-[1366px] mx-auto px-4 pb-2 mt-2 overflow-x-auto no-scrollbar">
        <ul className="flex items-center space-x-5 text-[13px] text-[#555] whitespace-nowrap">
           {/* <li className="font-semibold border-b-2 border-transparent hover:border-current cursor-pointer hover:text-[#3665f3]"><a href="#">eBay Live</a></li> */}
           {/* <li className="border-b-2 border-transparent hover:border-current cursor-pointer hover:text-[#3665f3]"><a href="#">Saved</a></li> */}
           <li className="border-b-2 border-transparent hover:border-current cursor-pointer hover:text-[#3665f3]"><a href="#">Electronics</a></li>
           {/* <li className="border-b-2 border-transparent hover:border-current cursor-pointer hover:text-[#3665f3]"><a href="#">Motors</a></li> */}
           <li className="border-b-2 border-transparent hover:border-current cursor-pointer hover:text-[#3665f3]"><a href="#">Accessories</a></li>
           <li className="border-b-2 border-transparent hover:border-current cursor-pointer hover:text-[#3665f3]"><a href="#">Laptops</a></li>
           <li className="border-b-2 border-transparent hover:border-current cursor-pointer hover:text-[#3665f3]"><a href="#">Desktop</a></li>
           <li className="border-b-2 border-transparent hover:border-current cursor-pointer hover:text-[#3665f3]"><a href="#">Storages</a></li>
           <li className="border-b-2 border-transparent hover:border-current cursor-pointer hover:text-[#3665f3]"><a href="#">Phones</a></li>
           {/* <li className="border-b-2 border-transparent hover:border-current cursor-pointer hover:text-[#3665f3]"><a href="#">Home & Garden</a></li> */}
           <li className="border-b-2 border-transparent hover:border-current cursor-pointer hover:text-[#3665f3]"><a href="#">Deals</a></li>
           <li className="border-b-2 border-transparent hover:border-current cursor-pointer hover:text-[#3665f3]"><a href="#">Sell</a></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;