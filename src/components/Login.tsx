import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Languages, Sparkles } from "lucide-react";
import { translations } from "../languages";

interface LoginProps {
  onSuccess: (user: any) => void;
  lang: "en" | "om" | "am";
  setLang: (l: "en" | "om" | "am") => void;
}

export default function Login({ onSuccess, lang, setLang }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isSignUp ? "/api/auth/signup" : "/api/auth/login";
    const body = isSignUp
      ? { name, email, password, language: lang }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "An error occurred");
      }

      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoType: "student" | "admin") => {
    setEmail(demoType === "admin" ? "admin@smartbook.ai" : "student@smartbook.ai");
    setPassword(demoType === "admin" ? "admin123" : "student123");
    setIsSignUp(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] text-gray-900 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative select-none">
      {/* Subtle radial gradients for elegant light theme matches Screenshot 1 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#E9EBF8_0%,transparent_40%)] opacity-80 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#ECE7F9_0%,transparent_40%)] opacity-80 pointer-events-none"></div>

      {/* Language Setting top-right corner */}
      <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-100 shadow-md z-10">
        <Languages className="h-4 w-4 text-purple-600" />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as any)}
          className="text-xs font-bold text-gray-700 bg-transparent border-none outline-none cursor-pointer"
        >
          <option value="en">English</option>
          <option value="om">Afaan Oromoo</option>
          <option value="am">አማርኛ</option>
        </select>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
        {/* Logo matches Screenshot 1: Rounded camera icon in deep violet-blue box */}
        <div className="bg-[#5B37D4] p-5 rounded-[28px] shadow-xl shadow-purple-500/10 flex items-center justify-center h-20 w-20 transform hover:scale-105 transition-all">
          <svg className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 47.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>
        </div>

        {/* Title matches Screenshot 1: "Welcome smartbook ai" */}
        <h2 className="mt-6 text-center text-3xl font-black tracking-tight text-gray-900 font-sans">
          Welcome <span className="text-[#5B37D4]">smartbook ai</span>
        </h2>
        
        {/* Subtitle matches Screenshot 1 */}
        <p className="mt-2 text-center text-sm text-gray-500 font-semibold max-w-xs">
          {isSignUp ? "Register to unlock your trilingual library." : "Login to continue and explore amazing photos."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 shadow-xl rounded-[32px] border border-gray-100 sm:px-10">
          <form className="space-y-4 text-left" onSubmit={handleSubmit}>
            {isSignUp && (
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                  {t.nameLabel}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-4 py-3 bg-[#F0F2FA] hover:bg-[#EAECE6] focus:bg-white border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold text-gray-800 placeholder-gray-400 transition-all"
                    placeholder="Enter full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                {t.emailLabel} or Username
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-600">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-[#F4F5FB] hover:bg-[#EAEBF3] focus:bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold text-gray-800 placeholder-gray-400 transition-all"
                  placeholder="Email or Username"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                {t.passLabel}
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-600">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-11 py-3.5 bg-[#F4F5FB] hover:bg-[#EAEBF3] focus:bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold text-gray-800 placeholder-gray-400 transition-all"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-purple-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3.5 rounded-xl text-xs text-red-600 font-semibold">
                {error}
              </div>
            )}

            {/* Login Gradient Button matches Screenshot 1 */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 flex items-center justify-center rounded-2xl shadow-md text-sm font-black text-white bg-gradient-to-r from-[#7B53F4] to-[#5B37D4] hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
              </button>
            </div>
          </form>

          {/* Forgot Password matches Screenshot 1 */}
          {!isSignUp && (
            <div className="mt-3.5 text-center">
              <button
                type="button"
                onClick={() => alert("Simulation: Reset link has been sent to " + (email || "your email"))}
                className="text-xs font-bold text-[#5B37D4] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* OR Separator matches Screenshot 1 */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-[10px] uppercase font-black tracking-widest text-gray-400">or</span>
            </div>
          </div>

          {/* Google & Facebook Continue Buttons matches Screenshot 1 */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setEmail("student@smartbook.ai");
                setPassword("student123");
                alert("Simulated Google authentication - loaded Student demo profile!");
              }}
              className="w-full h-11 flex items-center justify-center gap-3 border border-gray-200 rounded-2xl hover:bg-gray-50 bg-white text-xs font-bold text-gray-700 active:scale-[0.99] transition-all cursor-pointer"
            >
              {/* Google G Icon */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail("admin@smartbook.ai");
                setPassword("admin123");
                alert("Simulated Facebook authentication - loaded Admin demo profile!");
              }}
              className="w-full h-11 flex items-center justify-center gap-3 border border-gray-200 rounded-2xl hover:bg-gray-50 bg-white text-xs font-bold text-gray-700 active:scale-[0.99] transition-all cursor-pointer"
            >
              {/* Facebook blue circle icon */}
              <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>
          </div>

          {/* Bottom link: Don't have an account? Sign Up matches Screenshot 1 */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-xs font-bold text-gray-500 hover:text-purple-600"
            >
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <span className="text-[#5B37D4] font-black">{isSignUp ? "Sign In" : "Sign Up"}</span>
            </button>
          </div>

          {/* Demure Quick Demo toggle triggers */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("student")}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#5B37D4] border border-purple-100 rounded-full text-[10px] font-bold transition-colors cursor-pointer"
            >
              ⚡ Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 rounded-full text-[10px] font-bold transition-colors cursor-pointer"
            >
              ⚡ Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
