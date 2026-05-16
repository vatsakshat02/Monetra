"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const ApplyPage = () => {
  const router = useRouter();
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(30);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const interest = (amount * 12 * tenure) / (365 * 100);
  const totalRepayment = Math.round(amount + interest);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const data = await api.applyLoan({ amount, tenure }, token);

      if (data.loan) {
        router.push("/status");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Monetra</h1>
          <p className="text-gray-400 mt-2">Configure your loan</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
            ✓
          </div>
          <div className="w-12 h-1 bg-green-500"></div>
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
            ✓
          </div>
          <div className="w-12 h-1 bg-green-500"></div>
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
            ✓
          </div>
          <div className="w-12 h-1 bg-blue-500"></div>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
            4
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                Loan Amount
              </label>
              <span className="text-blue-400 font-bold">
                ₹{amount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={500000}
              step={5000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₹50,000</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">
                Tenure
              </label>
              <span className="text-blue-400 font-bold">{tenure} days</span>
            </div>
            <input
              type="range"
              min={30}
              max={365}
              step={5}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30 days</span>
              <span>365 days</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-5 space-y-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wide">
              Loan Summary
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Principal Amount</span>
              <span className="text-white">₹{amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Interest Rate</span>
              <span className="text-white">12% p.a.</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tenure</span>
              <span className="text-white">{tenure} days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Simple Interest</span>
              <span className="text-white">
                ₹{Math.round(interest).toLocaleString()}
              </span>
            </div>
            <div className="border-t border-gray-700 pt-3 flex justify-between">
              <span className="text-white font-semibold">Total Repayment</span>
              <span className="text-green-400 font-bold text-lg">
                ₹{totalRepayment.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Submitting..." : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
