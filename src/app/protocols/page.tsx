"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Clock, Search, Star } from "lucide-react";
import NavBar from "@/components/NavBar";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_DOT,
  PROTOCOLS,
  type Category,
  type Protocol,
} from "@/lib/protocols";

const DIFFICULTY_COLOR: Record<string, string> = {
  Basic: "text-emerald-400",
  Intermediate: "text-amber-400",
  Advanced: "text-red-400",
};

function ProtocolCard({ protocol }: { protocol: Protocol }) {
  return (
    <Link
      href={`/scan?protocol=${protocol.id}`}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-cyan-500/40 hover:bg-white/8"
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="text-2xl">{protocol.icon}</span>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[protocol.category]}`}
        >
          {protocol.category}
        </span>
      </div>

      <h3 className="mb-1 font-semibold text-white group-hover:text-cyan-300 transition-colors">
        {protocol.name}
      </h3>
      <p className="mb-3 text-xs leading-relaxed text-slate-400 line-clamp-2">
        {protocol.indication}
      </p>

      <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {protocol.estimatedTime}
          </span>
          <span className={DIFFICULTY_COLOR[protocol.difficulty]}>{protocol.difficulty}</span>
        </div>
        <ChevronRight size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
      </div>
    </Link>
  );
}

export default function ProtocolsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["efast", "cardiac-plax"]));

  const filtered = PROTOCOLS.filter((p) => {
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.indication.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteProtocols = PROTOCOLS.filter((p) => favorites.has(p.id));

  function toggleFavorite(id: string, e: React.MouseEvent) {
    e.preventDefault();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-16" style={{ background: "#0a0f1e" }}>
      <NavBar />

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">Protocol Library</h1>
          <p className="text-slate-400">
            Select a protocol to begin your AI-guided ultrasound analysis.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search protocols, indications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
          />
        </div>

        {/* Category filter */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory("All")}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeCategory === "All"
                ? "bg-cyan-500 text-white"
                : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            All ({PROTOCOLS.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = PROTOCOLS.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-cyan-500 text-white"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${CATEGORY_DOT[cat]}`} />
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Favorites */}
        {favoriteProtocols.length > 0 && activeCategory === "All" && search === "" && (
          <section className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <h2 className="text-sm font-semibold text-slate-300">Favorites</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {favoriteProtocols.map((p) => (
                <div key={p.id} className="relative">
                  <button
                    onClick={(e) => toggleFavorite(p.id, e)}
                    className="absolute right-3 top-3 z-10 text-amber-400"
                  >
                    <Star size={14} className="fill-amber-400" />
                  </button>
                  <ProtocolCard protocol={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Protocol grid */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300">
              {activeCategory === "All" ? "All Protocols" : activeCategory} ({filtered.length})
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-500">No protocols found for &ldquo;{search}&rdquo;</p>
              <button
                onClick={() => setSearch("")}
                className="mt-2 text-sm text-cyan-400 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {filtered.map((p) => (
                <div key={p.id} className="relative">
                  <button
                    onClick={(e) => toggleFavorite(p.id, e)}
                    className="absolute right-3 top-3 z-10"
                  >
                    <Star
                      size={14}
                      className={
                        favorites.has(p.id)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600 hover:text-amber-400"
                      }
                    />
                  </button>
                  <ProtocolCard protocol={p} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick start CTA */}
        <div className="mt-12 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6 text-center">
          <h3 className="mb-2 font-semibold text-white">Not sure where to start?</h3>
          <p className="mb-4 text-sm text-slate-400">
            Try eFAST for trauma, PLAX for cardiac, or OB First Trimester for pregnancy dating.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["efast", "cardiac-plax", "ob-first-trimester"].map((id) => {
              const p = PROTOCOLS.find((x) => x.id === id)!;
              return (
                <Link
                  key={id}
                  href={`/scan?protocol=${id}`}
                  className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 transition-all"
                >
                  {p.icon} {p.shortName} <ArrowRight size={11} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
