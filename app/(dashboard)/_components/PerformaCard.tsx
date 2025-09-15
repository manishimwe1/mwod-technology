"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceActions } from "./InvoiceActions";
import Image from "next/image";
import { Doc } from "@/convex/_generated/dataModel";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ProformaInvoiceCard({ invoice }: { invoice: Doc<"invoice"> }) {
  const handleExport = async (invoice: Doc<"invoice">) => {
  const pdf = new jsPDF("p", "mm", "a4");

  const leftMargin = 15;
  let y = 20;

  // Header
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("EASYFIX TECH", leftMargin, y);
  y += 6;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  pdf.text("NYARUNGENGE", leftMargin, y);
  y += 5;
  pdf.text("KIGALI-RWANDA", leftMargin, y);
  y += 5;
  pdf.text("PHONE: 0783805516", leftMargin, y);
  y += 5;
  pdf.text("TIN: 128218272", leftMargin, y);

  // Right-side invoice info
  y = 20;
  pdf.setFont("helvetica", "bold");
  pdf.text("PROFORMA INVOICE", 150, y, { align: "right" });
  y += 6;
  pdf.setFont("helvetica", "normal");
  pdf.text(`Client: ${invoice.clientName}`, 150, y, { align: "right" });
  y += 5;
  if (invoice.clientPhone) {
    pdf.text(`TEL: ${invoice.clientPhone}`, 150, y, { align: "right" });
    y += 5;
  }
  pdf.text(`Balance due: ${invoice.totalAmount} Rwf`, 150, y, {
    align: "right",
  });
  y += 5;
  pdf.text(
    `Date: ${new Date(invoice._creationTime).toLocaleDateString()}`,
    150,
    y,
    { align: "right" }
  );

  y += 10;

  // Items table
  const tableColumn = ["Qty", "Description", "U.Price", "T.Price"];
  const items = JSON.parse(JSON.stringify(invoice.items ?? []));
  const tableRows = items.map((item: any) => [
    String(item.quantity ?? 0),
    item.description ?? "",
    (item.unitPrice ?? 0).toLocaleString(),
    ((item.quantity ?? 0) * (item.unitPrice ?? 0)).toLocaleString(),
  ]);

  autoTable(pdf, {
    startY: y,
    head: [tableColumn],
    body: tableRows,
    headStyles: { fillColor: [41, 128, 185], textColor: 'white' },
    styles: { fontSize: 10 },
  });

  // Total amount
 
  const finalY = pdf.lastAutoTable.finalY ?? y + 20;
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `TOTAL: ${invoice.totalAmount?.toLocaleString() ?? 0} Rwf`,
    150,
    finalY + 10,
    { align: "right" }
  );

  // Footer text
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("EASYFIX TECH LIMITED", leftMargin, finalY + 25);
  pdf.text("Managing Director: Baganineza Jean Bosco", leftMargin, finalY + 30);

  // Thank you note
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(11);
  pdf.text(
    `Thank you ${invoice.clientName} for trusting EasyFix Tech. We truly appreciate your business!`,
    105,
    finalY + 70,
    { align: "center" }
  );

  // ✅ Add stamp image
  const stampImg = await fetch("/stamp.png") // path in public/
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        })
    );

  pdf.addImage(stampImg, "PNG", 150, finalY + 20, 40, 40);

  pdf.save(`Proforma_Invoice_${invoice.clientName}.pdf`);
};


  return (
    <Card className="max-w-4xl mx-auto shadow-lg border border-gray-200 p-6">
      <CardHeader className="flex flex-row justify-between items-start p-0 mb-4">
        <div className="flex flex-col text-sm">
          <CardTitle className="text-base font-bold mb-1">
            <p>EASYFIX TECH</p>
            <p>NYARUNGENGE</p>
            <p>KIGALI-RWANDA</p>
            <p>PHONE: 0783805516</p>
            <p>TIN: 128218272</p>
          </CardTitle>
        </div>
        <div className="flex flex-col text-sm text-right">
          <CardTitle className="text-base font-bold mb-1">
            PROFORMA INVOICE
          </CardTitle>
          <p>Client: {invoice.clientName}</p>
          {invoice.clientPhone && <p>TEL: {invoice.clientPhone}</p>}
          <p>Balance due</p>
          <p>{invoice.totalAmount} Rwf</p>
          <p>Date: {new Date(invoice._creationTime).toLocaleDateString()}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
        {/* Items Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="px-4 py-2 border border-gray-300 w-1/12">Qty</th>
                <th className="px-4 py-2 border border-gray-300 w-6/12">
                  Details
                </th>
                <th className="px-4 py-2 border border-gray-300 w-2/12">
                  U.Price
                </th>
                <th className="px-4 py-2 border border-gray-300 w-3/12">
                  T.Price
                </th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items ?? []).map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 text-sm">
                  <td className="px-4 py-2 border border-gray-300">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {item.description}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {item.unitPrice}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {(item.quantity ?? 0) * (item.unitPrice ?? 0)}
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
                  {invoice.totalAmount}
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
        </div>

        <div className="w-full flex justify-end">
          <InvoiceActions invoice={invoice} handleExport={() => handleExport(invoice)} />

        </div>
      </CardContent>
    </Card>
  );
}
