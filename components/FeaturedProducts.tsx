import {
  Card,
  CardContent,
} from "@/components/ui/card";
import React from "react";
import { Heart } from "lucide-react";
import { getProductData } from "@/sanity/getData";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default async function FeaturedProducts() {
  const product = await getProductData()
  console.log(product,'product');
  if(!product) return null
  return (
    <section className="py-12 container mx-auto px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Collection Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {product.map((item) => (
          <Link
            href={`/product-detail/${item.slug.current}`}
            key={item._id}
          >
          <Card
            className="bg-white text-black rounded-2xl p-3 relative flex flex-col shadow hover:shadow-lg transition min-h-[290px] py-6 group cursor-pointer"
          >
            {/* Heart icon */}
            <button className="absolute top-3 right-4 z-10 p-1 rounded-full bg-black/40 hover:bg-black/70">
              <Heart className="w-5 h-5 text-white" fill="white" strokeWidth={1.5} />
            </button>
            <CardContent className="flex flex-col items-start p-0 justify-center">
              <Image
                height={120}
                width={500}
                src={item.imageUrl ?? ''}
                alt={item.title}
                className="w-full h-[200px] object-contain rounded-t-xl mb-2 bg-white"
              />
              <div className=" w-full overflow-hidden p-2">
              <h3 className="font-semibold text-sm truncate mb-1 mt-1 leading-tight line-clamp-1">
                {item.title}
              </h3>
              <span className="text-xs text-neutral-600 py-1 line-clamp-2">{item.description}</span>
              <div className="text-2xl line-clamp-3 font-extrabold py-3 text-end">{item.price?.toLocaleString()} <span className="text-sm font-normal">rwf</span></div>
             <Button className="bg-[hsl(201,100%,36%)] w-full group-hover:bg-[#0077b6] cursor-pointer">Add to cart</Button>
              </div>
            </CardContent>
          </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
