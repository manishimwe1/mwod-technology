"use client";

import Loading from "@/components/Loading";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import ZoomImage from "@/components/ZoomImage";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Autoplay from "embla-carousel-autoplay";
import {
  Heart,
  Package,
  ShieldCheck,
  Truck,
  Store,
  CheckCircle2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const ProductDetailPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const params = useParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const plugin = useRef(Autoplay({ delay: 600000, stopOnInteraction: false }));

  const product = useQuery(
    api.product.getProduct,
    isClient && params.id ? { id: params.id as Id<"products"> } : "skip"
  );

  if (!isClient) return <Loading title="Loading..." />;
  if (product === undefined)
    return <Loading title="Fetching product details..." />;
  if (product === null)
    return (
      <div className="p-10 text-center text-gray-600">
        Product not found or removed.
      </div>
    );

  const discountPercent = product.originalPrice
    ? (
        ((Number(product.originalPrice) - product.discountPrice) /
          Number(product.originalPrice)) *
        100
      ).toFixed(0)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-center border-b border-blue-100">
        <span className="text-gray-700 text-sm">
          🎉 Save up to{" "}
          <span className="text-blue-600 font-bold text-base">
            {discountPercent ?? "10"}%
          </span>{" "}
          on selected items —{" "}
          <a href="#" className="text-blue-500 underline hover:text-blue-700">
            View offers
          </a>
        </span>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
              {/* Stock Badge */}
              {product.stock > 0 ? (
                <div className="absolute top-4 left-4 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm z-10">
                  In Stock ({product.stock})
                </div>
              ) : (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm z-10">
                  Out of Stock
                </div>
              )}

              {/* Image Carousel */}
              <Carousel
                className="w-full h-[500px] relative"
                opts={{ align: "start", loop: true }}
                plugins={[plugin.current]}
              >
                <CarouselContent className="h-full">
                  {product.imageUrls?.map((image, i) => (
                    <CarouselItem
                      key={i}
                      className="aspect-square relative rounded-lg overflow-hidden"
                    >
                      <ZoomImage
                        src={image!}
                        alt={product.name}
                        className="object-contain"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-blue-50 rounded-full shadow-md p-2 text-gray-800 hover:text-blue-600 transition-all" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-blue-50 rounded-full shadow-md p-2 text-gray-800 hover:text-blue-600 transition-all" />
              </Carousel>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {product.name}
              </h1>
              <p className="text-gray-600 mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Section */}
            <div className="space-y-3 border-y border-gray-200 py-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {product.discountPrice.toLocaleString()}
                </span>
                <span className="text-gray-500 text-lg">RWF</span>
              </div>
              {product.originalPrice && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 line-through text-lg">
                    {product.originalPrice.toLocaleString()} RWF
                  </span>
                  <span className="bg-red-100 text-red-600 px-2 py-1 text-sm font-medium rounded-full">
                    -{discountPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Input */}
            <div className="flex items-center gap-4">
              <label className="text-gray-700 font-semibold">Quantity:</label>
              <Input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-24 text-center text-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <span className="text-sm text-gray-500">
                ({product.stock} available)
              </span>
            </div>

            {/* Seller Info */}
            <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                {product.createdByName
                  ?.split(" ")
                  .filter((_, i, arr) => i === 0 || i === arr.length - 1)
                  .map((n) => n.charAt(0))
                  .join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 text-lg">
                    {product.createdByName}
                  </span>
                  <Store className="w-4 h-4 text-gray-500" />
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Verified Seller • 99% Positive Rating
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-lg font-semibold shadow-md transition-transform hover:scale-[1.02]">
                🛒 Add to Cart
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md text-lg font-semibold shadow-md transition-transform hover:scale-[1.02]">
                💳 Buy Now
              </button>
              <button className="p-3 rounded-md border hover:bg-gray-50 text-gray-600 transition">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Shipping & Guarantee */}
            <div className="border-t border-gray-200 pt-5 space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-blue-500" />
                <span>
                  Free shipping — expected delivery by{" "}
                  <span className="font-semibold">
                    {new Date(
                      Date.now() + 5 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-500" />
                <span>
                  Carefully packaged and dispatched within 24 hours.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <span>
                  <span className="font-semibold">Buyer Protection:</span> Full
                  refund if product doesn’t match description.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
