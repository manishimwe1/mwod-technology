import { ShoppingCart, Star, StarHalf } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

const ProductCard = ({ product }: { product: Doc<"products"> }) => {
  const plugin = useRef(
    Autoplay({ delay: 600000, stopOnInteraction: false }) // 10min interval
  );
  // Function to render stars based on rating
  const renderStars = (rating: number, reviewCount: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-600 ml-1">({reviewCount})</span>
      </div>
    );
  };

  return (
    <Link href={`/product/${product._id}`} className="bg-white rounded-lg shadow-sm shadow-blue-100 cursor-pointer border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200 group relative">
      {/* Product Image */}
      <div>
        <Carousel
          className="w-full h-full  relative"
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
        >
          {/* gap-4 gives space between items */}
          <CarouselContent className="">
            {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              product.imageUrls.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="aspect-square relative rounded-lg overflow-hidden group"
                >
                  <Image
                    src={image}
                    alt={image}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 33vw"
                  />
                </CarouselItem>
              ))
            }
          </CarouselContent>

          {/* Navigation buttons */}
          {/* <CarouselPrevious className="hidden sm:flex -left-12 lg:-left-16" />
          <CarouselNext className="hidden sm:flex -right-12 lg:-right-16" /> */}
        </Carousel>
      </div>

      {product.isNew && (
        <span className="absolute top-2 right-2 bg-blue-500 text-sm font-medium text-gray-900 px-2 rounded-full">
          New
        </span>
      )}

      <Button  className="absolute cursor-pointer top-1/2 right-2 bg-blue-500 text-sm font-medium text-gray-900 p-2 rounded-full group">
        <ShoppingCart className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
      </Button>

      <div className="flex flex-col pb-4">
        <h3 className="text-2xl font-semibold text-gray-900 py-4 line-clamp-2 leading-5 tracking-tight hover:text-blue-600 transition-colors">
          {product.name.length > 60 
            ? `${product.name.substring(0, 1).toUpperCase()}${product.name.substring(1, 60)}...`
            : `${product.name.substring(0, 1).toUpperCase()}${product.name.substring(1)}`}
        </h3>

        <p className="text-base pb-1 text-gray-500 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="mb-3">
          {renderStars(product.rating || 0, product.reviewCount || 0)}
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString()} Rwf
          </span>
        </div>

        {/* Original Price (if used) */}
        <div className="w-full flex items-center justify-end pb-2">
          {product.originalPrice && (
            <div className="text-sm text-red-500 line-through">
              {product.originalPrice.toLocaleString()} Rwf
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-2 left-0 right-0">
        <div className="flex justify-center mt-4 items-center">
          <Button className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200  px-6 py-3 rounded-full text-blue-950 font-bold hover:bg-gradient-to-r hover:from-white hover:to-blue-200 transition-all">
            Shop now
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
