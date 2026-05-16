"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const StatusPage = () => {
  const router = useRouter();
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLoan = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const data = await api.getMyLoan(token);
      if (data.loan) {
        setLoan(data.loan);
      }
      setLoading(false);
    };
    fetchLoan();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPLIED":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "SANCTIONED":
        return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      case "DISBURSED":
        return "text-green-400 bg-green-400/10 border-green-400/30";
      case "CLOSED":
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
      case "REJECTED":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      default:
        return "text-gray-400";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Monetra</h1>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            Logout
          </button>
        </div>

        {loan ? (
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-5">
            <div className="text-center">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                  loan.status
                )}`}
              >
                {loan.status}
              </span>
              {loan.status === "REJECTED" && loan.rejectionReason && (
                <p className="text-red-400 text-sm mt-3">
                  Reason: {loan.rejectionReason}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Loan Amount</span>
                <span className="text-white">
                  ₹{loan.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tenure</span>
                <span className="text-white">{loan.tenure} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Interest Rate</span>
                <span className="text-white">12% p.a.</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between">
                <span className="text-white font-semibold">
                  Total Repayment
                </span>
                <span className="text-green-400 font-bold">
                  ₹{loan.totalRepayment?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {["APPLIED", "SANCTIONED", "DISBURSED", "CLOSED"].map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      ["APPLIED", "SANCTIONED", "DISBURSED", "CLOSED"].indexOf(
                        loan.status
                      ) >= i
                        ? "bg-blue-500"
                        : "bg-gray-700"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      loan.status === s
                        ? "text-white font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 text-center">
            <p className="text-gray-400 mb-4">No loan application found</p>
            <button
              onClick={() => router.push("/apply")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Apply Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
