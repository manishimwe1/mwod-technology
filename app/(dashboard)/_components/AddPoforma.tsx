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
const AddPoforma = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add poforma</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          
        </DialogHeader>
        <ProformaInvoiceForm onClose={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddPoforma;
