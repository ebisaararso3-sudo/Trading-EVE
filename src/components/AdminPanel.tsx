import React, { useState, useEffect } from "react";
import { DollarSign, Users, BookOpen, Video, Trash2, Plus, RefreshCw, BarChart2, ShieldAlert } from "lucide-react";
import { AdminStats, Book, Video as VideoType } from "../types";
import { translations } from "../languages";

interface AdminPanelProps {
  lang: "en" | "om" | "am";
  authToken: string;
}

export default function AdminPanel({ lang, authToken }: AdminPanelProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Book upload form state
  const [bTitle, setBTitle] = useState("");
  const [bDesc, setBDesc] = useState("");
  const [bIsPaid, setBIsPaid] = useState(false);
  const [bPrice, setBPrice] = useState("50");
  const [bCategory, setBCategory] = useState("Mathematics");
  const [bLanguage, setBLanguage] = useState<"en" | "om" | "am">("en");
  const [bPages, setBPages] = useState("45");

  // Video upload form state
  const [vTitle, setVTitle] = useState("");
  const [vDesc, setVDesc] = useState("");
  const [vCategory, setVCategory] = useState("Coding");
  const [vDuration, setVDuration] = useState("12:30");
  const [vLanguage, setVLanguage] = useState<"en" | "om" | "am">("en");
  const [vUrl, setVUrl] = useState("https://www.w3schools.com/html/mov_bbb.mp4");

  const t = translations[lang];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load admin logs");
      }
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle || !bDesc || !bCategory) return;

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: bTitle,
          description: bDesc,
          isPaid: bIsPaid,
          price: bIsPaid ? Number(bPrice) : 0,
          category: bCategory,
          language: bLanguage,
          pages: Number(bPages || 10),
        }),
      });

      if (res.ok) {
        alert("Book published successfully!");
        setBTitle("");
        setBDesc("");
        setBIsPaid(false);
        fetchStats();
      } else {
        const d = await res.json();
        alert("Error publishing: " + d.error);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vTitle || !vDesc || !vUrl) return;

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: vTitle,
          description: vDesc,
          url: vUrl,
          duration: vDuration,
          category: vCategory,
          language: vLanguage,
        }),
      });

      if (res.ok) {
        alert("Video lecture published successfully!");
        setVTitle("");
        setVDesc("");
        setVUrl("https://www.w3schools.com/html/mov_bbb.mp4");
        fetchStats();
      } else {
        const d = await res.json();
        alert("Error publishing: " + d.error);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this video lecture?")) return;
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${authToken}` },
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none relative z-10 text-white">
      {/* Header Admin section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2 font-display">
            <BarChart2 className="h-7 w-7 text-blue-400" />
            {t.adminTitle}
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-wide">System Performance Logs & Content Portal</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="mt-4 md:mt-0 flex items-center justify-center gap-1.5 px-4 py-2 border border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 text-blue-400 ${loading ? "animate-spin" : ""}`} />
          Refresh Stats
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded-2xl text-xs text-red-300 flex items-start gap-2">
          <ShieldAlert className="h-5 w-5 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Bento Cards Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white/5 backdrop-blur-md p-5 rounded-[24px] border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute right-4 top-4 bg-emerald-500/10 text-emerald-400 p-2.5 rounded-2xl border border-emerald-500/20 animate-pulse">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Simulated Revenue</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1 font-mono">
              {stats?.totalRevenue || 0} <span className="text-xs font-sans text-emerald-400 font-bold">ETB</span>
            </h2>
          </div>
          <div className="text-[10px] text-gray-400 mt-4">Simulated via Telebirr Checkout</div>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-5 rounded-[24px] border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute right-4 top-4 bg-blue-500/10 text-blue-400 p-2.5 rounded-2xl border border-blue-500/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{t.totalUsers}</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1 font-mono">
              {stats?.totalUsers || 0}
            </h2>
          </div>
          <div className="text-[10px] text-gray-400 mt-4">Enrolled students</div>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-5 rounded-[24px] border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute right-4 top-4 bg-purple-500/10 text-purple-400 p-2.5 rounded-2xl border border-purple-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{t.totalBooks}</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1 font-mono">
              {stats?.totalBooks || 0}
            </h2>
          </div>
          <div className="text-[10px] text-gray-400 mt-4">PDF Books available</div>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-5 rounded-[24px] border border-white/10 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div className="absolute right-4 top-4 bg-amber-500/10 text-amber-400 p-2.5 rounded-2xl border border-amber-500/20">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{t.totalVideos}</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1 font-mono">
              {stats?.totalVideos || 0}
            </h2>
          </div>
          <div className="text-[10px] text-gray-400 mt-4">Video lectures</div>
        </div>
      </div>

      {/* Forms Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Book upload panel */}
        <div className="bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10 p-6 shadow-xl">
          <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2 font-display">
            <BookOpen className="h-5 w-5 text-blue-400" />
            {t.addNewBook}
          </h2>

          <form onSubmit={handleUploadBook} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Book Title</label>
              <input
                type="text"
                required
                value={bTitle}
                onChange={(e) => setBTitle(e.target.value)}
                placeholder="E.g. Calculus Derivatives Grade 12"
                className="w-full p-3 text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Language</label>
                <select
                  value={bLanguage}
                  onChange={(e) => setBLanguage(e.target.value as any)}
                  className="w-full p-3 text-xs bg-black/40 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold cursor-pointer"
                >
                  <option value="en" className="bg-[#0F0F1A] text-white">English</option>
                  <option value="om" className="bg-[#0F0F1A] text-white">Afaan Oromoo</option>
                  <option value="am" className="bg-[#0F0F1A] text-white">አማርኛ (Amharic)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Subject / Category</label>
                <input
                  type="text"
                  required
                  value={bCategory}
                  onChange={(e) => setBCategory(e.target.value)}
                  className="w-full p-3 text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Pages count</label>
                <input
                  type="number"
                  required
                  value={bPages}
                  onChange={(e) => setBPages(e.target.value)}
                  className="w-full p-3 text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold font-mono"
                />
              </div>

              <div className="flex flex-col justify-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bIsPaid}
                    onChange={(e) => setBIsPaid(e.target.checked)}
                    className="h-4.5 w-4.5 text-blue-600 rounded border-white/10 focus:ring-blue-400"
                  />
                  <span className="text-xs font-bold text-gray-300">Premium / Paid Book</span>
                </label>
              </div>
            </div>

            {bIsPaid && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Price in ETB</label>
                <input
                  type="number"
                  required
                  value={bPrice}
                  onChange={(e) => setBPrice(e.target.value)}
                  className="w-full p-3 text-xs bg-black/40 border border-white/10 text-emerald-400 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Description</label>
              <textarea
                required
                value={bDesc}
                onChange={(e) => setBDesc(e.target.value)}
                placeholder="Write detailed summary of content..."
                rows={3}
                className="w-full p-3 text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full h-11 flex items-center justify-center gap-1.5 bg-gradient-to-tr from-blue-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all"
            >
              <Plus className="h-4 w-4" />
              Publish Book
            </button>
          </form>
        </div>

        {/* Video upload panel */}
        <div className="bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10 p-6 shadow-xl">
          <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2 font-display">
            <Video className="h-5 w-5 text-amber-400" />
            {t.addNewVideo}
          </h2>

          <form onSubmit={handleUploadVideo} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Video Lecture Title</label>
              <input
                type="text"
                required
                value={vTitle}
                onChange={(e) => setVTitle(e.target.value)}
                placeholder="E.g. Newton's Third Law Animation"
                className="w-full p-3 text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Language</label>
                <select
                  value={vLanguage}
                  onChange={(e) => setVLanguage(e.target.value as any)}
                  className="w-full p-3 text-xs bg-black/40 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold cursor-pointer"
                >
                  <option value="en" className="bg-[#0F0F1A] text-white">English</option>
                  <option value="om" className="bg-[#0F0F1A] text-white">Afaan Oromoo</option>
                  <option value="am" className="bg-[#0F0F1A] text-white">አማርኛ (Amharic)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Subject / Category</label>
                <input
                  type="text"
                  required
                  value={vCategory}
                  onChange={(e) => setVCategory(e.target.value)}
                  className="w-full p-3 text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Duration (MM:SS)</label>
                <input
                  type="text"
                  required
                  value={vDuration}
                  onChange={(e) => setVDuration(e.target.value)}
                  className="w-full p-3 text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Video Stream URL</label>
                <input
                  type="text"
                  required
                  value={vUrl}
                  onChange={(e) => setVUrl(e.target.value)}
                  className="w-full p-3 text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5 tracking-wider">Description</label>
              <textarea
                required
                value={vDesc}
                onChange={(e) => setVDesc(e.target.value)}
                placeholder="Describe key concepts demonstrated in the lecture..."
                rows={3}
                className="w-full p-3 text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full h-11 flex items-center justify-center gap-1.5 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer hover:opacity-95 active:scale-[0.99] transition-all"
            >
              <Plus className="h-4 w-4" />
              Publish Video Lecture
            </button>
          </form>
        </div>
      </div>

      {/* Audit Log list */}
      <div className="bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10 shadow-xl p-6 overflow-hidden">
        <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2 font-display">
          <DollarSign className="h-5 w-5 text-emerald-400" />
          {t.transactionsHistory}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Buyer Student</th>
                <th className="py-3 px-4">Materials Unlocked</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Gatii (Price)</th>
                <th className="py-3 px-4">{t.status}</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {!stats?.transactions || stats.transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No payment activities logged yet.
                  </td>
                </tr>
              ) : (
                stats.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5">
                    <td className="py-4 px-4 font-mono font-bold text-white">{tx.txId}</td>
                    <td className="py-4 px-4 font-semibold text-gray-200">{tx.buyerName}</td>
                    <td className="py-4 px-4 text-gray-300 truncate max-w-xs">{tx.bookTitle}</td>
                    <td className="py-4 px-4 font-mono text-gray-400">{tx.phone}</td>
                    <td className="py-4 px-4 font-mono font-bold text-emerald-400">{tx.amount} ETB</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-mono font-bold text-[9px] uppercase ${
                          tx.status === "success"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-400 font-mono">
                      {new Date(tx.timestamp).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
