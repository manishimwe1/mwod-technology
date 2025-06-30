import React from "react";
import { getProductBySlug } from "@/sanity/getData";
import { BlockContent } from "@/components/BlockContent";

interface ProductPageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const decodedSlug = decodeURIComponent(params.slug);
  const product = await getProductBySlug(decodedSlug);

  console.log(product, "product");

  return (
    <div className="px-10 p-4 space-y-4">
      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm">
        Home&gt; Electronics &gt; Laptops and Computers &gt; Notebooks &gt;
        Lenovo
      </nav>

      <h1 className="text-xl md:text-2xl capitalize font-extrabold tracking-widest text-blue-950 max-w-3xl leading-tight py-4 md:py-8 ">
        {product?.title}
      </h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="w-full overflow-x-hidden">
          <BlockContent
            content={product?.body}
            title={product?.title ?? ''}
            description={product?.description ?? ''}
            price={product?.price ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
