"use client";

import { useState, useEffect, useRef } from "react";
import API from "@/lib/api";

import CodeEditor from "@/components/CodeEditor";
import LanguageSelector from "@/components/LanguageSelector";
import { Play, Loader2, Terminal } from "lucide-react";
import { getUserId } from "@/contexts/AuthDetails";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/components/Toast";

export default function CodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditMode = !!id;

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [title, setTitle] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const submittingRef = useRef(false);
  // 🔹 Get logged user id
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch {
        console.error("Failed to fetch user ID");
      }
    };
    fetchUserId();
  }, []);

  // 🔹 Load saved code if editing
  useEffect(() => {
    if (!isEditMode) return;

    const fetchSavedCode = async () => {
      try {
        setPageLoading(true);
        const res = await API.get(`/code/saved/${id}`);
        setCode(res.data.code);
        setLanguage(res.data.language);
        setTitle(res.data.title);
      } catch {
        showToast("Failed to load saved code", "error");
      } finally {
        setPageLoading(false);
      }
    };

    fetchSavedCode();
  }, [id, isEditMode]);

  // 🔹 Reset submit eligibility whenever code or language changes
  useEffect(() => {
    setCanSubmit(false);
  }, [code, language]);

  // 🔥 Run Code (returns boolean success)
  const runCode = async () => {
    if (!code.trim()) {
      showToast("Code cannot be empty", "error");
      return;
    }

    try {
      setLoading(true);
      setOutput("");
      setCanSubmit(false);

      const languageMap: Record<string, number> = {
        python: 71,
        javascript: 63,
        cpp: 54,
        java: 62,
      };

      const languageId = languageMap[language];

      if (!languageId) {
        showToast("Unsupported language", "error");
        return false;
      }

      const res = await API.post("/code/run", {
        code,
        language_id: languageId,
        language_name: language,
      });

      const result = res.data?.output || "No output.";
      setOutput(result);

      /* ================= ERROR DETECTION ================= */

      const errorPatterns = [
        /traceback/i,
        /error:/i,
        /exception/i,
        /syntaxerror/i,
        /nameerror/i,
        /typeerror/i,
        /valueerror/i,
        /runtimeerror/i,
        /compileerror/i,
        /^error/i,
      ];

      const hasOutputError = errorPatterns.some((pattern) =>
        pattern.test(result),
      );

      if (res.data?.error || hasOutputError) {
        setCanSubmit(false);
        return false;
      }

      // ✅ No errors
      setCanSubmit(true);
      return true;
    } catch (error: any) {
      setOutput("Error running code.");
      showToast(error?.response?.data?.message || "Execution failed", "error");
      setCanSubmit(false);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const submitCode = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await API.post("/code/submit", {
        userId,
        code,
        language,
      });

      showToast(`${res.data.message}`, "success");
      router.push("/dashboard");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Submission failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Save or Update
  const saveCode = async () => {
    if (!title.trim()) {
      showToast("Please enter a title", "error");
      return;
    }

    try {
      setSaving(true);

      if (isEditMode) {
        await API.put(`/code/saved/${id}`, {
          code,
          language,
          title,
        });
        showToast("Code updated successfully", "success");
      } else {
        await API.post("/code/save", {
          userId,
          code,
          language,
          title,
        });
        showToast("Code saved successfully", "success");
      }

      setShowSaveModal(false);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Error", "error");
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="p-6 flex items-center gap-2">
        <Loader2 className="animate-spin" />
        Loading saved code...
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit Saved Code" : "Coding Challenge"}
        </h1>
      </div>

      {/* Language + Buttons */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="w-full md:w-auto">
          <LanguageSelector language={language} setLanguage={setLanguage} />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
          {/* Run */}
          <button
            onClick={runCode}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
              text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
              disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Play size={16} />
            )}
            <span className="hidden sm:inline">Run Code</span>
            <span className="sm:hidden">Run</span>
          </button>

          {/* Submit */}
          <button
            onClick={submitCode}
            type="button"
            disabled={!canSubmit || loading}
            title={
              !canSubmit ? "Run your code successfully before submitting" : ""
            }
            className="flex items-center justify-center px-5 py-2.5 rounded-lg
              text-sm font-medium text-white bg-green-600 hover:bg-green-700
              disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Submit
          </button>

          {/* Save */}
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg
              text-sm font-medium text-white
              bg-gradient-to-r from-orange-500 to-blue-600
              hover:opacity-90 transition shadow-md"
          >
            <span className="hidden sm:inline">
              {isEditMode ? "Update" : "Save"}
            </span>
            <span className="sm:hidden">{isEditMode ? "Update" : "💾"}</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <CodeEditor code={code} setCode={setCode} language={language} />
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Update Code" : "Save Code"}
            </h2>

            <input
              type="text"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={saveCode}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 flex items-center gap-2"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {isEditMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Output */}
      {(output || loading) && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Terminal size={18} />
            <h2 className="text-lg font-semibold">Output</h2>
          </div>

          <div className="bg-black text-green-400 rounded-xl p-5 text-sm font-mono min-h-[120px]">
            {loading ? "Running..." : output}
          </div>
        </div>
      )}
    </div>
  );
}
