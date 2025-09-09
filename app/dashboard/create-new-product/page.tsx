"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Loader } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { productSchema } from "@/lib/validation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStoreUserEffect } from "@/lib/hooks/useStoreUserEffect";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { brands, categories } from "@/constants";

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
      currency: "Rwf",
      stock: 0,
      sku: "",
      rating: 0,
      reviewCount: 0,
      isNew: false,
      isOnSale: false,
      specifications: [],
      tags: [],
      images: [],
      status: "draft",
      warranty: 0,
    },
  });

  const createProduct = useMutation(api.product.createProduct);
  const generateUploadUrl = useMutation(api.product.generateUploadUrl);
  const { userId } = useStoreUserEffect();

  const [specifications, setSpecifications] = React.useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);

  // Specification logic
  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = specifications.map((spec, i) =>
      i === index ? { ...spec, [field]: value } : spec
    );
    setSpecifications(updated);
    form.setValue(
      "specifications",
      updated.filter((spec) => spec.key && spec.value)
    );
  };

  // Tags
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };

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

    if (!userId) {
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
        currency: data.currency,
        stock: data.stock,
        sku: data.sku,
        rating: data.rating,
        reviewCount: data.reviewCount,
        isNew: data.isNew,
        isOnSale: data.isOnSale,
        specifications: data.specifications,
        tags: data.tags,
        images: imageUrls, // Use storage IDs instead of file names
        status: data.status,
        updatedAt: new Date().toISOString(),
        createdBy: userId,
        warranty: data.warranty,

      });

      toast.success("Product created successfully!", { richColors: true });
      form.reset();
      setUploadedFiles([]);
      setImagePreviews([]);
      setTags([]);
      setSpecifications([{ key: "", value: "" }]);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error creating product", { richColors: true });
    } finally {
      setLoading(false);
    }
  };

  // SKU Generator
  const generateSKU = () => {
    const brand = form.getValues("brand");
    const category = form.getValues("category");
    const timestamp = Date.now().toString().slice(-6);

    if (brand && category) {
      const sku = `${brand.substring(0, 3).toUpperCase()}-${category
        .substring(0, 3)
        .toUpperCase()}-${timestamp}`;
      form.setValue("sku", sku);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {/* Brand */}
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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

              {/* Category + SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                {/* SKU */}
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU *</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="Product SKU" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateSKU}
                          className="px-3"
                        >
                          Generate
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Price *</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <FormDescription>For sale items</FormDescription>
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

              {/* Tags */}
              <div className=" flex items-start justify-between gap-5">
                <div className="w-full flex flex-col gap-2">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="warranty"
                  render={({ field }) => (
                    <FormItem>
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
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <FormLabel>Product Specifications</FormLabel>
                {specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                  >
                    <Input
                      placeholder="Specification name (e.g., Storage)"
                      value={spec.key}
                      onChange={(e) =>
                        updateSpecification(index, "key", e.target.value)
                      }
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Value (e.g., 1TB SSD)"
                        value={spec.value}
                        onChange={(e) =>
                          updateSpecification(index, "value", e.target.value)
                        }
                      />
                      {specifications.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeSpecification(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSpecification}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </div>

              {/* Status + Flags */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                {/* isNew */}
                <FormField
                  control={form.control}
                  name="isNew"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">New Product</FormLabel>
                        <FormDescription>Mark as new arrival</FormDescription>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* isOnSale */}
                <FormField
                  control={form.control}
                  name="isOnSale"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">On Sale</FormLabel>
                        <FormDescription>Mark as sale item</FormDescription>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={loading}>
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
                    setTags([]);
                    setSpecifications([{ key: "", value: "" }]);
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
