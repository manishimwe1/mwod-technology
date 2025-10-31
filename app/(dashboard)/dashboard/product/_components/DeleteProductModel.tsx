import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const DeleteProductModel = ({
  isOpen,
  onClose,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  product: Doc<"products">;
}) => {
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [countdown, setCountdown] = useState(5);
    
    const deleteProduct = useMutation(api.product.deleteProduct)
    const handleDelete = async()=>{
        setIsDeleting(true);
        setCountdown(5);
        
        const toastId = toast.info(`Product will be deleted in ${countdown} seconds.`, {
            action: {
                label: "Cancel",
                onClick: () => handleCancelDelete(),
            },
            duration: 5000,
            id: "delete-toast",
        });

        const newIntervalId = setInterval(() => {
            setCountdown((prev) => {
                const newCount = prev - 1;
                if (newCount > 0) {
                    toast.info(`Product will be deleted in ${newCount} seconds.`, {
                        action: {
                            label: "Cancel",
                            onClick: () => handleCancelDelete(),
                        },
                        duration: 5000,
                        id: "delete-toast",
                    });
                }
                return newCount;
            });
        }, 1000);
        setIntervalId(newIntervalId);

        const newTimeoutId = setTimeout(async () => {
            clearInterval(newIntervalId);
            await deleteProduct({id: product._id });
            toast.success("Product deleted successfully!");
            setIsDeleting(false);
            onClose();
        }, 5000);
        setTimeoutId(newTimeoutId);
    }

    const handleCancelDelete = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        setIsDeleting(false);
        toast.dismiss("delete-toast");
        toast.info("Product deletion cancelled.");
    };

    useEffect(() => {
        if (!isOpen && (timeoutId || intervalId)) {
            handleCancelDelete();
        }
    }, [isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            product and remove all associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
          <Button variant="destructive" className="cursor-pointer" onClick={handleDelete} disabled={isDeleting} >{isDeleting ? `Deleting in ${countdown}s...` : "Continue"} 
            
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductModel;
