'use client'

import { Menu, Search, ShoppingBag, ShoppingBasket, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

   useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-lg ${
        scrolled
          ? "bg-white/30 shadow-lg border-b border-white/20"
          : "bg-white border-b border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-12 lg:h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center relative gap-2 h-10 lg:h-14 w-10 lg:w-14">
              <Link href="/" className="text-2xl font-bold text-green-600">
                <Image src="/logo.png" alt="logo" fill priority />
              </Link>
            </div>
            {/* <span className="font-bold text-xl text-gray-900 hidden sm:inline">
              EasyFix
            </span> */}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              prefetch
              href="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Browse
            </Link>
            <Link
              prefetch
              href="/sell"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Sell
            </Link>
            <Link
              prefetch
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              About
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for phones, laptops, accessories..."
                className="w-full pl-10 pr-4 py-2 border  placeholder:text-stone-500 text-stone-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg transition"
              aria-label="Account"
              variant={'secondary'}
              size={'sm'}
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Button>
            <Button
              className="relative p-2 hover:bg-gray-100 cursor-pointer rounded-lg transition"
              aria-label="Shopping cart"
              variant={'secondary'}
              size={'sm'}
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            <Button
              variant={'secondary'}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Menu"
              size={'sm'}
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search electronics..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Search products"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              prefetch
              href="/browse"
              className="block py-2 text-gray-700 hover:text-blue-600"
            >
              Browse
            </Link>
            <Link
              prefetch
              href="/sell"
              className="block py-2 text-gray-700 hover:text-blue-600"
            >
              Sell
            </Link>
            <Link
              prefetch
              href="/about"
              className="block py-2 text-gray-700 hover:text-blue-600"
            >
              About
            </Link>
            <Link
              prefetch
              href="/dashboard"
              className="block py-2 text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
