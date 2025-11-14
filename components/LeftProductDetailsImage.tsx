import { Doc } from "@/convex/_generated/dataModel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ZoomImage from "@/components/ZoomImage";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";


const LeftProductDetailsImage = ({ product }: { product: Doc<"products"> }) => {
     const plugin = useRef(Autoplay({ delay: 600000, stopOnInteraction: false }));
     console.log({product});
     
  return (
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
                  className="object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-blue-50 rounded-full shadow-md p-2 text-gray-800 hover:text-blue-600 transition-all" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-blue-50 rounded-full shadow-md p-2 text-gray-800 hover:text-blue-600 transition-all" />
        </Carousel>
      </div>
    </div>
  );
};

export default LeftProductDetailsImage;
