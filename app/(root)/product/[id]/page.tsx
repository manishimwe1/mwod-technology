"use client";

import Loading from "@/components/Loading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { motion } from "motion/react";
import {
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Store,
  Truck,
  MessageCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LeftProductDetailsImage from "@/components/LeftProductDetailsImage";
import { ScrollArea } from "@/components/ui/scroll-area";

const ProductDetailPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const params = useParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const product = useQuery(
    api.product.getProduct,
    isClient && params.id ? { id: params.id as Id<"products"> } : "skip"
  );

  if (!isClient) return <Loading title="Loading..." />;
  if (product === undefined)
    return <Loading title="Fetching product details..." />;
  if (product === null)
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-foreground">
        Product not found or removed.
      </div>
    );

  const discountPercent = product.originalPrice
    ? (
        ((Number(product.originalPrice) - product.price) /
          Number(product.originalPrice)) *
        100
      ).toFixed(0)
    : null;

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment" && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LeftProductDetailsImage product={product} />
          </motion.div>

          {/* Right Column: Product Details */}
          <ScrollArea className="lg:sticky h-screen pb-10 border px-2">
            <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col space-y-8"
          >
            {/* Title & Seller */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  New Arrival
                </Badge>
                {product.stock > 0 ? (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="fill-current w-4 h-4" />
                  <Star className="fill-current w-4 h-4" />
                  <Star className="fill-current w-4 h-4" />
                  <Star className="fill-current w-4 h-4" />
                  <Star className="w-4 h-4" />
                  <span className="text-foreground font-medium ml-1">4.8</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  <span className="font-medium hover:underline cursor-pointer underline-offset-4">
                    {product.createdByName}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  {product.price.toLocaleString()} <span className="text-2xl text-muted-foreground font-normal">RWF</span>
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through decoration-destructive/50">
                      {product.originalPrice.toLocaleString()} Rwf
                    </span>
                    <Badge variant="destructive" className="ml-2">
                      -{discountPercent}% OFF
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Includes all taxes and fees.
              </p>
            </div>

            {/* Description Short */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Actions */}
            <div className="space-y-6 pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-medium min-w-16">Quantity</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => handleQuantityChange("decrement")}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="h-10 w-12 flex items-center justify-center border-x font-medium">
                    {quantity}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => handleQuantityChange("increment")}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock} items available
                </span>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 text-base">
                  Add to Cart
                </Button>
                <Button
                  
                  variant="secondary"
                  className="flex-1 text-base bg-green-600 text-white hover:bg-green-700"
                  onClick={() => {
                    const message = `Hello, I am interested in buying ${product.name} for ${product.price.toLocaleString()} RWF.`;
                    const whatsappUrl = `https://wa.me/250783805516?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Buy on WhatsApp
                </Button>
                <Button size="lg" variant="outline" className="h-12 w-12 p-0">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Information Accordion */}
            <div className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details">
                  <AccordionTrigger>Product Details</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>{product.description}</p>
                      {/* Placeholder for more detailed specs if available */}
                      <ul className="list-disc pl-4 mt-2 space-y-1">
                        <li>Premium quality materials</li>
                        <li>Verified authentic product</li>
                        <li>Direct from manufacturer</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      <span>Shipping & Delivery</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>Free standard shipping on orders over 50,000 RWF.</p>
                      <p>Estimated delivery: 3-5 business days.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="warranty">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Warranty & Returns</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>30-day money-back guarantee if the product doesn't match the description.</p>
                      <p>1 year standard manufacturer warranty included.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="p-2 bg-background rounded-full shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold">Secure Payment</p>
                  <p className="text-muted-foreground">100% Protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                <div className="p-2 bg-background rounded-full shadow-sm">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold">Quality Checked</p>
                  <p className="text-muted-foreground">Original Product</p>
                </div>
              </div>
            </div>

          </motion.div>
          </ScrollArea>
          
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;