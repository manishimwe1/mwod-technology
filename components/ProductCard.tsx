import { Star, StarHalf } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

interface ProductCardType {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
}

const ProductCard = ({
  image,
  title,
  price,
  originalPrice,
  rating,
  reviewCount,
  isNew = true,
}: ProductCardType) => {
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
    <div className="bg-white rounded-lg shadow-sm shadow-blue-100 cursor-pointer border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200 group relative">
      {/* Product Image */}
      <div className="aspect-square w-full mb-4 relative rounded-lg overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {isNew && (
        <span className="absolute top-2 right-2 bg-blue-500 text-sm font-medium text-gray-900 px-2 rounded-full">
          New
        </span>
      )}

      <div className="flex flex-col pb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-5">
          {title}
        </h3>

        {/* Rating */}
        <div className="mb-3">{renderStars(rating, reviewCount)}</div>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-gray-900">
            {price.toLocaleString()} Rwf
          </span>
        </div>

        {/* Original Price (if used) */}
        <div className="w-full flex items-center justify-end pb-2">
          {originalPrice && (
            <div className="text-sm text-red-500 line-through">
              {originalPrice.toLocaleString()} Rwf
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-2 left-0 right-0">
        <div className="flex justify-center mt-4 items-center">
          <Button className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 border border-gray-200 px-6 py-3 rounded-full text-blue-950 font-bold hover:bg-gradient-to-r hover:from-white hover:to-blue-200 transition-all">
            Shop now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
