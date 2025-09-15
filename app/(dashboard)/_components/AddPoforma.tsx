import React from "react";
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add poforma</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          
        </DialogHeader>
        <ProformaInvoiceForm/>
      </DialogContent>
    </Dialog>
  );
};

export default AddPoforma;
