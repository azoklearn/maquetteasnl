"use client";

import { useState } from "react";
import { Save, Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "idle" | "saving" | "saved" | "error";

interface Props {
  onSave: () => Promise<void>;
  label?: string;
  className?: string;
}

export default function SaveButton({ onSave, label = "Enregistrer", className }: Props) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    setStatus("saving");
    try {
      await onSave();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const icon = {
    idle:   <Save className="w-4 h-4" />,
    saving: <Loader2 className="w-4 h-4 animate-spin" />,
    saved:  <Check className="w-4 h-4" />,
    error:  <AlertCircle className="w-4 h-4" />,
  }[status];

  const text = {
    idle:   label,
    saving: "Enregistrement…",
    saved:  "Enregistré !",
    error:  "Erreur, réessaie",
  }[status];

  return (
    <button
      onClick={handleClick}
      disabled={status === "saving"}
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all",
        status === "saved"  && "bg-green-500 text-white",
        status === "error"  && "bg-red-500 text-white",
        status === "saving" && "bg-[#C8102E]/70 text-white cursor-wait",
        (status === "idle") && "bg-[#C8102E] text-white hover:bg-[#A00C24]",
        "disabled:opacity-60",
        className,
      )}
    >
      {icon}
      {text}
    </button>
  );
}
