"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProformaInvoiceForm } from "./PoformaForm";
import { FactureInvoiceForm } from "./FactureInvoiceForm";
import SellForm from "@/components/SellForm";

const AddNewItemBtn = ({ title }: { title: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">{title}</Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-2xl">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        {title === "Add Facture" && <FactureInvoiceForm onClose={setIsOpen} />}
        {title === "Add Poforma" && <ProformaInvoiceForm onClose={setIsOpen} />}
        {title === "Add Selling Product" && <SellForm />}
      </DialogContent>
    </Dialog>
  );
};

export default AddNewItemBtn;
