import React from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#e0e5ec] flex flex-col items-center py-10 px-4 font-sans">
      <h1 className="text-4xl font-extrabold text-gray-700 mb-2 tracking-tight">medClear</h1>
      <p className="text-gray-500 mb-8 font-medium italic">Phase 1: UI Skeleton</p>

      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Scanner Placeholder */}
        <div className="bg-[#e0e5ec] rounded-3xl p-6 shadow-[8px_8px_16px_#b8bec7,-8px_-8px_16px_#ffffff]">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Medicine Scanner</h2>
          <div className="h-[200px] w-full bg-[#d1d9e6] rounded-2xl flex items-center justify-center shadow-inner border-2 border-white/50">
            <p className="text-gray-400">Camera View Component</p>
          </div>
        </div>

        {/* Auditor Placeholder */}
        <div className="bg-[#e0e5ec] rounded-3xl p-6 shadow-[8px_8px_16px_#b8bec7,-8px_-8px_16px_#ffffff]">
           <h2 className="text-xl font-bold text-gray-700 mb-4">Bill Auditor</h2>
           <div className="h-[100px] w-full border-2 border-dashed border-gray-400 rounded-2xl flex items-center justify-center text-gray-400">
              <p>Upload Section</p>
           </div>
        </div>
      </div>
    </main>
  );
}