import React, { useState } from "react";
import { CreditCard, Phone, Smartphone, ShieldCheck, CheckCircle, RefreshCw, X, AlertCircle } from "lucide-react";
import { Book } from "../types";
import { translations } from "../languages";

interface TelebirrModalProps {
  book: Book;
  onSuccess: () => void;
  onClose: () => void;
  lang: "en" | "om" | "am";
  authToken: string;
}

export default function TelebirrModal({ book, onSuccess, onClose, lang, authToken }: TelebirrModalProps) {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [otp, setOtp] = useState("");
  const [txId, setTxId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = translations[lang];

  const handleSendPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone || phone.length < 9) {
      setError("Please enter a valid mobile phone number");
      return;
    }

    setLoading(true);

    try {
      // Call backend to initialize simulated payment transaction
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ bookId: book.id, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize Telebirr payment");
      }

      setTxId(data.txId);

      // Now request Simulated OTP
      const otpRes = await fetch("/api/payments/simulate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txId: data.txId }),
      });
      const otpData = await otpRes.json();

      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp !== "123456") {
      setError("Invalid OTP! Use '123456' for simulation success.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/payments/simulate-confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ txId, otp }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment verification failed");
      }

      setStep("success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-[#0F0F1A] rounded-[32px] overflow-hidden shadow-2xl max-w-md w-full border border-white/10 relative animate-in fade-in zoom-in-95 duration-200 text-white">
        {/* Telebirr Brand Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 flex items-center justify-between text-white relative">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-lg">
              <Smartphone className="h-5 w-5 text-indigo-700" />
            </div>
            <div>
              <span className="text-[9px] tracking-wider uppercase opacity-80 block font-mono font-bold text-blue-200">ethio telecom</span>
              <h2 className="text-xs font-bold tracking-tight font-display">telebirr Payment Gateway</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6">
          {step === "phone" && (
            <form onSubmit={handleSendPhone} className="space-y-5">
              <div className="text-center">
                <div className="inline-flex bg-blue-500/10 p-4 rounded-full text-blue-400 mb-3 border border-blue-500/20">
                  <CreditCard className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-white font-display">{t.paymentRequired}</h3>
                <p className="text-xs text-gray-400 mt-1">{t.paymentInstructions}</p>

                {/* Bill Card info */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 my-4 text-left flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Purchasing Item</span>
                    <span className="text-xs font-bold text-white">{book.title}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Price</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">{book.price} ETB</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                  {t.telebirrPhone}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-blue-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="0912345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono text-white placeholder-gray-600"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-2xl text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 transition-all shadow-lg cursor-pointer"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                {t.payNow}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <div className="inline-flex bg-amber-500/10 p-4 rounded-full text-amber-400 mb-3 border border-amber-500/20">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-white font-display">Simulated OTP Sent</h3>
                <p className="text-xs text-gray-400 mt-1">{t.enterOtp}</p>

                {/* Telebirr SMS simulation notice */}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 my-4 text-xs text-amber-300">
                  💬 <span className="font-bold">Telebirr Simulation Info:</span> Enter the code <span className="font-extrabold text-amber-200 font-mono text-sm bg-black/40 px-2 py-0.5 rounded-md border border-amber-500/30 shadow-sm">123456</span> to complete transaction.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">
                  {t.otpLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder="------"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full py-2.5 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-mono font-bold text-lg tracking-widest text-white placeholder-gray-700"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-2xl text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-sm font-bold text-black bg-white hover:bg-gray-200 active:scale-[0.99] disabled:opacity-50 transition-all shadow-lg cursor-pointer"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                {t.confirmPayment}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="inline-flex bg-emerald-500/10 p-4 rounded-full text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">{t.paymentSuccess}</h3>
                <p className="text-xs text-gray-400 mt-1.5 px-4">{t.bookUnlocked}</p>
              </div>

              {/* Transaction details card */}
              <div className="bg-emerald-500/5 rounded-2xl border border-emerald-500/15 p-4 text-xs space-y-2 text-left max-w-xs mx-auto text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Merchant:</span>
                  <span className="text-white font-bold">SmartBook AI Ltd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Transaction ID:</span>
                  <span className="text-white font-bold font-mono">{txId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Amount Charged:</span>
                  <span className="text-emerald-400 font-bold font-mono">{book.price} ETB</span>
                </div>
              </div>

              <button
                onClick={onSuccess}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/15 hover:opacity-95 active:scale-[0.99] cursor-pointer"
              >
                {t.backToLibrary}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
