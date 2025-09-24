"use client";
import { Doc } from "@/convex/_generated/dataModel";
import React, { Dispatch, SetStateAction, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Loader, PlusCircle, Trash2 } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function FactureInvoiceForm({
  onClose,
  invoice,
}: {
  onClose: Dispatch<SetStateAction<boolean>>;
  invoice?: Doc<"facture">;
}) {
  const createFacture = useMutation(api.facture.createFacture);
  const updateFacture = useMutation(api.facture.updateFacture);
  const getFacture = useQuery(api.facture.getFactures);
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: invoice?.clientName || "",
      invoiceNumber: invoice?.factureNumber || 0,
      items: invoice?.items.map((item) => ({
        quantity: item.quantity,
        description: item.description,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Function to calculate total price for an item
  const calculateTotalPrice = (index: number) => {
    const quantity = form.getValues(`items.${index}.quantity`);
    const unitPrice = form.getValues(`items.${index}.unitPrice`);
    const total = quantity * unitPrice;
    form.setValue(`items.${index}.totalPrice`, total);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const totalAmount = values.items.reduce(
      (acc, item) => acc + Number(item.totalPrice),
      0
    );
    setLoading(true)
    try {
      if (invoice) {
        await updateFacture({
          id: invoice._id,
          fields: {
            clientName: values.clientName,
            date: values.date.getTime(),
            items: values.items,
            status: "draft",
            totalAmount,
          },
        });
        toast.success("Invoice updated successfully!", { richColors: true });
      } else {
        await createFacture({
          clientName: values.clientName,
          date: values.date.getTime(),
          items: values.items,
          status: "draft",
          totalAmount,
          factureNumber: getFacture ? getFacture.length + 1 : 1,
        });
        toast.success("Invoice created successfully!", { richColors: true });
      }
      onClose(false);
    } catch (error) {
      console.error("Failed to save invoice:", error);
      toast.error("Failed to save invoice.", { richColors: true });
    }finally{
      setLoading(false)
    }
  }

  return (
    <ScrollArea className="h-[80vh] w-full max-w-4xl mx-auto p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Select a Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left bg-indigo-50/30 overflow-hidden cursor-pointer",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(new Date(field.value), "dd MMMM yyyy") // Changed format here
                          : "Pick a month"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <h3 className="mb-4 text-lg font-medium">Items</h3>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border rounded-md"
              >
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            calculateTotalPrice(index);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Item description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.unitPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            calculateTotalPrice(index);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.totalPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Price</FormLabel>
                      <FormControl>
                        <Input type="number" readOnly {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  className="mt-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  quantity: 1,
                  description: "",
                  unitPrice: 0,
                  totalPrice: 0,
                })
              }
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>

          <Button type="submit" className="w-full">
            {loading ? (
              <>
                <Loader className="mr-2 h-5 w-5 animate-spin"/>
                <span>{invoice ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <span>{invoice ? "Update Invoice" : "Create Invoice"}</span>
            )}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
