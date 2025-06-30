"use client";
import Link from "next/link";
import React from "react";
import { AlignRight, Search } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NavLinks } from "@/constants";

export default function Header() {
  return (
    <header className="bg-[#03045e] text-white w-full">
      <div className="container mx-auto flex justify-between items-center p-4 gap-2">
        <Link href={'/'} className="flex items-center justify-center gap-2">
          <Image src={'/convex.svg'} alt="logo" height={20} width={40} />
          <div className="md:flex items-center justify-center flex-col hidden">
          <h1 className="text-xl font-bold">Mosse Tech</h1>
          <p>LTd</p>
        </div>
        </Link>
        <SearchBox />
        <div className=" items-center justify-end gap-2 md:gap-4 hidden md:flex">
          <nav className="hidden md:flex space-x-4">
            {
              NavLinks.map((link)=>(

            <Link href={link.link} key={link.label} className="hover:text-blue-300 capitalize">
              Products
            </Link>
              ))
            }
            
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
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
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
      className="relative flex items-center w-full max-w-xs md:max-w-sm lg:max-w-md bg-stone-900 rounded-md "
      role="search"
      aria-label="Site search"
    >
      <input
        ref={inputRef}
        type="text"
        className="w-full rounded-l-md border border-stone-600 border-r-0 px-3 py-2 focus:outline-none focus:ring-0 focus:ring-blue-500 text-primary-foreground placeholder:text-xs"
        placeholder="Search products, brands, or categories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-12 text-gray-100 focus:outline-none bg-stone-600 rounded-full p-1 cursor-pointer hover:text-red-500"
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
        className="rounded-l-none rounded-r-md px-3 py-2 h-full flex items-center gap-1 bg-stone-700 cursor-pointer"
        aria-label="Submit search"
      >
        <Search className="w-4 h-4" />
      </Button>
    </form>
  );
}
