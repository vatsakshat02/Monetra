const BASE_URL = "http://localhost:8000/api";

export const api = {
  signup: async (data: { name: string; email: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  login: async (data: { email: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  saveProfile: async (data: any, token: string) => {
    const res = await fetch(`${BASE_URL}/borrower/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  uploadSalarySlip: async (file: File, token: string) => {
    const formData = new FormData();
    formData.append("salarySlip", file);
    const res = await fetch(`${BASE_URL}/borrower/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return res.json();
  },
  applyLoan: async (
    data: { amount: number; tenure: number },
    token: string
  ) => {
    const res = await fetch(`${BASE_URL}/borrower/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return res.json;
  },
  getMyLoan: async (token: string) => {
    const res = await fetch(`${BASE_URL}/borrower/loan`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
  getDashboardData: async (module: string, token: string) => {
    const res = await fetch(`${BASE_URL}/dashboard/${module}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json;
  },
  approveLoan: async (loanId: string, token: string) => {
    const res = await fetch(
      `${BASE_URL}/dashboard/sanction/${loanId}/approve`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.json();
  },
  rejectLoan: async (loanId: string, reason: string, token: string) => {
    const res = await fetch(`${BASE_URL}/dashboard/sanction/${loanId}/reject`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    });
    return res.json();
  },
  disburseLoan: async (loanId: string, data: any, token: string) => {
    const res = await fetch(
      `${BASE_URL}/dashboard/disbursement/${loanId}/disburse`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.json();
  },
  recordPayment: async (loanId: string, data: any, token: string) => {
    const res = await fetch(
      `${BASE_URL}/dashboard/collection/${loanId}/payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    return res.json();
  },
};
