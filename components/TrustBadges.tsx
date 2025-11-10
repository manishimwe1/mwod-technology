import { Lock, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import React from "react";

const TrustBadges = () => {
  return (
    <section className="bg-gray-50 py-8 border-y">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: "Verified Sellers",
              desc: "All sellers verified",
            },
            { icon: Truck, title: "Fast Delivery", desc: "Same day in Kigali" },
            {
              icon: RotateCcw,
              title: "7-Day Returns",
              desc: "Easy returns policy",
            },
            { icon: Lock, title: "Secure Payment", desc: "100% protected" },
          ].map((badge, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left"
            >
              <div className="bg-blue-100 p-3 rounded-lg">
                <badge.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">
                  {badge.title}
                </div>
                <div className="text-xs text-gray-600">{badge.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
