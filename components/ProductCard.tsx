"use client";

import { Doc } from "@/convex/_generated/dataModel";
import Autoplay from "embla-carousel-autoplay";
import { Award, Eye, Flame, HeartIcon, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

const ProductCard = ({ product }: { product: Doc<"products"> }) => {
  const randomDelay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000; // Random delay between 5 and 15 seconds
  const plugin = useRef(
    Autoplay({ delay: randomDelay, stopOnInteraction: true })
  );

  return (
    <Link
      href={`/product/${product._id}`}
      className="
    group relative flex flex-col
    bg-white rounded-3xl 
    shadow-[0px_4px_20px_rgba(0,0,0,0.06)]
    hover:shadow-[0px_12px_30px_rgba(0,0,0,0.12)]
    transition-all duration-500 ease-out 
    overflow-hidden border border-white/40
    hover:-translate-y-2 hover:scale-[1.02]
    backdrop-blur-xl
  "
    >
      {/* Image Carousel - Fixed aspect ratio container */}
      <div
        className="
    relative w-full aspect-square overflow-hidden 
    bg-gradient-to-b from-gray-50 to-white
    rounded-t-3xl
    border-b border-gray-100
    shadow-inner
  "
      >
        <Carousel
          className="w-full h-full"
          opts={{ loop: true }}
          plugins={[plugin.current]}
        >
          <CarouselContent className="h-full ">
            {/* @ts-ignore */}
            {product.imageUrls?.map((image: string, index: number) => (
              <CarouselItem
                key={index}
                className="relative w-full h-full flex items-center justify-center "
              >
                <div className="relative w-full h-[300px] rounded-md">
                  {/* Blurred background image */}
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover scale-110 blur-lg  "
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Foreground product image */}
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover p-4 group-hover:scale-105 transition-transform duration-300 rounded-lg "
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Badge */}
        <div
          className={`
    absolute top-3 left-3 z-20
    px-3 py-1 rounded-full text-xs font-bold shadow-md
    backdrop-blur-md bg-white/60 border border-white/40
    ${product.badge === "HOT" ? "text-orange-600" : "text-blue-600"}
  `}
        >
          {product.badge}
        </div>

        {/* Wishlist Button */}
        <button
          className="absolute cursor-pointer top-3 right-3 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md transition"
          aria-label="Add to wishlist"
        >
          <HeartIcon className="w-4 h-4 text-gray-700 hover:text-red-500 hover:fill-red-500 transition" />
        </button>

        {/* Views Badge */}
        {product?.views && product.views && (
          <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <Flame className="w-3 h-3" />
            {product.views} viewing
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.likes || 0})</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition min-h-[3rem]">
          {product.name}
        </h3>

        {/* Condition */}
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
            <Award className="w-3 h-3" />
            {product.condition}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-start justify-end  h-12 gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900 ">
            {product.price.toLocaleString()}
            <span className="text-sm font-normal text-gray-600"> RWF</span>
          </span>
          {product.originalPrice && (
            <span className=" items-end flex  h-full text-blue-400 line-through">
              {product.originalPrice.toLocaleString()} Rfw
            </span>
          )}
        </div>

        {product.originalPrice && (
          <div className="bg-green-50 rounded-lg p-2 mb-4">
            <p className="text-xs text-green-800 text-center font-semibold">
              💰 Save {(product.originalPrice - product.price).toLocaleString()}{" "}
              RWF
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          {/* <button
            className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition"
            aria-label="Quick view"
          >
            <Eye className="w-5 h-5 text-gray-700" />
          </button> */}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
