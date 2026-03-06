"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, X, Camera, Film, ZoomIn, Loader2 } from "lucide-react";
import type { MediaVideo, MediaPhoto } from "@/types";

const PHOTO_CATEGORIES = ["Tout", "Match", "Entraînement", "Supporters", "Stade"];

type Tab = "videos" | "photos";

export function MediasClient() {
  const [tab, setTab] = useState<Tab>("videos");
  const [photoFilter, setPhotoFilter] = useState("Tout");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState<MediaVideo[]>([]);
  const [photos, setPhotos] = useState<MediaPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/medias")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos ?? []);
        setPhotos(data.photos ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredPhotos =
    photoFilter === "Tout" ? photos : photos.filter((p) => p.category === photoFilter);

  const lightboxPhoto = photos.find((p) => p.id === lightbox);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Header ── */}
      <div className="bg-[#111] border-b border-white/5 py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#fd0000] text-xs font-semibold uppercase tracking-[0.35em] mb-3">
            Centre Médias
          </p>
          <h1
            className="text-white text-6xl md:text-8xl font-black uppercase leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Médias
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Onglets ── */}
        <div className="flex gap-2 mb-10">
          {([
            { key: "videos", label: "Résumés vidéo", icon: Film },
            { key: "photos", label: "Galerie photos", icon: Camera },
          ] as { key: Tab; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                tab === key
                  ? "bg-[#fd0000] text-white shadow-lg shadow-[#fd0000]/30"
                  : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Vidéos ── */}
        <AnimatePresence mode="wait">
          {tab === "videos" && (
            loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-10 h-10 text-white/30 animate-spin" />
              </div>
            ) : (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, i) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <button
                      onClick={() => setPlayingVideo(video.id)}
                      className="group w-full text-left bg-[#141414] border border-white/5 hover:border-white/15 rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-48 overflow-hidden bg-[#1e1e1e]">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105 brightness-75"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Bouton play */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center transition-all group-hover:bg-[#fd0000] group-hover:border-[#fd0000] group-hover:scale-110">
                            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                        {/* Durée */}
                        <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded">
                          {video.duration}
                        </span>
                      </div>
                      {/* Infos */}
                      <div className="p-4">
                        <p className="text-[#fd0000] text-[10px] font-bold uppercase tracking-widest mb-1">
                          {video.competition}
                        </p>
                        <h3
                          className="text-white font-black text-xl leading-none group-hover:text-[#fd0000] transition-colors"
                          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                        >
                          {video.title}
                        </h3>
                        <p className="text-white/30 text-xs mt-1.5 font-medium">{video.date}</p>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            )
          )}

          {/* ── Photos ── */}
          {tab === "photos" && (
            loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-10 h-10 text-white/30 animate-spin" />
              </div>
            ) : (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Filtres */}
              <div className="flex flex-wrap gap-2 mb-8">
                {PHOTO_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPhotoFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      photoFilter === cat
                        ? "bg-[#fd0000] text-white"
                        : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grille masonry */}
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                {filteredPhotos.map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="break-inside-avoid"
                  >
                    <button
                      onClick={() => setLightbox(photo.id)}
                      className="group relative w-full overflow-hidden rounded-xl block"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.caption}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      {/* Overlay hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                        <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {/* Caption */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-xs font-semibold truncate">{photo.caption}</p>
                        <span className="text-white/50 text-[10px]">{photo.category}</span>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* ── Lightbox photo ── */}
      <AnimatePresence>
        {lightbox && lightboxPhoto && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              onClick={() => setLightbox(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxPhoto.src}
                alt={lightboxPhoto.caption}
                width={1200}
                height={800}
                className="w-full h-auto rounded-xl object-cover"
              />
              <div className="mt-3 text-center">
                <p className="text-white font-semibold">{lightboxPhoto.caption}</p>
                <p className="text-white/40 text-sm">{lightboxPhoto.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal vidéo ── */}
      <AnimatePresence>
        {playingVideo && (() => {
          const video = videos.find((v) => v.id === playingVideo);
          return (
            <motion.div
              key={playingVideo}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPlayingVideo(null)}
            >
              <button
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                onClick={() => setPlayingVideo(null)}
              >
                <X className="w-5 h-5" />
              </button>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-4xl aspect-video bg-[#111] rounded-2xl overflow-hidden border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {video?.youtubeId?.trim() ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <Play className="w-16 h-16 text-white/20 mb-4" />
                    <p className="text-white/40 text-sm font-medium">Vidéo disponible bientôt</p>
                    <p className="text-white/20 text-xs mt-1">Ajoutez l&apos;ID YouTube dans l&apos;admin</p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
