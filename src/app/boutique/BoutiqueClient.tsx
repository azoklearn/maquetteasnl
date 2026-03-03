"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { trackShopClick } from "@/lib/analytics";

const PRODUCTS = [
  { id: "p1", name: "Maillot Domicile 2025-26", price: "79,99 €", badge: "Nouveau", color: "#C8102E", url: "#" },
  { id: "p2", name: "Maillot Extérieur 2025-26", price: "79,99 €", badge: "", color: "#FFFFFF", url: "#" },
  { id: "p3", name: "Maillot Third — Édition Centenaire", price: "84,99 €", badge: "Édition limitée", color: "#111", url: "#" },
  { id: "p4", name: "Écharpe Supporters ASNL", price: "19,99 €", badge: "", color: "#C8102E", url: "#" },
  { id: "p5", name: "Survêtement Training 2025-26", price: "64,99 €", badge: "", color: "#C8102E", url: "#" },
  { id: "p6", name: "Pack Supporter Enfant", price: "44,99 €", badge: "Best-seller", color: "#C8102E", url: "#" },
];

export function BoutiqueClient() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#111] border-b border-white/5 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#C8102E] text-xs font-semibold uppercase tracking-[0.35em] mb-3">Collection officielle</p>
          <h1 className="text-white text-6xl md:text-8xl font-black uppercase leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Boutique
          </h1>
          <p className="text-white/50 mt-4 text-base max-w-xl">
            Portez les couleurs de l'ASNL fièrement. Maillots, accessoires et collections exclusives.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group"
            >
              <a
                href={product.url}
                onClick={() => trackShopClick(`boutique_card_${product.id}`)}
                className="block bg-[#141414] hover:bg-[#1A1A1A] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
              >
                {/* Product visual */}
                <div
                  className="h-48 md:h-56 flex items-center justify-center relative"
                  style={{ background: `linear-gradient(135deg, ${product.color}22 0%, #111 100%)` }}
                >
                  {product.badge && (
                    <span className="absolute top-3 right-3 text-[10px] font-black bg-[#C8102E] text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                  <ShoppingBag className="w-16 h-16 text-white/10" />
                </div>

                <div className="p-5">
                  <h3 className="text-white font-bold text-sm md:text-base leading-snug mb-2 group-hover:text-[#C8102E] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-lg font-black" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {product.price}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-white/30 group-hover:text-white/60 transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      Acheter
                    </span>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>

        {/* External shop CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-white/40 text-sm mb-4">Accédez à l'ensemble de notre catalogue</p>
          <a
            href="#"
            onClick={() => trackShopClick("boutique_page_full_catalog")}
            className="inline-flex items-center gap-3 bg-white text-black font-bold text-sm px-8 py-4 rounded-full hover:bg-white/90 transition-colors uppercase tracking-wider"
          >
            <ShoppingBag className="w-5 h-5" />
            Boutique complète
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
