"use client";

import { Doc } from "@/convex/_generated/dataModel";
import Autoplay from "embla-carousel-autoplay";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

const ProductCard = ({ product,index }: { product: Doc<"products">,index:number }) => {
  const randomDelay = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000; // Random delay between 5 and 15 seconds
  const plugin = useRef(Autoplay({ delay: randomDelay , stopOnInteraction: true }));

 
  const isNew =
    product._creationTime &&
    product._creationTime * 1000 > Date.now() - 7 * 24 * 60 * 60 * 1000;

  const hasDiscount =
    product.originalPrice && product.discountPrice < product.originalPrice;

  return (
    <Link
      href={`/product/${product._id}`}
      className="group relative flex flex-col bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image Carousel - Fixed aspect ratio container */}
      <div className="relative w-full  aspect-square  overflow-hidden">
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
                className="relative w-full h-full flex items-center justify-center"
              >
                <div className="relative w-full h-[300px]">
                  {/* Blurred background image */}
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover scale-110 blur-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Foreground product image */}
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {isNew && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow z-10">
            NEW
          </span>
        )}

        {/* {hasDiscount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow z-10">
            -{Math.round(
              (1 - product.discountPrice / product.originalPrice) * 100
            )}
            %
          </span>
        )} */}
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {product.description}
        </p>

        {/* Ratings */}
        {/* {product.rating && (
          <div className="mt-2">{renderStars(product.rating, product.reviewCount || 0)}</div>
        )} */}

        {/* Price Section */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">
              {product.discountPrice.toLocaleString()} RWF
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {product.originalPrice?.toLocaleString()} RWF
              </span>
            )}
          </div>

          <Button
            size="icon"
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-transform hover:scale-105"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t px-4 py-3 bg-gray-50 text-center">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-full font-semibold py-2 transition-transform hover:scale-[1.02]">
          Shop Now
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;