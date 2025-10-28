"use client";

export const dynamic = "force-dynamic"; // 👈 prevent prerender crash

import Loading from "@/components/Loading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Autoplay from "embla-carousel-autoplay";
import { Heart, Info } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const ProductDetailPage = () => {
  const [quantity, setQuantity] = useState(1);
  const params = useParams();

  // ✅ Autoplay plugin (safe ref)
  const plugin = useRef(Autoplay({ delay: 600000, stopOnInteraction: false }));

  // ✅ Convex product query (safe runtime only)
  const product = useQuery(api.product.getProduct, {
    id: params.id as Id<"products">,
  });

  // ✅ Loading and null guards
  if (product === undefined) return <Loading title="Loading product details..." />;
  if (product === null) return <div className="p-10 text-center">Product not found.</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 px-4 py-2 text-center">
        <span className="text-gray-700 text-sm">
          SAVE UP TO{" "}
          <span className="text-red-600 font-bold text-lg">14%</span>{" "}
          <a href="#" className="underline text-xs">
            See all eligible items and terms
          </a>
          <span className="ml-1">▸</span>
        </span>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative">
              {/* Stock Badge */}
              <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 absolute top-4 left-4 z-10 rounded">
                {product.stock} IN STOCK
              </div>

              {/* Image Carousel */}
              <Carousel
                className="w-full h-full relative"
                opts={{ align: "start", loop: true }}
                plugins={[plugin.current]}
              >
                <CarouselContent>
                  {product.imageUrls?.map((image, index) => (
                    <CarouselItem
                      key={index}
                      className="aspect-square relative rounded-lg overflow-hidden"
                    >
                      <Zoom>
                        <Image
                          src={image!}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 
                                 (max-width: 1200px) 80vw, 
                                 33vw"
                        />
                      </Zoom>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 py-4">
                {product.name}
              </h1>

              {/* Specifications */}
              {/* <div className="flex flex-wrap gap-2">
                {product.specifications?.map((spec) => (
                  <p className="text-gray-600 mt-2" key={spec.key}>
                    <span className="font-bold">{spec.key}:</span> {spec.value}
                  </p>
                ))}
              </div> */}

              {/* Description */}
              <div className="text-gray-700 text-justify py-2 text-sm leading-relaxed">
                {product.description}
              </div>
            </div>

            {/* Seller Info */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">
                    {product.createdByName
                      ?.split(" ")
                      .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                      .map((n) => n.charAt(0))
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{product.createdByName}</span>
                    <span className="text-gray-500 text-sm">seller</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">99.8% positive</span>
                    <span className="text-gray-500">·</span>
                    <a href="#" className="text-blue-600 underline">
                      Seller&apos;s other items
                    </a>
                    <span className="text-gray-500">·</span>
                    <a href="#" className="text-blue-600 underline">
                      Contact seller
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">{product.discountPrice.toLocaleString()}</span>
                <span className="text-gray-500 text-sm">Rwf</span>
              </div>
              {product.originalPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 line-through">
                    Was {product.originalPrice.toLocaleString()} Rwf
                  </span>
                  <span className="text-red-600 font-semibold">
                    ({(((Number(product.originalPrice) - product.discountPrice) * 100) /
                      Number(product.originalPrice)
                    ).toFixed(0) + "%"})
                  </span>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-8">
              <span className="text-gray-700">Quantity:</span>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 px-3 py-1 border border-gray-300 rounded text-center"
                  min="1"
                />
                <span className="text-gray-500">127 sold</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition">
                Buy It Now
              </button>

              <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-3 px-6 rounded-full text-lg transition border border-blue-200">
                Add to cart
              </button>

              <button className="w-full bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-6 rounded-full text-lg transition border border-gray-300 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Add to Watchlist
              </button>
            </div>

            {/* Shipping Info */}
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Free shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span>Est. between Mon, Dec 2 and Thu, Dec 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Returns</span>
                <span>30 day returns. Buyer pays for return shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
