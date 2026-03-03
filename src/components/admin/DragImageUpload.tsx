"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, Check } from "lucide-react";

interface Props {
  value?: string;
  onChange: (val: string | undefined) => void;
  label: string;
  hint?: string;
  maxW?: number;
  maxH?: number;
}

function compressImage(file: File, maxW = 480, maxH = 600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas non disponible"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error("Impossible de lire l'image"));
    img.src = URL.createObjectURL(file);
  });
}

export default function DragImageUpload({ value, onChange, label, hint, maxW = 480, maxH = 600 }: Props) {
  const inputRef               = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const src = value?.trim() || undefined;

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) { setError("Choisissez une image (JPG, PNG, WEBP)."); return; }
    setError(null);
    setLoading(true);
    try { onChange(await compressImage(file, maxW, maxH)); }
    catch { setError("Erreur lors du traitement."); }
    finally { setLoading(false); }
  }, [onChange, maxW, maxH]);

  const onDrop      = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }, [processFiles]);
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

      {/* Label */}
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
        {label}
      </p>
      {hint && <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", margin: 0, marginTop: "-4px" }}>{hint}</p>}

      {/* Aperçu si image présente */}
      {src && (
        <div style={{ position: "relative", width: "100%", height: "120px", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Image src={src} alt={label} fill style={{ objectFit: "cover" }} sizes="300px" unoptimized={src.startsWith("data:")} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
            >
              Remplacer
            </button>
            <button
              type="button"
              onClick={() => onChange(undefined)}
              style={{ background: "rgba(220,38,38,0.4)", border: "1px solid rgba(220,38,38,0.5)", color: "white", padding: "6px", borderRadius: "20px", cursor: "pointer", display: "flex" }}
            >
              <X size={14} />
            </button>
          </div>
          <div style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(34,197,94,0.2)", border: "1px solid rgba(34,197,94,0.4)", borderRadius: "20px", padding: "2px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Check size={10} color="#4ade80" />
            <span style={{ color: "#4ade80", fontSize: "9px", fontWeight: 700 }}>Image chargée</span>
          </div>
        </div>
      )}

      {/* Zone de dépôt */}
      <div
        onClick={() => !loading && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          minHeight: "110px",
          border: `2px dashed ${dragging ? "#fd0000" : "rgba(255,255,255,0.25)"}`,
          borderRadius: "14px",
          background: dragging ? "rgba(253,0,0,0.08)" : "rgba(255,255,255,0.04)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "16px",
          cursor: loading ? "default" : "pointer",
          transition: "all 0.2s",
          userSelect: "none",
        }}
      >
        {loading ? (
          <Loader2 size={28} color="rgba(255,255,255,0.4)" style={{ animation: "spin 1s linear infinite" }} />
        ) : (
          <>
            <div style={{
              width: "44px", height: "44px", borderRadius: "12px",
              background: dragging ? "rgba(253,0,0,0.2)" : "rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <UploadCloud size={22} color={dragging ? "#fd0000" : "rgba(255,255,255,0.4)"} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 600, margin: 0 }}>
                {dragging ? "Relâchez pour uploader" : src ? "Glisser pour remplacer" : "Glisser une image ici"}
              </p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: "4px 0 0" }}>
                ou <span style={{ color: "#fd0000", fontWeight: 700 }}>cliquer pour parcourir</span>
              </p>
              <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "10px", fontFamily: "monospace", margin: "4px 0 0" }}>JPG · PNG · WEBP</p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p style={{ color: "#f87171", fontSize: "12px", fontWeight: 500, margin: 0 }}>{error}</p>
      )}

      {/* URL alternative */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>ou URL directe</span>
        <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
      </div>
      <input
        placeholder="https://example.com/photo.jpg"
        value={src && !src.startsWith("data:") ? src : ""}
        onChange={(e) => { setError(null); onChange(e.target.value.trim() || undefined); }}
        style={{
          width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px", padding: "8px 12px", color: "white", fontSize: "12px", outline: "none",
          boxSizing: "border-box",
        }}
      />

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }}
        onChange={(e) => processFiles(e.target.files)} />
    </div>
  );
}
