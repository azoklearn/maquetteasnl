"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { StaffMember } from "@/types";
import AdminShell from "@/components/admin/AdminShell";
import SaveButton from "@/components/admin/SaveButton";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  initialData: StaffMember[];
  username: string;
}

const FIELD = "bg-[#1a1a1a] border border-white/10 focus:border-[#fd0000] focus:outline-none rounded-xl px-4 py-3 text-white text-sm w-full transition-colors placeholder-white/20";
const LABEL = "block text-white/50 text-xs font-bold uppercase tracking-wider mb-2";

export default function StaffEditor({ initialData, username }: Props) {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>(initialData);

  useEffect(() => setStaff(initialData), [initialData]);

  function update(id: string, field: keyof StaffMember, value: string) {
    setStaff((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  }

  function add() {
    const id = `s_${Date.now()}`;
    setStaff((prev) => [
      ...prev,
      { id, name: "Nouveau membre", role: "Rôle à définir" },
    ]);
  }

  async function remove(id: string) {
    const next = staff.filter((m) => m.id !== id);
    setStaff(next);
    await save(next);
  }

  async function save(data = staff) {
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "staff", data }),
    });
    if (!res.ok) throw new Error();
    router.refresh();
  }

  return (
    <AdminShell username={username}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1
              className="text-white font-black text-3xl uppercase tracking-wider"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Staff & coach
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {staff.length} membre{staff.length > 1 ? "s" : ""} dans le staff technique.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={add}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" /> Ajouter un membre
            </button>
            <SaveButton onSave={() => save()} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {staff.map((member) => (
            <div
              key={member.id}
              className="bg-[#161616] rounded-2xl border border-white/5 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Nom</label>
                    <input
                      className={FIELD}
                      value={member.name}
                      onChange={(e) => update(member.id, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={LABEL}>Rôle</label>
                    <input
                      className={FIELD}
                      value={member.role}
                      onChange={(e) => update(member.id, "role", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm("Supprimer ce membre du staff ?")) remove(member.id);
                }}
                className="p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors self-stretch sm:self-auto"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {staff.length === 0 && (
            <div className="text-center py-16 text-white/30">
              <p>Aucun membre de staff. Clique sur « Ajouter un membre » pour commencer.</p>
            </div>
          )}
        </div>

        {staff.length > 0 && (
          <div className="mt-6 flex justify-end">
            <SaveButton onSave={() => save()} />
          </div>
        )}
      </div>
    </AdminShell>
  );
}

