"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const HeroCarousel = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false }) // 4s interval
  );

  const carouselItemClasses =
    "relative w-full max-w-[500px] h-[250px] md:h-[350px] rounded-lg overflow-hidden";

  return (
    <div className="w-full h-full relative">
      <Carousel
        className="w-full h-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
      >
        {/* gap-4 gives space between items */}
        <CarouselContent className="w-full h-full gap-4">
          <CarouselItem className={carouselItemClasses}>
            <Image
              src="/hero1.jpg"
              alt="Featured electronics and tech deals"
              fill
              className=" object-contain object-center md:object-cover"
              priority
            />
          </CarouselItem>

          <CarouselItem className={carouselItemClasses}>
            <Image
              src="/hero2.png"
              alt="Latest smartphone and mobile device offers"
              fill
              className=" object-contain object-center md:object-cover"
              priority
            />
          </CarouselItem>

          <CarouselItem className={carouselItemClasses}>
            <Image
              src="/hero3.jpg"
              alt="Premium audio and accessories collection"
              fill
              className=" object-contain object-center md:object-cover"
              priority
            />
          </CarouselItem>
        </CarouselContent>

        {/* Navigation buttons */}
        <CarouselPrevious className="hidden sm:flex -left-12 lg:-left-16" />
        <CarouselNext className="hidden sm:flex -right-12 lg:-right-16" />
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
