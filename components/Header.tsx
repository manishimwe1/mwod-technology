"use client";
import Link from "next/link";
import React from "react";
import { AlignRight, Search } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-primary text-white w-full">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center justify-center gap-2">
          <Image src={'/convex.svg'} alt="logo" height={20} width={40} />
          <div className="md:flex items-center justify-center flex-col hidden">
          <h1 className="text-xl font-bold">Mosse Tech</h1>
          <p>LTd</p>
        </div>
        </div>
        <SearchBox />
        <div className=" items-center justify-end gap-2 md:gap-4 hidden md:flex">
          <nav className="hidden md:flex space-x-4">
            <Link href="#products" className="hover:text-blue-300">
              Products
            </Link>
            <Link href="#deals" className="hover:text-blue-300">
              Deals
            </Link>
            <Link href="#contact" className="hover:text-blue-300">
              Contact
            </Link>
          </nav>
          <Button
            size={"sm"}
            className="bg-primary-foreground text-primary hover:text-white cursor-pointer transition-all duration-100 hover:bg-stone-900"
          >
            Sign in
          </Button>
        </div>
          <Button size={'icon'} className="md:hidden cursor-pointer border border-stone-500">
            <AlignRight />
          </Button>
      </div>
    </header>
  );
}

function SearchBox() {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Implement search logic
    if (query.trim()) {
      // For now, just blur the input
      inputRef.current?.blur();
    }
  }

  function handleClear() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-xs md:max-w-sm lg:max-w-md bg-stone-700 rounded-md "
      role="search"
      aria-label="Site search"
    >
      <input
        ref={inputRef}
        type="text"
        className="w-full rounded-l-md border border-stone-600 border-r-0 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-primary-foreground placeholder:text-xs"
        placeholder="Search products, brands, or categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-12 text-gray-100 hover:text-gray-600 focus:outline-none bg-stone-600 rounded-full p-1"
          tabIndex={0}
          aria-label="Clear search"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 6L6 18M6 6l12 12"
            />
          </svg>
        </button>
      )}
      <Button
        type="submit"
        size="sm"
        className="rounded-l-none rounded-r-md px-3 py-2 h-full flex items-center gap-1 bg-stone-700"
        aria-label="Submit search"
      >
        <Search className="w-4 h-4" />
      </Button>
    </form>
  );
}
