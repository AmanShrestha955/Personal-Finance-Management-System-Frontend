"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-5">
      <div className="bg-white border border-neutral-200 w-full max-w-[450px] rounded-md p-12">
        <h1 className="text-2xl font-semibold text-text-1000 mb-2 tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-neutral-500 mb-8">
          Enter your email address and we&apos;ll send you a reset link.
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-3 mb-6">
            Reset link sent. Check your email.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-900 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`w-full px-3 py-3 border text-sm transition-colors focus:outline-none rounded-sm focus:border-neutral-900 ${
                error ? "border-red-600" : "border-neutral-200"
              }`}
            />
            {error && <p className="text-red-600 text-xs mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white py-3 text-sm font-medium rounded-sm hover:bg-neutral-700 active:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            href="/sign-in"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
