"use client";

import { Doc } from "@/convex/_generated/dataModel";
import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceActions } from "./InvoiceActions";

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
    const leftMargin = 15;
    const rightMargin = pageWidth - 15;
    let y = 20; // Initial Y position for content

    // Company Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("EASYFIX TECH", leftMargin, y);
    y += 6;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("NYARUNGENGE", leftMargin, y);
    y += 5;
    doc.text("KIGALI-RWANDA", leftMargin, y);
    y += 5;
    doc.text("PHONE: 0783805516", leftMargin, y);
    y += 5;
    doc.text("TIN: 128218272", leftMargin, y);
    y += 5;
    doc.text("Email: baganinezajb@gmail.com", leftMargin, y);
    y += 5;
    doc.text("Equity bank: 4002201284211", leftMargin, y);
    y += 5;
    doc.text("Equity USD: 4002201284215", leftMargin, y);

    // Facture Number and Date (moved to right side, adjusted Y)
    let rightY = 20; // Separate Y coordinate for right-side content
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("FACTURE N° " + (facture.factureNumber || ""), rightMargin, rightY, {
      align: "right",
    });
    rightY += 6;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Date: ${format(new Date(facture.date), "dd MMMM yyyy")}`,
      rightMargin,
      rightY,
      { align: "right" }
    );
    rightY += 5;
    doc.text(`Client: ${facture.clientName}`, rightMargin, rightY, {
      align: "right",
    });
    rightY += 5;
    if (facture.phone) {
      doc.text(`TEL: ${facture.phone}`, rightMargin, rightY, {
        align: "right",
      });
      rightY += 5;
    }
    // if (facture.clientTIN) {
    //   doc.text(`TIN: ${facture.clientTIN}`, rightMargin, rightY, {
    //     align: "right",
    //   });
    //   rightY += 5;
    // }

    // Use the maximum Y position from both left and right sides
    y = Math.max(y, rightY);
    y += 25; // Increased spacing before table

    // Items Table
    const tableColumn = ["Quantité", "Libellé", "Prix unitaire", "Prix total"];
    const tableRows: any = [];

    facture.items.forEach((item) => {
      const itemData = [
        item.quantity,
        item.description,
        item.unitPrice.toLocaleString(),
        item.totalPrice.toLocaleString(),
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
    doc.text(`Total: ${totalAmount.toLocaleString()} Rwf`, rightMargin, y, {
      align: "right",
    });
    y += 20;

    //@ts-ignore
    const finalY = doc.lastAutoTable.finalY ?? y + 20;
    // Signature and Stamp (placeholders)
    doc.setFontSize(10);
    doc.text("EASYFIX TECH LIMITED", leftMargin, finalY + 25);
    doc.text(
      "Managing Director: Baganineza Jean Bosco",
      leftMargin,
      finalY + 30
    );
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

    doc.save(`facture-${facture.clientName}.pdf`);
  };

  return (
    <Card className="w-full mx-auto shadow-lg border border-gray-200 p-6">
      <CardHeader className="flex flex-row justify-between items-start p-0 mb-4">
        <div className="flex flex-col text-sm">
          <CardTitle className="flex items-start gap-2 flex-col">
            <p>EASYFIX TECH</p>
            <p>NYARUNGENGE</p>
            <p>KIGALI-RWANDA</p>
            <p>PHONE: 0783805516</p>
            <p>Email: baganinezajb@gmail.com</p>
            <p>TIN: 128218272</p>
            <p>Equity bank: 4002201284211</p>
            <p>Equity USD: 4002201284215</p>
          </CardTitle>
        </div>
        <div className="flex flex-col text-sm text-right">
          <CardTitle className="text-base font-bold mb-1">
            FACTURE N° {facture.factureNumber}
          </CardTitle>
          <p>Client: {facture.clientName}</p>
          {facture.phone && <p>TEL: {facture.phone}</p>}
          {/* {facture.clientTIN && <p>TIN: {facture.clientTIN}</p>} */}
          <p>Date: {format(new Date(facture.date), "dd MMMM yyyy")}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
        {/* Items Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-500 text-white text-left text-sm">
                <th className="px-4 py-2 border border-gray-300 w-1/12">Quantité</th>
                <th className="px-4 py-2 border border-gray-300 w-6/12">
                  Libellé
                </th>
                <th className="px-4 py-2 border border-gray-300 w-2/12">
                  Prix unitaire
                </th>
                <th className="px-4 py-2 border border-gray-300 w-3/12">
                  Prix total
                </th>
              </tr>
            </thead>
            <tbody>
              {facture.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 text-sm">
                  <td className="px-4 py-2 border border-gray-300">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {item.description}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {item.unitPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {item.totalPrice.toLocaleString()} Rfw
                  </td>
                </tr>
              ))}
              <tr className="font-bold text-sm">
                <td
                  colSpan={3}
                  className="px-4 py-2 border border-gray-300 text-right"
                >
                  TOTAL
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {facture.items
                    .reduce((sum, item) => sum + item.totalPrice, 0)
                    .toLocaleString()} Rfw
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
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

        <div className="w-full flex justify-end">
          <InvoiceActions
            facture={facture}
            handleExport={() => handleExport()}
          />
        </div>
      </CardContent>
    </Card>
  );
};
