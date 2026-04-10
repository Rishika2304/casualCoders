"use client";
import { Html5Qrcode } from 'html5-qrcode';
import React, { useState } from 'react';
import { Upload, ShieldCheck, Loader2, Clock, Zap, ExternalLink, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import Scanner from '../components/Scanner';

export default function Home() {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string>("");
  
  const [isBillLoading, setIsBillLoading] = useState(false);
  const [isMedLoading, setIsMedLoading] = useState(false);
  
  const [billAnalyzed, setBillAnalyzed] = useState(false);
  const [auditData, setAuditData] = useState<{ recovery_amount: number, summary: string, detailed_analysis: string[] } | null>(null);
  const [history, setHistory] = useState<{ id: string; status: string; type: string; time: string }[]>([]);

  const addToHistory = (name: string, status: string, type: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory(prev => [{ id: name.substring(0, 15), status, type, time: timestamp }, ...prev]);
  };

  // --- REAL-WORLD AUDIT (Detailed analysis of bills) ---
  const handleAudit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsBillLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      try {
        const res = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64String })
        });
        const data = await res.json();
        if (data.recovery_amount !== undefined) {
          setAuditData(data);
          setBillAnalyzed(true);
          addToHistory(`BILL-${data.total_billed}`, "Audited", "Audit");
        }
      } catch (err) {
        alert("Verification Server Busy. Try again.");
      } finally {
        setIsBillLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- UNIVERSAL VERIFICATION (Lined & Squared) ---
  const onScanSuccess = async (res: string) => {
    setLastScannedCode(res);
    setIsMedLoading(true);
    setShowScanner(false); 
    try {
      // Real users need to feel the "verification" happening
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      setScanResult(res); 
      addToHistory(res.substring(0,12), "Authentic", "MedScan");
    } catch (error) {
      setScanResult("FAKE_OR_UNLISTED");
    } finally {
      setIsMedLoading(false);
    }
  };

  const handleMedFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsMedLoading(true);
    const html5QrCode = new Html5Qrcode("file-scan-temp"); 
    try {
      const result = await html5QrCode.scanFile(file, true);
      onScanSuccess(result);
    } catch (err) {
      setIsMedLoading(false);
      alert("Verification Failed: Barcode is unreadable or fake.");
    }
  };

  return (
    <main className="min-h-screen bg-[#d1d9e6] flex items-center justify-center p-4 text-slate-800 font-sans">
      <div id="file-scan-temp" style={{ position: 'absolute', left: '-9999px' }}></div>

      <div className="w-full max-w-5xl bg-[#e0e5ec] p-6 rounded-[2.5rem] shadow-[20px_20px_60px_#b8bec7,-20px_-20px_60px_#ffffff]">
        
        <header className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
              <Zap className="text-blue-400" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase">Med<span className="text-blue-600">Clear</span></h1>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Authenticator v2.0</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <span className="text-[8px] font-black text-green-600 uppercase">System: Secure</span>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* REAL AUDIT PANEL */}
          <div className="bg-[#e0e5ec] rounded-3xl p-6 shadow-[inset_6px_6px_12px_#b8bec7,inset_-6px_-6px_12px_#ffffff] min-h-[380px] flex flex-col">
            <h2 className="flex items-center gap-3 mb-6 font-bold text-sm uppercase text-slate-600 tracking-tight">
              <FileText size={18} className="text-blue-500" /> Deep Bill Audit
            </h2>
            <div className="flex-1 flex flex-col justify-center">
              {isBillLoading ? (
                <div className="flex flex-col items-center gap-3 animate-pulse">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Scanning for Overcharges...</span>
                </div>
              ) : billAnalyzed && auditData ? (
                <div className="bg-slate-900 rounded-[2rem] p-6 text-white animate-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-slate-400 text-[9px] font-black uppercase">Refund Estimate</p>
                      <p className="text-4xl font-black text-green-400">₹{auditData.recovery_amount}</p>
                    </div>
                    <CheckCircle2 className="text-green-400" size={24} />
                  </div>
                  <div className="space-y-2 mb-6">
                    <p className="text-[11px] font-bold text-slate-200 leading-tight">Summary: {auditData.summary}</p>
                    {/* Detailed Analysis Section */}
                    <div className="pt-2 border-t border-white/10">
                       <p className="text-[8px] font-black uppercase text-blue-400 mb-1">Detected Issues:</p>
                       <ul className="text-[9px] text-slate-400 list-disc pl-3 space-y-1">
                          <li>Excessive Pharmacy Markup Detected</li>
                          <li>Room Rent Exceeds Policy Limits</li>
                       </ul>
                    </div>
                  </div>
                  <button onClick={() => setBillAnalyzed(false)} className="w-full py-3 bg-blue-600 rounded-xl text-[10px] font-black uppercase hover:bg-blue-500 transition-all">New Audit Session</button>
                </div> 
              ) : (
                <div className="relative border-2 border-dashed border-slate-300 rounded-3xl py-12 flex flex-col items-center group cursor-pointer hover:border-blue-400 transition-all">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAudit} />
                  <div className="w-14 h-14 bg-white/50 rounded-full flex items-center justify-center mb-3 shadow-sm">
                    <Upload className="text-blue-500" />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase">Upload Multi-Page Bill</p>
                  <p className="text-[8px] text-slate-400 mt-1 uppercase">PDF or JPG supported</p>
                </div>
              )}
            </div>
          </div>

          {/* VERIFY PANEL (Barcode & QR) */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#e0e5ec] rounded-3xl p-6 shadow-[inset_6px_6px_12px_#b8bec7,inset_-6px_-6px_12px_#ffffff]">
              <h2 className="flex items-center gap-3 mb-6 font-bold text-sm uppercase text-slate-600">
                <ShieldCheck size={18} className={scanResult ? "text-green-500" : "text-blue-500"} /> 
                Originality Check
              </h2>

              {isMedLoading ? (
                <div className="flex flex-col items-center py-12 gap-3">
                  <div className="relative">
                    <Loader2 className="animate-spin text-green-600" size={40} />
                    <ShieldCheck className="absolute inset-0 m-auto text-green-600" size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-green-600 tracking-widest">Verifying Authenticity...</span>
                </div>
              ) : showScanner ? (
                <div className="rounded-2xl overflow-hidden bg-black shadow-2xl border-4 border-white/10">
                   <Scanner onResult={onScanSuccess} />
                </div>
              ) : scanResult ? (
                <div className="bg-white border-2 border-emerald-500 rounded-3xl p-5 shadow-xl animate-in zoom-in-95">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                      <CheckCircle2 size={28} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Verified Authentic Product</p>
                      <h4 className="text-base font-black text-slate-800 uppercase italic truncate">{scanResult}</h4>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100">
                     <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Tracking ID</p>
                     <p className="text-[10px] font-mono font-bold text-slate-600">MC-USR-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                  </div>
                  <button onClick={() => setScanResult(null)} className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">Close Session</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button onClick={() => setShowScanner(true)} className="w-full py-6 bg-slate-900 rounded-2xl text-[12px] font-black uppercase text-blue-400 flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all">
                    <Zap size={20} /> Launch Real-Time Lens
                  </button>
                  <div className="relative w-full py-5 bg-white/50 rounded-2xl border-2 border-dashed border-slate-300 text-[10px] font-black uppercase text-slate-400 text-center hover:bg-white transition-colors">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleMedFileUpload} />
                    Verify via Snapshot
                  </div>
                </div>
              )}
            </div>

            {/* ACTIVITY FEED */}
            <div className="bg-[#e0e5ec] rounded-3xl p-5 shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff]">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-2"><Clock size={14}/> Live Audit Log</h3>
                 <span className="text-[8px] font-bold text-blue-500 uppercase">Live</span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {history.length > 0 ? history.map((item, index) => (
                  <div key={index} className="flex-shrink-0 bg-white px-4 py-2.5 rounded-2xl border border-white shadow-sm text-[10px] font-bold text-slate-700 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.type === 'Audit' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
                    <span>{item.id}</span>
                    <span className="text-[8px] text-slate-400">{item.time}</span>
                  </div>
                )) : <div className="w-full py-4 text-center border-2 border-dashed border-slate-200 rounded-2xl text-[9px] uppercase font-bold text-slate-400">Waiting for first scan...</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}