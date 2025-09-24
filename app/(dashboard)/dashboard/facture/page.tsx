'use client'

import React from "react";
import AddNewItemBtn from "../../_components/AddNewItemBtn";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { FactureInvoiceCard } from "../../_components/FactureInvoiceCard";
import { Input } from "@/components/ui/input"; // Import Input component
import { useState } from "react"; // Import useState

const FacturePage = () => {
  const fetchedFactures = useQuery(api.facture.getFactures);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  if (!fetchedFactures)
    return (
      <div className="flex items-center justify-center flex-col h-screen w-full">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <span className="mt-2 text-lg text-gray-600">Loading Factures...</span>
      </div>
    );

  // Filter invoices based on search query
  const filteredFactures = fetchedFactures.filter((facture) =>
    facture.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-start w-full h-full p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Facture Invoices</h1>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search by client name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <AddNewItemBtn title="Add Facture" />
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto">
        {filteredFactures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-inner">
            <p className="text-xl text-gray-500">No facture invoices yet!</p>
            <p className="text-md text-gray-400 mt-2">
              Start by adding a new facture invoice or adjust your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredFactures.map((facture) => (
              <FactureInvoiceCard key={facture._id} facture={facture} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacturePage;
