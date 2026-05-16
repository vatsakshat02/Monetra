"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const DashboardPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingId, setRejectingId] = useState("");
  const [paymentForm, setPaymentForm] = useState({
    utrNumber: "",
    amount: "",
    paymentDate: "",
  });
  const [payingLoanId, setPayingLoanId] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) {
      router.push("/login");
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);
    fetchData(u.role, token);
  }, []);

  const fetchData = async (role: string, token: string) => {
    setLoading(true);
    const module = role === "admin" ? "sanction" : role;
    const res = await api.getDashboardData(module, token);
    setData(res.users || res.loans || []);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleApprove = async (loanId: string) => {
    const token = localStorage.getItem("token")!;
    await api.approveLoan(loanId, token);
    fetchData(user.role, token);
  };

  const handleReject = async (loanId: string) => {
    if (!rejectReason) return;
    const token = localStorage.getItem("token")!;
    await api.rejectLoan(loanId, rejectReason, token);
    setRejectingId("");
    setRejectReason("");
    fetchData(user.role, token);
  };

  const handleDisburse = async (loanId: string) => {
    const token = localStorage.getItem("token")!;
    await api.disburseLoan(loanId, token);
    fetchData(user.role, token);
  };

  const handlePayment = async (loanId: string) => {
    const token = localStorage.getItem("token")!;
    await api.recordPayment(
      loanId,
      {
        ...paymentForm,
        amount: Number(paymentForm.amount),
      },
      token
    );
    setPayingLoanId("");
    setPaymentForm({ utrNumber: "", amount: "", paymentDate: "" });
    fetchData(user.role, token);
  };

  const getModuleTitle = (role: string) => {
    const titles: any = {
      sales: "Sales — Lead Tracking",
      sanction: "Sanction — Loan Applications",
      disbursement: "Disbursement — Approved Loans",
      collection: "Collection — Active Loans",
      admin: "Admin — All Applications",
    };
    return titles[role] || "Dashboard";
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Monetra</h1>
          <p className="text-gray-400 text-sm mt-1">
            {getModuleTitle(user?.role)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm capitalize">{user?.role}</span>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      {data.length === 0 && (
        <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
          <p className="text-gray-400">No records found</p>
        </div>
      )}

      {user?.role === "sales" && (
        <div className="space-y-4">
          {data.map((u: any) => (
            <div
              key={u._id}
              className="bg-gray-900 rounded-xl p-5 border border-gray-800"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-white font-semibold">{u.name}</p>
                  <p className="text-gray-400 text-sm">{u.email}</p>
                </div>
                <span className="text-yellow-400 text-sm bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30">
                  Pending Profile
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {(user?.role === "sanction" || user?.role === "admin") && (
        <div className="space-y-4">
          {data.map((loan: any) => (
            <div
              key={loan._id}
              className="bg-gray-900 rounded-xl p-5 border border-gray-800"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white font-semibold">
                    {loan.borrowerId?.name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {loan.borrowerId?.email}
                  </p>
                </div>
                <span className="text-yellow-400 text-sm bg-yellow-400/10 px-3 py-1 rounded-full border border-yellow-400/30">
                  {loan.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Amount</p>
                  <p className="text-white font-semibold">
                    ₹{loan.amount?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Tenure</p>
                  <p className="text-white font-semibold">{loan.tenure} days</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Total Repayment</p>
                  <p className="text-white font-semibold">
                    ₹{loan.totalRepayment?.toLocaleString()}
                  </p>
                </div>
              </div>

              {rejectingId === loan._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Rejection reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(loan._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => setRejectingId("")}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(loan._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setRejectingId(loan._id)}
                    className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 py-2 rounded-lg text-sm font-semibold transition border border-red-600/30"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {user?.role === "disbursement" && (
        <div className="space-y-4">
          {data.map((loan: any) => (
            <div
              key={loan._id}
              className="bg-gray-900 rounded-xl p-5 border border-gray-800"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white font-semibold">
                    {loan.borrowerId?.name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {loan.borrowerId?.email}
                  </p>
                </div>
                <span className="text-blue-400 text-sm bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/30">
                  {loan.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Amount</p>
                  <p className="text-white font-semibold">
                    ₹{loan.amount?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Total Repayment</p>
                  <p className="text-white font-semibold">
                    ₹{loan.totalRepayment?.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDisburse(loan._id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition"
              >
                Mark as Disbursed
              </button>
            </div>
          ))}
        </div>
      )}

      {user?.role === "collection" && (
        <div className="space-y-4">
          {data.map((loan: any) => (
            <div
              key={loan._id}
              className="bg-gray-900 rounded-xl p-5 border border-gray-800"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white font-semibold">
                    {loan.borrowerId?.name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {loan.borrowerId?.email}
                  </p>
                </div>
                <span className="text-green-400 text-sm bg-green-400/10 px-3 py-1 rounded-full border border-green-400/30">
                  {loan.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Total Repayment</p>
                  <p className="text-white font-semibold">
                    ₹{loan.totalRepayment?.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Amount</p>
                  <p className="text-white font-semibold">
                    ₹{loan.amount?.toLocaleString()}
                  </p>
                </div>
              </div>

              {payingLoanId === loan._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="UTR Number"
                    value={paymentForm.utrNumber}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        utrNumber: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, amount: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  />
                  <input
                    type="date"
                    value={paymentForm.paymentDate}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        paymentDate: e.target.value,
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePayment(loan._id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                    >
                      Record Payment
                    </button>
                    <button
                      onClick={() => setPayingLoanId("")}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setPayingLoanId(loan._id)}
                  className="w-full bg-green-600/20 hover:bg-green-600/40 text-green-400 py-2 rounded-lg text-sm font-semibold transition border border-green-600/30"
                >
                  Record Payment
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
