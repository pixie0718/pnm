"use client";

import { useRef, useState, DragEvent } from "react";
import { Upload, Link2, X, Loader2, ImageIcon } from "lucide-react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label: string;
  hint?: string;
  aspectHint?: string;
};

export default function ImageUpload({ value, onChange, label, hint, aspectHint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function uploadFile(file: File) {
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(data.error ?? "Upload failed");
    } else {
      onChange(data.url);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-midnight-700 flex items-center gap-1.5">
          <ImageIcon size={13} /> {label}
          {hint && <span className="text-midnight-400 font-normal">({hint})</span>}
        </label>
        {/* Tab toggle */}
        <div className="flex rounded-xl border border-midnight-200 overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`px-3 py-1.5 font-semibold transition ${tab === "upload" ? "bg-saffron-500 text-white" : "bg-white text-midnight-500 hover:bg-midnight-50"}`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setTab("url")}
            className={`px-3 py-1.5 font-semibold transition ${tab === "url" ? "bg-saffron-500 text-white" : "bg-white text-midnight-500 hover:bg-midnight-50"}`}
          >
            URL
          </button>
        </div>
      </div>

      {tab === "url" ? (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-midnight-400" />
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
              className="w-full pl-9 pr-4 py-3 rounded-2xl border border-midnight-200 bg-white text-midnight-900 placeholder:text-midnight-400 focus:outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-400/20 transition text-sm"
            />
          </div>
          {value && (
            <button type="button" onClick={() => onChange("")} className="w-11 h-11 rounded-2xl bg-red-50 text-red-400 hover:bg-red-100 grid place-items-center transition">
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragging(false)}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition ${
            dragging ? "border-saffron-400 bg-saffron-50" : "border-midnight-200 hover:border-saffron-300 hover:bg-saffron-50/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Preview */}
          {value && !uploading ? (
            <div className="relative group">
              <img
                src={value}
                alt="Preview"
                className="w-full h-48 object-cover rounded-2xl"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-2xl flex items-center justify-center gap-3">
                <span className="text-white text-sm font-semibold flex items-center gap-1.5">
                  <Upload size={15} /> Click to replace
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onChange(""); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-red-500 text-white grid place-items-center hover:bg-red-600 transition"
                >
                  <X size={14} />
                </button>
              </div>
              {aspectHint && (
                <span className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded-lg">{aspectHint}</span>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
              {uploading ? (
                <>
                  <Loader2 size={32} className="text-saffron-500 animate-spin" />
                  <p className="text-sm font-semibold text-midnight-600">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-saffron-500/10 text-saffron-500 grid place-items-center">
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-midnight-700">
                      Drop image here or <span className="text-saffron-600">click to browse</span>
                    </p>
                    <p className="text-xs text-midnight-400 mt-1">JPEG, PNG, WebP, GIF · max 5 MB{aspectHint ? ` · ${aspectHint}` : ""}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <X size={12} /> {error}
        </p>
      )}
    </div>
  );
}
