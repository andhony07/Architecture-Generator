import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ArchitectureDiagramPreview from "../components/auth/ArchitectureDiagramPreview";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const responseData = response.data || {};
      const token = responseData.token || responseData.data?.token;
      const user = responseData.user || responseData.data?.user || responseData.data;

      if (!token) {
        throw new Error("No authentication token returned by server.");
      }

      login(token, user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.message || err.message || "Invalid credentials. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-main)] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Architectural Info & Preview Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-indigo-50/60 via-slate-50/50 to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-slate-800">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="5" r="2.5" fill="#4F46E5" />
                  <circle cx="5" cy="18" r="2.5" fill="#0891B2" />
                  <circle cx="19" cy="18" r="2.5" fill="#7C3AED" />
                  <path d="M12 7.5V13M12 13L6.5 16M12 13L17.5 16" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">AI Architect</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">System Design Studio</p>
            </div>
          </div>

          {/* Value Prop & Diagram Visual */}
          <div className="my-6 space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
                <Sparkles size={12} className="text-indigo-600 dark:text-indigo-400" />
                <span>Production Blueprint Generator</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Turn software ideas into production architecture.
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                Describe requirements and let AI synthesize microservices topologies, cloud infrastructure, and database specifications.
              </p>
            </div>

            {/* Architecture Node Diagram Component */}
            <ArchitectureDiagramPreview />
          </div>

          {/* Footer note */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium border-t border-slate-200/60 dark:border-slate-800/80">
            <span>Enterprise MERN Platform</span>
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-500" />
              Verified Architecture
            </span>
          </div>
        </div>

        {/* Right Side: Authentication Form Card */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white dark:bg-slate-900">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sign in to your account to generate and manage system architectures.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email-input"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    id="email-input"
                    type="email"
                    placeholder="architect@domain.com"
                    disabled={isSubmitting}
                    className={`w-full bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.email
                        ? "border-rose-400 dark:border-rose-600 focus:ring-rose-500/20"
                        : "border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/10"
                    } focus:ring-2 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition disabled:opacity-50`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Entered value does not match email format",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-1" role="alert">
                    • {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password-input"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    className={`w-full bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.password
                        ? "border-rose-400 dark:border-rose-600 focus:ring-rose-500/20"
                        : "border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/10"
                    } focus:ring-2 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition disabled:opacity-50`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500 dark:text-rose-400 font-medium mt-1" role="alert">
                    • {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] disabled:bg-indigo-900/50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Signup Navigation Link */}
            <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;