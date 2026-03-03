"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onChange: (val: string | undefined) => void;
  label: string;
  hint?: string;
  /** Max width for compression (default 480) */
  maxW?: number;
  /** Max height for compression (default 600) */
  maxH?: number;
}

/** Compresse une image côté client via Canvas et retourne un data URL JPEG. */
function compressImage(
  file: File,
  maxW = 480,
  maxH = 600,
  quality = 0.82
): Promise<string> {
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
  value,
  onChange,
  label,
  hint,
  maxW = 480,
  maxH = 600,
}: Props) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const isDataUrl = value?.startsWith("data:") ?? false;
  const isUrl     = value && !isDataUrl;

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        setError("Fichier non valide — veuillez choisir une image.");
        return;
      }
      setError(null);
      setLoading(true);
      try {
        const dataUrl = await compressImage(file, maxW, maxH);
        onChange(dataUrl);
      } catch {
        setError("Erreur lors du traitement de l'image.");
      } finally {
        setLoading(false);
      }
    },
    [onChange, maxW, maxH]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = ()                    => setDragging(false);

  return (
    <div>
      <label className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">
        {label}
      </label>

      {/* Aperçu + suppression */}
      {value && (
        <div className="relative mb-3 group w-fit">
          <div className="relative w-24 h-28 rounded-xl overflow-hidden border border-white/10 bg-[#1e1e1e]">
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              sizes="96px"
              unoptimized={isDataUrl}
            />
            {/* Overlay hover pour remplacer */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[10px] font-semibold text-center px-1 leading-tight">
                Cliquer pour<br />remplacer
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-md"
            title="Supprimer l'image"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Zone de drop */}
      <div
        onClick={() => !loading && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 cursor-pointer transition-all text-center select-none",
          dragging
            ? "border-[#C8102E] bg-[#C8102E]/10"
            : "border-white/10 bg-[#1a1a1a] hover:border-white/25 hover:bg-[#222]",
          loading && "pointer-events-none opacity-60"
        )}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
        ) : (
          <>
            {value ? (
              <Upload className="w-5 h-5 text-white/30" />
            ) : (
              <ImageIcon className="w-5 h-5 text-white/20" />
            )}
            <p className="text-white/40 text-xs font-medium leading-snug">
              {value ? "Glisser pour remplacer" : "Glisser une image ici"}
              <span className="block text-white/20 mt-0.5">ou cliquer pour parcourir</span>
            </p>
            {hint && <p className="text-white/20 text-[10px]">{hint}</p>}
          </>
        )}

        {/* Badge format accepté */}
        <span className="absolute bottom-1.5 right-2 text-[9px] text-white/15 font-mono uppercase">
          JPG · PNG · WEBP
        </span>
      </div>

      {error && (
        <p className="mt-1.5 text-red-400 text-xs font-medium">{error}</p>
      )}

      {/* Séparateur URL manuelle */}
      <div className="flex items-center gap-2 mt-3 mb-2">
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-white/20 text-[10px] uppercase tracking-wider">ou URL</span>
        <div className="flex-1 h-px bg-white/5" />
      </div>
      <input
        placeholder="https://..."
        value={isUrl ? value : ""}
        onChange={(e) => {
          setError(null);
          onChange(e.target.value || undefined);
        }}
        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-[#C8102E]/50 transition-colors"
      />

      {/* Input fichier caché */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
