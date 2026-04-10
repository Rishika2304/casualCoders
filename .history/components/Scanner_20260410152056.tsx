"use client";
import React from "react";

export default function Scanner() {
  return (
    <div className="w-full h-full bg-black rounded-xl flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 border-2 border-green-500/30 animate-pulse"></div>
      <p className="text-green-500 font-mono text-xs">SCANNER_READY...</p>
    </div>
  );
}
