"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Eye, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  title: string;
  image: string;
  listings: number;
  sellers: number;
  gradient?: string;
  slug:string;
};

const CategoryCard = ({
  title,
  image,
  listings,
  sellers,
  gradient,
  slug
}: CategoryCardProps) => {
  return (
    <Link href={`/product?category=${slug}`}>
      <Card
        className={cn(
          "rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden",
          gradient
        )}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {/* Image */}
          <div className={`w-40 h-40 relative rounded-lg mb-6`}>
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain p-4"
            />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between gap-2 w-full text-sm text-gray-700">
            <div className="flex items-center gap-2 justify-center">
              <List className="w-4 h-4 text-blue-600" />
              <span className="text-nowrap">
                <strong>{listings.toLocaleString()}</strong> approved
              </span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-nowrap">
                <strong>{sellers.toLocaleString()}</strong> Viewed
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function CategoryGrid() {
  const categories = [
    {
      title: "Phones + iPhones",
      image: "/phone.png",
      listings: 14861,
      sellers: 1422,
      slug:'phones+iphones',
      gradient: "bg-gradient-to-b from-white via-blue-50 to-blue-100",
    },
    {
      title: "MacBooks + Laptops",
      image: "/laptops.png",
      listings: 920,
      sellers: 408,
      slug:'computers & laptops',
      gradient: "bg-gradient-to-b from-white via-purple-50 to-purple-100",
    },
    {
      title: "Watches + Accessories",
      image: "/watch.png",
      listings: 1274,
      sellers: 264,
      slug:'watches+accessories',
      gradient: "bg-gradient-to-b from-white via-pink-50 to-pink-100",
    },
  ];

  return (
    <section className="py-12 px-4">
      <h2 className="text-center text-2xl font-bold mb-10 text-blue-900">
        Buy <span className="text-black">+</span> Save
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {categories.map((cat) => (
          <CategoryCard key={cat.title} {...cat} />
        ))}
      </div>
    </section>
  );
}
