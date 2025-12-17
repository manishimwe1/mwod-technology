import React from 'react';
import { HelpCircle } from 'lucide-react';

const Banner: React.FC = () => {
  return (
    <div className="mt-6 bg-[#f7f7f7] rounded-lg p-6 md:p-10 flex flex-col md:flex-row items-center justify-between relative group">
      <div>
        <h3 className="text-xl md:text-2xl font-bold text-[#191919] mb-2">Shopping made easy</h3>
        <p className="text-[#191919] text-[15px]">Enjoy reliability, secure deliveries and hassle-free returns.</p>
      </div>
      <div className="mt-4 md:mt-0">
         <button className="bg-[#191919] text-white px-6 py-2.5 rounded-full font-semibold text-[15px] hover:bg-[#333] transition-colors">
            Start now
         </button>
      </div>
       
       {/* Floating help button often seen on modern sites, simulating the '?' in the screenshot */}
      <button className="hidden md:flex absolute right-4 bottom-4 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center hover:bg-gray-50 text-[#191919] border border-gray-200">
        <HelpCircle size={20} />
      </button>
    </div>
  );
};

export default Banner;