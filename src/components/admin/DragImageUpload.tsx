"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, CheckCircle } from "lucide-react";

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

export default function DragImageUpload({
  value, onChange, label, hint, maxW = 480, maxH = 600,
}: Props) {
  const inputRef              = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const src = value?.trim() || undefined;

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setError("Fichier invalide — choisissez une image (JPG, PNG, WEBP).");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      onChange(await compressImage(file, maxW, maxH));
    } catch {
      setError("Erreur lors du traitement de l'image.");
    } finally {
      setLoading(false);
    }
  }, [onChange, maxW, maxH]);

  const onDrop      = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }, [processFiles]);
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDragEnd   = () => setDragging(false);

  return (
    <div className="flex flex-col gap-2">

      {/* Label */}
      <p className="text-white/50 text-xs font-bold uppercase tracking-wider">{label}</p>
      {hint && <p className="text-white/30 text-[10px] -mt-1">{hint}</p>}

      {/* Zone principale */}
      <div
        onClick={() => !loading && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDragEnd={onDragEnd}
        style={{ cursor: loading ? "default" : "pointer" }}
        className={[
          "relative min-h-[120px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 p-4 transition-all duration-200 overflow-hidden",
          dragging
            ? "border-[#fd0000] bg-[#fd0000]/15 scale-[1.01]"
            : src
            ? "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/8"
            : "border-white/25 bg-white/[0.04] hover:border-white/40 hover:bg-white/[0.07]",
        ].join(" ")}
      >
        {/* Aperçu si image chargée */}
        {src && !loading && (
          <div className="relative w-full h-28 rounded-xl overflow-hidden">
            <Image
              src={src}
              alt={label}
              fill
              className="object-cover"
              sizes="240px"
              unoptimized={src.startsWith("data:")}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full">
                Cliquer pour remplacer
              </span>
            </div>
          </div>
        )}

        {/* Icône / spinner */}
        {loading ? (
          <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
        ) : src ? (
          <div className="flex items-center gap-2 text-green-400 text-xs font-semibold">
            <CheckCircle className="w-4 h-4" />
            Image chargée
          </div>
        ) : (
          <>
            <div className={[
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
              dragging ? "bg-[#fd0000]/30" : "bg-white/10",
            ].join(" ")}>
              <UploadCloud className={["w-6 h-6 transition-colors", dragging ? "text-[#fd0000]" : "text-white/40"].join(" ")} />
            </div>
            <div className="text-center">
              <p className="text-white/60 text-sm font-semibold">
                {dragging ? "Relâchez pour uploader" : "Glissez une image ici"}
              </p>
              <p className="text-white/30 text-xs mt-0.5">ou cliquez pour parcourir</p>
              <p className="text-white/20 text-[10px] mt-1 font-mono">JPG · PNG · WEBP</p>
            </div>
          </>
        )}
      </div>

      {/* Bouton supprimer */}
      {src && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(undefined); }}
          className="flex items-center gap-1.5 self-start text-red-400/70 hover:text-red-400 text-xs font-semibold transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Supprimer l&apos;image
        </button>
      )}

      {/* Message d'erreur */}
      {error && <p className="text-red-400 text-xs font-medium">{error}</p>}

      {/* Champ URL alternative */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-white/20 text-[10px] font-mono uppercase tracking-wider shrink-0">ou URL directe</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>
      <input
        placeholder="https://example.com/photo.jpg"
        value={src && !src.startsWith("data:") ? src : ""}
        onChange={(e) => { setError(null); onChange(e.target.value.trim() || undefined); }}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-[#fd0000]/60 transition-colors"
      />

      {/* Input fichier caché */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => processFiles(e.target.files)}
      />
    </div>
  );
}
