import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";

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
      const user = responseData.user || responseData.data?.user;

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
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Side: Soft Indigo/Blue Architectural Visual Environment */}
        <div className="lg:col-span-6 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-cyan-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200/80 dark:border-slate-800 relative overflow-hidden">
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-0.5 shadow-md flex items-center justify-center">
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
              <span className="font-extrabold text-sm text-gray-900 dark:text-white tracking-tight">AI Architect</span>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">System Design Studio</p>
            </div>
          </div>

          {/* Headline & Graphic */}
          <div className="my-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                Turn software ideas into production architecture.
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                Describe your requirements and let AI design microservices topologies, technology stacks, and database specifications.
              </p>
            </div>

            {/* Architecture Node Diagram Component */}
            <ArchitectureDiagramPreview />
          </div>

          <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">
            © {new Date().getFullYear()} AI Architect. Enterprise MERN Studio.
          </p>
        </div>

        {/* Right Side: Clean White Form Card */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white dark:bg-slate-900">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Sign in to your account to manage system architectures.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="architect@domain.com"
                    disabled={isSubmitting}
                    className="w-full bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none transition disabled:opacity-50"
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
                  <p className="text-xs text-red-500 font-medium mt-1">• {errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-slate-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    className="w-full bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none transition disabled:opacity-50"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium mt-1">• {errors.password.message}</p>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-gray-100 dark:border-slate-800">
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
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