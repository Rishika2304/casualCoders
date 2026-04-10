Scanner.tsx

"use client";

import { useEffect, useRef, useState } from 'react';

import { Html5Qrcode } from 'html5-qrcode';



export default function Scanner({ onResult }: { onResult: (val: string) => void }) {

  const [isStarted, setIsStarted] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);



  const startCamera = async () => {

    try {

      setError(null);

      const scanner = new Html5Qrcode("reader");

      scannerRef.current = scanner;



      await scanner.start(

        { facingMode: "environment" },

        { 

          fps: 15, // 15 is highly stable for mobile browsers

          qrbox: { width: 280, height: 150 }, // Wider box explicitly for "Lined" medicine barcodes

          aspectRatio: 1.777778 

        },

        (text) => {

          // 1. TACTILE FEEDBACK: Vibrates the phone if supported (Real-app feel!)

          if (navigator.vibrate) navigator.vibrate(100);

          onResult(text);

        },

        (errorMessage) => {

          // Silently ignore frame-by-frame scan failures to prevent lag

        }

      );

      setIsStarted(true);

    } catch (err) {

      console.error("Camera Error:", err);

      setError("Camera access denied. Please check permissions.");

    }

  };



 useEffect(() => {

    return () => {

      // Safely stop the camera if the user navigates away

      if (scannerRef.current && scannerRef.current.isScanning) {

        // stop() is a Promise. We must wait for it to finish before clearing!

        scannerRef.current.stop().then(() => {

          scannerRef.current?.clear();

        }).catch(() => {});

      }

    };

  }, []);



  return (

    <div className="relative w-full h-[280px] bg-black rounded-2xl overflow-hidden z-10 shadow-inner">

      {/* The actual camera feed renders here */}

      <div id="reader" className="w-full h-full"></div>

      

      {/* Pre-launch Overlay */}

      {!isStarted && (

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-50 p-4 text-center">

          {error && <p className="text-red-400 text-xs mb-4 font-bold">{error}</p>}

          <button 

            onClick={startCamera} 

            className="bg-blue-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 transition-all"

          >

            Launch Lens

          </button>

        </div>

      )}

      

      {/* Active Scanning Overlay (Laser & Brackets) */}

      {isStarted && (

        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-20">

          

          {/* 2. TARGETING BRACKETS to guide the user's camera */}

          <div className="absolute inset-0 m-auto w-[280px] h-[150px]">

            {/* Top Left Corner */}

            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>

            {/* Top Right Corner */}

            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>

            {/* Bottom Left Corner */}

            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>

            {/* Bottom Right Corner */}

            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>

          </div>



          {/* 3. The Scanning Laser */}

          <div className="w-[260px] h-[2px] bg-red-500 shadow-[0_0_15px_red] animate-[pulse_1s_ease-in-out_infinite]" />

          

          <div className="absolute bottom-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full">

            <p className="text-white text-[8px] font-black uppercase tracking-widest">Align Barcode Inside Box</p>

          </div>

        </div>

      )}

    </div>

  );

}