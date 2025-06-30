import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "./ui/scroll-area";
import { ProductType } from "@/typeing";
import SmilarComponent from "./SmilarComponent";

// Helper to extract all images from PortableText content
function extractImages(content: any[]): any[] {
  return content.filter(
    (block) => block._type === "image" && block.asset?._ref
  );
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold my-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold my-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold my-2">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-base text-gray-700 my-2">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 my-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 my-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-1">{children}</li>,
    number: ({ children }) => <li className="mb-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-black">{children}</strong>
    ),
    em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-blue-600 underline hover:text-blue-800"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  // You can add more custom renderers for types, code, etc.
};

export const BlockContent = ({
  content,
  title,
  description,
  price,
  similar,
}: {
  content: any;
  title: string;
  description: string;
  price:number,
  similar:ProductType[]
}) => {
  const images = extractImages(content || []);
  return (
    <div className="flex items-start h-full justify-between md:gap-10 overflow-x-hidden flex-col">
      <div className="flex flex-col md:flex-row w-full h-fit md:h-full items-start md:items-center justify-between gap-4 md:gap-10">
        {images.length > 1 && (
          <div className=" w-full md:w-[60%] flex-shrink-0 h-full ">
            <Carousel className="w-full  mx-auto">
              <CarouselContent>
                {images.map((img, idx) => (
                  <CarouselItem key={img.asset._ref || idx}>
                    <div className="flex flex-col rounded-xl">
                      <Image
                        src={urlFor(img).url()}
                        alt={img.alt || `Product image ${idx + 1}`}
                        width={800}
                        height={500}
                        className="rounded-lg lg:rounded-xl bg-white"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-[#023e8a] text-white ring-blue-700 border-blue-600 cursor-pointer hover:bg-blue-500" />
              <CarouselNext className="bg-[#023e8a] text-white ring-blue-700 border-blue-600 cursor-pointer hover:bg-blue-500" />
            </Carousel>
          </div>
        )}
        <div className="w-full md:w-[40%] h-full">
          <div className="flex-1 space-y-4">
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-3xl  font-bold text-gray-800 text-end pr-5">{price.toLocaleString()} <span className="text-sm font-normal">rwf</span></p>

            {/* Seller info */}
            <div className="grid grid-cols-2 w-full gap-2 px-4">
              <CustomerReview />
              <CustomerReview />
            </div>

            <div className="text-sm text-gray-600 line-clamp-6">
              {description}
            </div>

            {/* Actions */}
            <div className="flex gap-4 w-full">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                Write
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full">
                Call
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full px-4 h-full items-start justify-between gap-10 mt-10 md:mt-0">
        <div className="w-full ">

        <PortableText components={portableTextComponents} value={content} />
        </div>
        <div className="w-[30%] h-full hidden md:flex">
          <SmilarComponent similar={similar}/>

        </div>
      </div>
    </div>
  );
};

function CustomerReview() {
  return (
    <div className="flex items-center space-x-3 bg-blue-50 rounded-md p-2">
      <img
        src="/convex.svg" // placeholder or seller avatar
        alt="Seller avatar"
        className="w-6 h-6 rounded-full"
      />
      <div>
        <p className="text-stone-500 text-sm capitalize line-clamp-2">this is the best laptop ever</p>
      </div>
    </div>
  );
}
