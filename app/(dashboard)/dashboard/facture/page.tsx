'use client'

import React from "react";
import AddNewItemBtn from "../../_components/AddNewItemBtn";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { FactureInvoiceCard } from "../../_components/FactureInvoiceCard";

const FacturePage = () => {
  const fetchedFactures = useQuery(api.facture.getFactures);

  if (!fetchedFactures)
    return (
      <div className="flex items-center justify-center flex-col h-screen w-full">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <span className="mt-2 text-lg text-gray-600">Loading Factures...</span>
      </div>
    );

  return (
    <div className="flex flex-col items-start w-full h-full p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Facture Invoices</h1>
        <AddNewItemBtn title="Add Facture" />
      </div>
      <div className="w-full max-w-6xl mx-auto">
        {fetchedFactures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner">
            <p className="text-xl text-gray-500">No facture invoices yet!</p>
            <p className="text-md text-gray-400 mt-2">
              Start by adding a new facture invoice.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fetchedFactures.map((facture) => (
              <FactureInvoiceCard key={facture._id} facture={facture} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacturePage;
