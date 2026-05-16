"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const UploadPage = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) {
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(selected.type)) {
      setError("Only PDF, JPG and PNG files are allowed");
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5mb");
      return;
    }

    setError("");
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const data = await api.uploadSalarySlip(file, token);

      if (data.message === "Salary slip uploaded successfully") {
        router.push("/apply");
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      setError("something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Monetra</h1>
          <p className="text-gray-400 mt-2">Upload your salary slip</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
            ✓
          </div>
          <div className="w-12 h-1 bg-green-500"></div>
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
            ✓
          </div>
          <div className="w-12 h-1 bg-blue-500"></div>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
            3
          </div>
          <div className="w-12 h-1 bg-gray-700"></div>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-bold">
            4
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div
              className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {file ? (
                <div>
                  <p className="text-green-400 font-medium">{file.name}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-4xl mb-3">📄</p>
                  <p className="text-gray-300 font-medium">Click to upload</p>
                  <p className="text-gray-500 text-sm mt-1">
                    PDF, JPG or PNG — max 5MB
                  </p>
                </div>
              )}
            </div>

            <input
              id="fileInput"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Uploading..." : "Upload & Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UploadPage;
