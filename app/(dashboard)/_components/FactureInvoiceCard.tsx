"use client";

import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface FactureInvoiceCardProps {
  facture: Doc<"facture">;
}

export const FactureInvoiceCard: React.FC<FactureInvoiceCardProps> = ({
  facture,
}) => {
  const handleExport = async () => {
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 10; // Initial Y position
    // const leftMargin = 15;
    const rightMargin = pageWidth - 15;
    // Header
    doc.setFontSize(16);
    doc.text("FACTURE N° " + (facture.factureNumber || ""), pageWidth / 2, y, {
      align: "center",
    });
    y += 10;

    doc.setFontSize(10);
    doc.text(`Client: ${facture.clientName}`, 10, y);
    doc.text(
      `Date: ${format(new Date(facture.date), "dd MMMM yyyy")}`,
      pageWidth - 10,
      y,
      { align: "right" }
    );
    y += 10;

    // Items Table
    const tableColumn = ["Quantité", "Libellé", "Prix unitaire", "Prix total"];
    const tableRows: any = [];

    facture.items.forEach((item) => {
      const itemData = [
        item.quantity,
        item.description,
        item.unitPrice.toFixed(2),
        item.totalPrice.toFixed(2),
      ];
      tableRows.push(itemData);
    });

    autoTable(doc, {
      startY: y + 5,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: "#3b82f6", // Blue color for header
        textColor: "#ffffff",
        fontStyle: "bold",
        halign: "center",
      },
      styles: {
        fontSize: 10,
        cellPadding: 2,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Quantity
        1: { cellWidth: 80, halign: "left" }, // Libellé
        2: { cellWidth: 40 }, // Prix unitaire
        3: { cellWidth: 40 }, // Prix total
      },
      didDrawPage: (data) => {
        y = data.cursor?.y || y; // Update y after table
      },
    });

    y = (doc as any).lastAutoTable.finalY + 10; // Get final Y position after table

    // Total Amount
    const totalAmount = facture.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    doc.setFontSize(12);
    doc.text(`Total: ${totalAmount.toFixed(2)} Rwf`, pageWidth - 10, y, {
      align: "right",
    });
    y += 20;

    const finalY = doc.lastAutoTable.finalY ?? y + 20;
    // Signature and Stamp (placeholders)
    doc.setFontSize(10);
    doc.text("Signature:", 10, y);
    // Thank you note
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    const thankYouText = `Thank you ${facture.clientName} for trusting EasyFix Tech. We truly appreciate your business!`;
    doc.text(thankYouText, pageWidth / 2, finalY + 70, { align: "center" });

    // Add stamp image with better positioning
    const signatureImg = await fetch("/sign.png")
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          })
      );

    // Position stamp to the right of the footer text
    doc.addImage(signatureImg, "PNG", rightMargin - 40, finalY + 20, 40, 40);
    const stampImg = await fetch("/stamp.png")
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          })
      );

    // Position stamp to the right of the footer text
    doc.addImage(stampImg, "PNG", rightMargin - 40, finalY + 20, 40, 40);

    doc.save(`Proforma_Invoice_${facture.clientName}.pdf`);

    doc.save(`facture-${facture.clientName}.pdf`);
  };

  return (
    <div className="relative p-6 border rounded-lg shadow-md bg-white">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleExport}
          className="cursor-pointer"
        >
          <Download className="h-4 w-4 " />
        </Button>
      </div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          FACTURE N° {facture.factureNumber}
        </h2>
        <p className="text-sm text-gray-500">
          Date: {format(new Date(facture.date), "dd MMMM yyyy")}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-md font-semibold">Client: {facture.clientName}</p>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                Quantité
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                Libellé
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                Prix unitaire
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                Prix total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {facture.items.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {item.description}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {item.unitPrice.toFixed(2)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {item.totalPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right text-lg font-bold text-gray-800 mb-6">
        Total:{" "}
        {facture.items
          .reduce((sum, item) => sum + item.totalPrice, 0)
          .toFixed(2)}{" "}
        Rwf
      </div>

      <div className="flex justify-between items-end mt-8">
        <div className="flex flex-col items-center mt-8 text-sm">
          <p className="font-bold mb-1">EASYFIX TECH LIMITED</p>
          <p>Managing Director : Baganineza Jean Bosco</p>

          <div className="mt-4 w-24 h-24 flex items-center justify-end">
            <Image
              src={"/stamp.png"}
              alt="Company Stamp"
              className="max-w-full max-h-full object-contain"
              width={150}
              height={150}
              priority
            />
          </div>
          <div className=" -mt-32 z-10 w-40 h-40 flex items-center justify-end">
            <Image
              src={"/sign.png"}
              alt="Company Stamp"
              className="max-w-full max-h-full object-contain"
              width={500}
              height={500}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};
