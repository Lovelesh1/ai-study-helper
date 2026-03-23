import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function Summary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get(`/ai/summary/${id}`, {
          headers: { Authorization: token },
        });
        setSummary(res.data.summary);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [id, token]);

  const handleDownload = () => {
    if (!summary) return;

    const blob = new Blob([summary], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "summary.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
    toast.success("Summary downloaded");
  };

  const handleCopy = () => {
    if (!summary) return;

    navigator.clipboard.writeText(summary);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl font-medium"
        >
          Back
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">AI Summary</h1>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              disabled={!summary}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 px-4 py-2 rounded-xl text-sm font-semibold"
            >
              Copy
            </button>

            <button
              onClick={handleDownload}
              disabled={!summary}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 px-4 py-2 rounded-xl text-sm font-semibold"
            >
              Download
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
  <div className="h-4 w-40 rounded bg-white/10"></div>
  <div className="h-4 w-full rounded bg-white/10"></div>
  <div className="h-4 w-11/12 rounded bg-white/10"></div>
  <div className="h-4 w-10/12 rounded bg-white/10"></div>
  <div className="h-4 w-9/12 rounded bg-white/10"></div>
</div>
        ) : (
         <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-5 whitespace-pre-line text-slate-200 leading-7">
  {summary || "No summary available for this note yet."}
</div>
        )}
      </div>
    </div>
  );
}

export default Summary;