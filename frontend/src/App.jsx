// RAGClient.js (client-friendly UI)
// Minimal, dependency-free React component that calls your DRF RAG endpoints
// and renders human-readable results for non-technical users.
// Endpoints:
//  - POST http://127.0.0.1:8000/RAG_api/rag/build-from-dir/
//  - POST http://127.0.0.1:8000/RAG_api/rag/build-from-upload/
//  - POST http://127.0.0.1:8000/RAG_api/rag/ask/

import { useMemo, useState } from "react";

const BASE_URL = "http://127.0.0.1:8000";

export default function RAGClient() {
  // API results
  const [buildDirResult, setBuildDirResult] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [askResult, setAskResult] = useState(null);

  // UI state
  const [uploading, setUploading] = useState(false);
  const [building, setBuilding] = useState(false);
  const [asking, setAsking] = useState(false);

  const [question, setQuestion] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [dataPath, setDataPath] = useState("data");

  const [showBuildDirJSON, setShowBuildDirJSON] = useState(false);
  const [showUploadJSON, setShowUploadJSON] = useState(false);
  const [showAskJSON, setShowAskJSON] = useState(false);

  // ------------------------ Helpers ------------------------
  function baseName(p) {
    if (!p) return "";
    const norm = String(p).replaceAll("\\\\", "/");
    return norm.split("/").pop();
  }

  function FriendlyStatus({ ok, message }) {
    if (ok === undefined || ok === null) return null;
    return (
      <div
        className={`rounded-xl border p-3 text-sm ${ok
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-red-200 bg-red-50 text-red-800"
          }`}
      >
        <span className="font-semibold mr-1">
          {ok ? "✓ Success:" : "⚠ Error:"}
        </span>
        {message || (ok ? "Operation completed successfully." : "Something went wrong.")}
      </div>
    );
  }

  function StatRow({ label, value }) {
    return (
      <div className="flex justify-between py-1 border-b border-dashed border-gray-200 text-sm">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
    );
  }

  function BuildStats({ data }) {
    if (!data) return null;
    return (
      <div className="mt-3">
        <div className="font-semibold mb-1">What got prepared?</div>
        <div className="border rounded-xl p-3">
          <StatRow label="Documents processed" value={data?.stats?.documents ?? "-"} />
          <StatRow label="Text chunks created" value={data?.stats?.chunks ?? "-"} />
        </div>
      </div>
    );
  }

  function SourceList({ sources }) {
    if (!Array.isArray(sources) || sources.length === 0) return null;
    return (
      <div className="mt-3">
        <div className="font-semibold mb-1">Where did this answer come from?</div>
        <ul className="list-disc ml-5 text-sm">
          {sources.map((s, i) => (
            <li key={i}>
              <code className="bg-gray-100 px-1 rounded">{baseName(s.source)}</code>
              {s.page !== undefined && <span> — page {s.page}</span>}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function JSONToggle({ open, onToggle, data }) {
    if (!data) return null;
    return (
      <details open={open} onToggle={onToggle} className="mt-3">
        <summary className="cursor-pointer text-blue-600 text-sm">
          Show technical details (JSON)
        </summary>
        <pre className="mt-2 rounded-xl bg-gray-100 p-3 text-xs overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    );
  }

  const hasSelectedFiles = useMemo(() => files.length > 0, [files]);

  // ------------------------ API Calls ------------------------
  async function buildFromDir() {
    try {
      setError("");
      setBuilding(true);
      setBuildDirResult(null);
      const res = await fetch(`${BASE_URL}/api/rag/build-from-dir/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data_path: dataPath }),
      });
      setBuildDirResult(await res.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setBuilding(false);
    }
  }

  async function buildFromUpload(e) {
    e.preventDefault();
    if (!hasSelectedFiles) return setError("Please choose one or more PDF files.");
    try {
      setError("");
      setUploading(true);
      setUploadResult(null);
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      const res = await fetch(`${BASE_URL}/api/rag/build-from-upload/`, {
        method: "POST",
        body: form,
      });
      setUploadResult(await res.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setUploading(false);
    }
  }

  async function askQuestion(e) {
    e.preventDefault();
    if (!question.trim()) return setError("Please enter your question.");
    try {
      setError("");
      setAsking(true);
      setAskResult(null);
      const res = await fetch(`${BASE_URL}/api/rag/ask/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      setAskResult(await res.json());
    } catch (e) {
      setError(String(e));
    } finally {
      setAsking(false);
    }
  }

  // ------------------------ UI ------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            RAG.AI
          </h1>
          <p className="mt-2 text-gray-600">
            Build knowledge from PDFs and ask questions in natural language
          </p>
        </header>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {/* Build from Directory */}
        <section className="rounded-2xl bg-white shadow-sm border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                📁 Build from server folder
              </h2>
              <p className="text-sm text-gray-500">
                Index PDFs already available on the backend
              </p>
            </div>

            <button
              onClick={buildFromDir}
              disabled={building}
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white
                       hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400
                       disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {building ? "Preparing…" : "Build index"}
            </button>
          </div>

          <input
            value={dataPath}
            onChange={(e) => setDataPath(e.target.value)}
            placeholder="Folder path on backend (default: data)"
            className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          {buildDirResult && (
            <div className="space-y-3">
              <FriendlyStatus
                ok={buildDirResult.ok}
                message={buildDirResult.message || buildDirResult.error || buildDirResult.hint}
              />
              <BuildStats data={buildDirResult} />
              <JSONToggle
                open={showBuildDirJSON}
                onToggle={() => setShowBuildDirJSON(!showBuildDirJSON)}
                data={buildDirResult}
              />
            </div>
          )}
        </section>

        {/* Upload PDFs */}
        <section className="rounded-2xl bg-white shadow-sm border p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              📄 Upload PDFs
            </h2>
            <p className="text-sm text-gray-500">
              Add new documents and rebuild the knowledge base
            </p>
          </div>

          <form
            onSubmit={buildFromUpload}
            className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
          >
            <input
              type="file"
              multiple
              accept="application/pdf"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="block w-full text-sm text-gray-600
                       file:mr-4 file:rounded-lg file:border-0
                       file:bg-gray-100 file:px-4 file:py-2
                       file:text-sm file:font-semibold file:text-gray-700
                       hover:file:bg-gray-200"
            />

            <button
              disabled={uploading}
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white
                       hover:bg-gray-800 disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload & build"}
            </button>
          </form>

          {hasSelectedFiles && (
            <div className="text-sm text-gray-500">
              Selected:{" "}
              <span className="font-medium">
                {files.map((f) => f.name).join(", ")}
              </span>
            </div>
          )}

          {uploadResult && (
            <div className="space-y-3">
              <FriendlyStatus
                ok={uploadResult.ok}
                message={uploadResult.message}
              />
              <BuildStats data={uploadResult} />
              <JSONToggle
                open={showUploadJSON}
                onToggle={() => setShowUploadJSON(!showUploadJSON)}
                data={uploadResult}
              />
            </div>
          )}
        </section>

        {/* Ask Question */}
        <section className="rounded-2xl bg-white shadow-sm border p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              💬 Ask a question
            </h2>
            <p className="text-sm text-gray-500">
              Query your documents and get contextual answers
            </p>
          </div>

          <form onSubmit={askQuestion} className="flex gap-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something about the documents…"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5
                       focus:outline-none focus:ring-2 focus:ring-gray-400"
            />

            <button
              disabled={asking}
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white
                       hover:bg-gray-800 disabled:opacity-60"
            >
              {asking ? "Thinking…" : "Ask"}
            </button>
          </form>

          {askResult && (
            <div className="space-y-4">
              <FriendlyStatus ok={askResult.ok} message="Answer generated" />

              {askResult.answer && (
                <div className="rounded-xl border bg-gray-50 p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    🤖 Answer
                  </div>
                  <p className="text-gray-800 leading-relaxed">
                    {askResult.answer}
                  </p>
                </div>
              )}

              <SourceList sources={askResult.sources} />

              <JSONToggle
                open={showAskJSON}
                onToggle={() => setShowAskJSON(!showAskJSON)}
                data={askResult}
              />
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-500">
          Tip: PDFs with clean text work best. You can inspect raw responses via JSON.
        </footer>
      </div>
    </div>
  );
}
