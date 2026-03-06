"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { MediaVideo, MediaPhoto } from "@/types";
import AdminShell from "@/components/admin/AdminShell";
import SaveButton from "@/components/admin/SaveButton";
import { Plus, Trash2, ChevronDown, ChevronUp, Film, Camera } from "lucide-react";
import DragImageUpload from "@/components/admin/DragImageUpload";

interface Props {
  initialVideos: MediaVideo[];
  initialPhotos: MediaPhoto[];
  username: string;
}

const FIELD = "bg-[#1a1a1a] border border-white/10 focus:border-[#fd0000] focus:outline-none rounded-xl px-4 py-3 text-white text-sm w-full transition-colors placeholder-white/20";
const LABEL = "block text-white/50 text-xs font-bold uppercase tracking-wider mb-2";

const PHOTO_CATEGORIES = ["Match", "Entraînement", "Supporters", "Stade"];

function newVideo(): MediaVideo {
  const id = "v" + Date.now();
  return {
    id,
    title: "Nouvelle vidéo",
    competition: "Ligue 2 BKT",
    date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
    duration: "0:00",
    youtubeId: "",
  };
}

function newPhoto(): MediaPhoto {
  const id = "p" + Date.now();
  return {
    id,
    src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=85",
    caption: "Nouvelle photo",
    category: "Match",
  };
}

export default function MediasEditor({ initialVideos, initialPhotos, username }: Props) {
  const router = useRouter();
  const [videos, setVideos] = useState<MediaVideo[]>(initialVideos);
  const [photos, setPhotos] = useState<MediaPhoto[]>(initialPhotos);
  const [tab, setTab] = useState<"videos" | "photos">("videos");
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  useEffect(() => {
    setVideos(initialVideos);
    setPhotos(initialPhotos);
  }, [initialVideos, initialPhotos]);

  function updateVideo(id: string, field: keyof MediaVideo, value: string) {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  }

  function updatePhoto(id: string, field: keyof MediaPhoto, value: string) {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  async function removeVideo(id: string) {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "mediaVideos", data: updated }),
    });
    if (res.ok) router.refresh();
  }

  async function removePhoto(id: string) {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "mediaPhotos", data: updated }),
    });
    if (res.ok) router.refresh();
  }

  async function save() {
    const [resV, resP] = await Promise.all([
      fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "mediaVideos", data: videos }),
      }),
      fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: "mediaPhotos", data: photos }),
      }),
    ]);
    if (resV.ok && resP.ok) router.refresh();
    else throw new Error();
  }

  return (
    <AdminShell username={username}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-white font-black text-3xl uppercase tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Médias
            </h1>
            <p className="text-white/40 text-sm mt-1">
              {videos.length} vidéo{videos.length > 1 ? "s" : ""} · {photos.length} photo{photos.length > 1 ? "s" : ""}
            </p>
          </div>
          <SaveButton onSave={save} />
        </div>

        {/* Onglets */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("videos")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === "videos" ? "bg-[#fd0000] text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            <Film className="w-4 h-4" /> Vidéos
          </button>
          <button
            onClick={() => setTab("photos")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === "photos" ? "bg-[#fd0000] text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            <Camera className="w-4 h-4" /> Photos
          </button>
        </div>

        {/* Vidéos */}
        {tab === "videos" && (
          <div className="space-y-3">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  const v = newVideo();
                  setVideos((prev) => [v, ...prev]);
                  setExpandedVideo(v.id);
                }}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Nouvelle vidéo
              </button>
            </div>
            {videos.map((video) => {
              const open = expandedVideo === video.id;
              return (
                <div key={video.id} className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
                    onClick={() => setExpandedVideo(open ? null : video.id)}
                  >
                    <div className="w-16 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                      <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{video.title}</p>
                      <p className="text-white/40 text-xs">{video.competition} · {video.date}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Supprimer cette vidéo ?")) removeVideo(video.id);
                        }}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                    </div>
                  </button>
                  {open && (
                    <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                      <div>
                        <label className={LABEL}>Titre</label>
                        <input className={FIELD} value={video.title} onChange={(e) => updateVideo(video.id, "title", e.target.value)} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={LABEL}>Compétition</label>
                          <input className={FIELD} value={video.competition} onChange={(e) => updateVideo(video.id, "competition", e.target.value)} placeholder="Ligue 2 BKT · J24" />
                        </div>
                        <div>
                          <label className={LABEL}>Date</label>
                          <input className={FIELD} value={video.date} onChange={(e) => updateVideo(video.id, "date", e.target.value)} placeholder="22 fév. 2025" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={LABEL}>Durée</label>
                          <input className={FIELD} value={video.duration} onChange={(e) => updateVideo(video.id, "duration", e.target.value)} placeholder="4:32" />
                        </div>
                        <div>
                          <label className={LABEL}>ID YouTube</label>
                          <input className={FIELD} value={video.youtubeId} onChange={(e) => updateVideo(video.id, "youtubeId", e.target.value)} placeholder="dQw4w9WgXcQ" />
                        </div>
                      </div>
                      <div>
                        <DragImageUpload
                          label="Miniature (thumbnail)"
                          hint="Image affichée sur la carte vidéo"
                          value={video.thumbnail}
                          onChange={(v) => updateVideo(video.id, "thumbnail", v ?? "")}
                          maxW={800}
                          maxH={450}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Photos */}
        {tab === "photos" && (
          <div className="space-y-3">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  const p = newPhoto();
                  setPhotos((prev) => [p, ...prev]);
                  setExpandedPhoto(p.id);
                }}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" /> Nouvelle photo
              </button>
            </div>
            {photos.map((photo) => {
              const open = expandedPhoto === photo.id;
              return (
                <div key={photo.id} className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
                    onClick={() => setExpandedPhoto(open ? null : photo.id)}
                  >
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
                      <img src={photo.src} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{photo.caption}</p>
                      <p className="text-white/40 text-xs">{photo.category}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm("Supprimer cette photo ?")) removePhoto(photo.id);
                        }}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                    </div>
                  </button>
                  {open && (
                    <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                      <div>
                        <label className={LABEL}>Légende</label>
                        <input className={FIELD} value={photo.caption} onChange={(e) => updatePhoto(photo.id, "caption", e.target.value)} />
                      </div>
                      <div>
                        <label className={LABEL}>Catégorie</label>
                        <select className={FIELD} value={photo.category} onChange={(e) => updatePhoto(photo.id, "category", e.target.value)}>
                          {PHOTO_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <DragImageUpload
                          label="Image"
                          hint="Photo de la galerie"
                          value={photo.src}
                          onChange={(v) => updatePhoto(photo.id, "src", v ?? "")}
                          maxW={1200}
                          maxH={800}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <SaveButton onSave={save} />
        </div>
      </div>
    </AdminShell>
  );
}
