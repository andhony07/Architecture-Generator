import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, User, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

import api from "../api/axios";
import Input from "../components/ui/Input";
import PasswordInput from "../components/ui/PasswordInput";
import PasswordStrength from "../components/ui/PasswordStrength";
import ArchitectureDiagramPreview from "../components/auth/ArchitectureDiagramPreview";

const Signup = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: true,
    },
  });

  const watchPassword = useWatch({ control, name: "password" });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      await api.post("/auth/register", payload);

      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        (error.response?.data?.errors && error.response.data.errors[0]?.msg) ||
        "Registration failed. Please try again.";
      setServerError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* LEFT PANEL: Soft Indigo/Blue Architectural Visual Environment */}
        <div className="lg:col-span-7 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-cyan-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-200/80 dark:border-slate-800 relative overflow-hidden hidden md:flex">
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

          {/* Headline & Architecture Visual */}
          <div className="my-6 space-y-5">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                Start designing production-ready systems.
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                Join developers generating optimal tech stacks, database blueprints, microservice topologies, and cloud architectures.
              </p>
            </div>

            <ArchitectureDiagramPreview />
          </div>

          {/* Bottom highlights */}
          <div className="pt-4 border-t border-gray-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400" /> Instant Diagrams
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400" /> Security Blueprint
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400" /> Export Specs
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Registration Form */}
        <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-10 bg-white dark:bg-slate-900">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Create account
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                Start designing software architectures with AI.
              </p>
            </div>

            {/* Server Error Message */}
            {serverError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-medium flex items-start gap-2">
                <span>⚠️</span>
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <Input
                label="Full Name"
                type="text"
                icon={User}
                placeholder="Alex Mercer"
                autoComplete="name"
                error={errors.name?.message}
                {...register("name", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="architect@domain.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address format",
                  },
                })}
              />

              <div>
                <PasswordInput
                  label="Password"
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <PasswordStrength password={watchPassword || ""} />
              </div>

              <PasswordInput
                label="Confirm Password"
                placeholder="Repeat password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watchPassword || "Passwords do not match",
                })}
              />

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-500 dark:text-slate-400">
                  <input
                    type="checkbox"
                    {...register("terms", {
                      required: "You must accept terms to create an account",
                    })}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    I agree to the Terms of Service & Privacy Policy
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    • {errors.terms.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-indigo-600/20 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Create Account</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 text-center text-xs text-gray-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;