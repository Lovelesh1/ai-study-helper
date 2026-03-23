import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [renameId, setRenameId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes", {
        headers: { Authorization: token },
      });
      setNotes(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch notes");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchNotes();
  }, [token, navigate]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);

  const latestNote = notes.length > 0 ? notes[0] : null;

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      toast.success("PDF selected");
    } else {
      toast.error("Only PDF files are allowed");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title || !file) {
      toast.error("Title and file are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      setLoading(true);

      await api.post("/notes/upload", formData, {
        headers: { Authorization: token },
      });

      setTitle("");
      setFile(null);
      fetchNotes();
      toast.success("Note uploaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (id) => {
    if (!newTitle.trim()) {
      toast.error("Enter title first");
      return;
    }

    try {
      await api.put(
        `/notes/${id}`,
        { title: newTitle },
        {
          headers: { Authorization: token },
        }
      );

      fetchNotes();
      toast.success("Renamed successfully");
      setRenameId(null);
      setNewTitle("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Rename failed");
    }
  };

 const handleDelete = (id) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p className="mb-3 text-sm font-medium text-white">
          Are you sure you want to delete this note?
        </p>

        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await api.delete(`/notes/${id}`, {
                  headers: { Authorization: token },
                });

                fetchNotes();
                toast.success("Note deleted successfully");
              } catch (error) {
                toast.error(error.response?.data?.message || "Delete failed");
              }
              closeToast();
            }}
            className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white"
          >
            Yes
          </button>

          <button
            onClick={closeToast}
            className="rounded-lg bg-slate-600 px-3 py-2 text-sm font-semibold text-white"
          >
            No
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
    }
  );
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMobileMenuOpen(false);
    toast.success("Logout successful");
    setTimeout(() => {
    navigate("/", { replace: true });
  }, 500);
  };
  const hiddenScrollbarStyle = `
  .notes-scroll::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    display: none;
  }
`;


  return (
    
    <div className="h-screen overflow-hidden bg-[#07101d] text-white">
      <style>{hiddenScrollbarStyle}</style>
      
      <div className="mx-auto h-full max-w-[1600px] p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 xl:hidden">
  <button
    onClick={() => setMobileMenuOpen(true)}
    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
  >
    ☰
  </button>

  <div>
    <h2 className="text-base font-semibold text-white">Study Helper</h2>
    <p className="text-xs text-slate-400">AI learning workspace</p>
  </div>

  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold">
    {user?.name?.charAt(0).toUpperCase() || "U"}
  </div>
</div>
{mobileMenuOpen && (
  <div
    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
    onClick={() => setMobileMenuOpen(false)}
  />
)}
       <div className="grid h-full grid-cols-1 items-start gap-6 xl:grid-cols-[320px_1fr]">
  <aside
  className={`fixed left-0 top-0 z-50 h-screen w-[85%] max-w-[320px] rounded-r-[32px] border-r border-white/10 bg-[linear-gradient(180deg,#0b1322,#09111d)] shadow-[0_24px_70px_rgba(0,0,0,0.40)] overflow-y-auto transition-transform duration-300 xl:static xl:z-auto xl:h-auto xl:w-auto xl:max-w-none xl:rounded-[32px] xl:border xl:border-white/10 xl:shadow-[0_24px_70px_rgba(0,0,0,0.40)] ${
    mobileMenuOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
  }`}
>
  <div className="h-full p-5 sm:p-6 flex flex-col">
    <div className="mb-4 flex items-center justify-between xl:hidden">
  <h2 className="text-lg font-semibold text-white">Menu</h2>
  <button
    onClick={() => setMobileMenuOpen(false)}
    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
  >
    ✕
  </button>
</div>
   <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5 pb-6 shadow-lg">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />

      <div className="relative flex items-start gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-xl font-bold text-white shadow-[0_10px_25px_rgba(34,211,238,0.28)]">
          AI
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Study Helper
          </h1>
          <p className="text-sm text-slate-300">
            Premium learning workspace
          </p>
        </div>
      </div>

     <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
  
  {/* Avatar */}
  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 text-sm font-bold text-white">
    {user?.name?.charAt(0).toUpperCase() || "U"}
  </div>

  {/* Info */}
  <div className="min-w-0">
    <p className="text-sm font-semibold text-white truncate">
      {user?.name || "User"}
    </p>
    <p className="text-[11px] text-slate-400 truncate">
      {user?.email || "No email"}
    </p>
  </div>

</div>
    </div>

    <div className="mt-5 grid gap-3">
      <div className="rounded-2xl border border-cyan-400/10 bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(59,130,246,0.08))] p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
              Total Notes
            </p>
            <h3 className="mt-2 text-3xl font-bold text-white">
              {notes.length}
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-xl">
            📚
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-violet-400/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.14),rgba(217,70,239,0.08))] p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
              Visible Results
            </p>
            <h3 className="mt-2 text-3xl font-bold text-white">
              {filteredNotes.length}
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/15 text-xl">
            🔎
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-400/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.14),rgba(20,184,166,0.08))] p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
              AI Status
            </p>
            <h3 className="mt-2 text-lg font-semibold text-emerald-400">
              Ready
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-xl">
            ⚡
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-400/10 bg-[linear-gradient(135deg,rgba(245,158,11,0.14),rgba(249,115,22,0.08))] p-4 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
              Latest Note
            </p>
            <h3 className="mt-2 text-sm font-medium break-words text-slate-200">
              {latestNote?.title || "No notes yet"}
            </h3>
          </div>
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-xl">
            📝
          </div>
        </div>
      </div>
    </div>

    <div className="mt-6">
      <button
        onClick={handleLogout}
        className="w-full rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(244,63,94,0.25)] transition hover:scale-[1.01]"
      >
        Logout
      </button>
    </div>
  </div>
</aside>

         <main className="min-w-0 h-full overflow-y-auto space-y-6 pr-1 notes-scroll">
         
         <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(17,24,39,0.92),rgba(30,41,59,0.88))] px-5 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl">
  <div className="absolute -top-10 left-0 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
  <div className="absolute -bottom-10 right-0 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />

  <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
        Welcome 
      </p>

      <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white">
        Hello,{" "}
        <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent font-bold">
          {user?.name || "User"}
        </span>
      </h2>

      <p className="mt-2 max-w-2xl text-sm text-slate-400 leading-6">
        Manage your study notes, generate AI summaries, and test your learning
        with a smoother, smarter workflow.
      </p>
    </div>

    <div className="flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400"></span>
      </span>

      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
          Workspace Status
        </p>
        <p className="text-sm font-medium text-emerald-300">
          AI Ready
        </p>
      </div>
    </div>
  </div>
</section>
            <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,19,34,0.98),rgba(8,14,26,0.98))] shadow-[0_20px_60px_rgba(0,0,0,0.30)] overflow-hidden">
  <div className="border-b border-white/10 px-5 py-5 sm:px-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium text-cyan-300">Upload Workspace</p>
        <h3 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Add New Study Note
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-slate-400 leading-6">
          Upload your PDF, keep your study notes organized, and generate AI-powered
          summaries and quizzes in one clean workflow.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
          Selected File
        </p>
        <p className="mt-1 max-w-[240px] truncate text-sm font-medium text-white">
          {file ? file.name : "No file selected"}
        </p>
      </div>
    </div>
  </div>

  <div className="px-5 py-6 sm:px-6">
    <div className="grid gap-5 xl:grid-cols-[1fr_1.15fr]">
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Note Title
        </label>

        <input
          type="text"
          placeholder="Enter a clean title for your note"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3.5 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
        />

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">
            Tips
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>• Use short and clear note titles</li>
            <li>• Upload PDF only for best AI support</li>
            <li>• Smaller files usually process faster</li>
          </ul>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5">
        <label className="mb-2 block text-sm font-medium text-slate-300">
          PDF File
        </label>

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="rounded-[26px] border-2 border-dashed border-cyan-400/20 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-2xl">
            📄
          </div>

          <p className="mt-4 text-base font-semibold text-white">
            Drag & drop your PDF here
          </p>
          <p className="mt-1 text-sm text-slate-400">
            or choose a file manually from your device
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-5 w-full rounded-2xl border border-white/10 bg-white/8 p-3 text-sm outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-white"
          />

          {file && (
            <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300 break-all">
              Selected: {file.name}
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-400">
        Supported format: <span className="font-medium text-slate-200">PDF</span>
      </p>

      <button
        type="submit"
        onClick={handleUpload}
        disabled={loading}
        className="w-full sm:w-[190px] rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)] transition hover:opacity-95 disabled:opacity-50"
      >
        {loading ? "Uploading PDF..." : "Upload Note"}
      </button>
    </div>
  </div>
</section>

            <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,19,34,0.98),rgba(8,14,26,0.98))] shadow-[0_20px_60px_rgba(0,0,0,0.30)] overflow-hidden">
              <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyan-300">
                      Notes Library
                    </p>
                    <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
                      Your Notes Collection
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                      Search, manage, open, summarize, quiz, and update your notes.
                    </p>
                  </div>

                  <div className="w-full lg:w-80">
                    <label className="mb-2 block text-sm text-slate-300">
                      Search Notes
                    </label>
                    <input
                      type="text"
                      placeholder="Search by title..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/40"
                    />
                  </div>
                </div>
              </div>

             <div
  className="h-[620px] overflow-y-auto px-5 py-5 pb-8 sm:px-6 notes-scroll"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <style>{`
  .notes-scroll {
    scroll-behavior: smooth;
  }

  .notes-scroll::-webkit-scrollbar {
    width: 8px;
  }

  .notes-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .notes-scroll::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.22);
    border-radius: 999px;
  }

  .notes-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.38);
  }
`}</style>

                {filteredNotes.length === 0 ? (
                  <div className="flex h-full min-h-[400px] items-center justify-center">
                    <div className="w-full max-w-md rounded-[28px] border border-dashed border-white/10 bg-white/5 px-6 py-12 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
                        {searchTerm ? "🔍" : "📂"}
                      </div>
                      <h3 className="mt-4 text-xl font-semibold">
                        {searchTerm ? "No matching notes found" : "No notes uploaded yet"}
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {searchTerm
                          ? "Try another keyword."
                          : "Upload your first study note to begin."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {filteredNotes.map((note) => (
                      <div
                        key={note._id}
                        className="flex min-h-[440px] flex-col justify-between rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20"
                      >
                        <div>
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-2xl">
                              📘
                            </div>

                            <span className="rounded-full border border-cyan-400/10 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-cyan-300">
                              Study PDF
                            </span>
                          </div>

                          <h3 className="text-xl font-semibold leading-7 text-white break-words">
                            {note.title}
                          </h3>

                          {renameId === note._id && (
                            <div className="mt-4 space-y-3">
                              <input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                                placeholder="Enter new title"
                              />
                              <button
                                onClick={() => handleRename(note._id)}
                                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-md"
                              >
                                Save New Title
                              </button>
                            </div>
                          )}

                          <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                              File Name
                            </p>
                            <p className="mt-2 break-all text-sm text-slate-200">
                              {note.fileUrl.split("/").pop()}
                            </p>
                          </div>

                          <p className="mt-4 text-xs text-slate-400">
                            Uploaded: {new Date(note.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="mt-6 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => window.open(note.fileUrl, "_blank")}
                              className="rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]"
                            >
                              Open File
                            </button>

                            <button
                              onClick={() => {
                                setRenameId(note._id);
                                setNewTitle(note.title);
                              }}
                              className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]"
                            >
                              Rename
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => {
                                setLoadingId(note._id + "-summary");
                                navigate(`/summary/${note._id}`);
                              }}
                              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]"
                            >
                              {loadingId === note._id + "-summary"
                                ? "Opening..."
                                : "Summary"}
                            </button>

                            <button
                              onClick={() => {
                                setLoadingId(note._id + "-quiz");
                                navigate(`/quiz/${note._id}`);
                              }}
                              className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]"
                            >
                              {loadingId === note._id + "-quiz" ? "Opening..." : "Quiz"}
                            </button>
                          </div>

                          <button
                            onClick={() => handleDelete(note._id)}
                            className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]"
                          >
                            Delete Note
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;