"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { brands, categories } from "@/constants";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { productSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { Loader, Upload, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type ProductFormData = z.infer<typeof productSchema>;
export default function CreateProductPage() {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      price: 0,
      originalPrice: 0,
      stock: 0,
      serialNumber: "",
      images: [],
      status: "active",
      warranty: 0,
      condition: "Like New",
      badge: "NEW",
    },
  });

  const createProduct = useMutation(api.product.createProduct);
  const generateUploadUrl = useMutation(api.product.generateUploadUrl);
  const {data: session} = useSession();
  const [loading, setLoading] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);

  const user = useQuery(api.users.getUserByEmail,session ? {
    email: session?.user?.email || "",
  }:'skip')

  // if(!user?._id){
  //   return redirect('/login')
  // }
  // Image handling
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles((prev) => [...prev, ...acceptedFiles]);

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const preview = reader.result as string;
          setImagePreviews((prev) => [...prev, preview]);
        };
        reader.readAsDataURL(file);
      });

      // Update form with file names for validation
      const currentFiles = form.getValues("images") || [];
      const newFileNames = acceptedFiles.map((file) => file.name);
      form.setValue("images", [...currentFiles, ...newFileNames]);
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif", ".webp"],
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImageNames = newFiles.map((file) => file.name);

    setUploadedFiles(newFiles);
    setImagePreviews(newPreviews);
    form.setValue("images", newImageNames);
  };

  // Submit handler
  const onSubmit = async (data: ProductFormData) => {
    // console.log({ data });

    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one product image", {
        richColors: true,
      });
      return;
    }

    if (!user?._id) {
      toast.error("You must be logged in to create a product", {
        richColors: true,
      });
      return;
    }

    setLoading(true);

    try {
      // Upload images and get storage IDs
      const imageUrls: Id<"_storage">[] = [];

      for (const file of uploadedFiles) {
        try {
          const uploadUrl = await generateUploadUrl();

          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });

          if (!result.ok) {
            console.error("Image upload failed:", await result.text());
            continue;
          }

          const { storageId } = await result.json();
          imageUrls.push(storageId);
        } catch (err) {
          console.error("Image upload failed for file:", file.name, err);
        }
      }

      if (imageUrls.length === 0) {
        toast.error("Failed to upload images", { richColors: true });
        return;
      }

      // Create product with uploaded image URLs
      await createProduct({
        brand: data.brand,
        category: data.category,
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice,
        stock: data.stock,
        serialNumber: data.serialNumber,
        images: imageUrls, // Use storage IDs instead of file names
        status: data.status,
        updatedAt: new Date().toISOString(),
        createdBy: user._id,
        warranty: data.warranty,
        condition: data.condition,
        badge: data.badge,
      });

      toast.success("Product created successfully!", { richColors: true });
      form.reset();
      setUploadedFiles([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error creating product", { richColors: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log("❌ Validation errors:", errors);
              })}
              className="space-y-6"
            >
              <div className="">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter detailed product description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between gap-4">
                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Brand */}
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Brand *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Serial Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="Product serial number" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Original Price */}
                <FormField
                  control={form.control}
                  name="originalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Original Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>Current selling price</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* discount Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>Current discount price</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Stock */}
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>Current stock quantity</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Images */}
              <div className="space-y-3">
                <FormLabel>Product Images *</FormLabel>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed p-6 text-center cursor-pointer rounded-lg transition-colors ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  {isDragActive ? (
                    <p className="text-blue-600">Drop the images here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">
                        Drag and drop product images here, or click to select
                        files
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF up to 5MB each
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
                          {uploadedFiles[index]?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {form.formState.errors.images && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.images.message}
                  </p>
                )}
              </div>

              {/* Status + Flags */}
              <div className="flex items-center justify-end w-full gap-4">
                {/* Condition */}
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Condition *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Like New">Like New</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Used">Used</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                  control={form.control}
                  name="warranty"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Warranty in month</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="badge"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Badge</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="NEW">NEW</SelectItem>
                          <SelectItem value="HOT">HOT</SelectItem>
                          <SelectItem value="SALE">SALE</SelectItem>
                          <SelectItem value="Deals">Deals</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader className="h-5 w-5 animate-spin" />
                      <span className="ml-2">Creating Product...</span>
                    </div>
                  ) : (
                    "Create Product"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setUploadedFiles([]);
                    setImagePreviews([]);
                  }}
                  disabled={loading}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
