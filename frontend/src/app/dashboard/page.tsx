"use client";

import { useAuth } from "@/lib/auth";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, TrendingUp, History, LogOut, ArrowRight, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface SavedLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  topBusiness: string;
  score: number;
  date: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("venture_saved_locations");
    if (stored) {
      setSavedLocations(JSON.parse(stored));
    }
  }, []);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <Nav />

      <div className="pt-24 pb-16 px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="font-serif text-5xl tracking-tight">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-2 text-[var(--ink-muted)]">
              Track your saved locations and investment insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                  <MapPin size={18} className="text-[var(--accent)]" />
                </div>
                <div>
                  <div className="font-mono text-2xl">{savedLocations.length}</div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[var(--ink-muted)]">
                    Saved locations
                  </div>
                </div>
              </div>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
              >
                Explore new location <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 flex items-center justify-center">
                  <TrendingUp size={18} className="text-[var(--success)]" />
                </div>
                <div>
                  <div className="font-mono text-2xl">
                    {savedLocations.length > 0
                      ? Math.round(savedLocations.reduce((acc, l) => acc + l.score, 0) / savedLocations.length)
                      : 0}
                  </div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[var(--ink-muted)]">
                    Avg. opportunity score
                  </div>
                </div>
              </div>
              <div className="text-sm text-[var(--ink-muted)]">
                Based on your saved locations
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--ink)]/10 flex items-center justify-center">
                  <Star size={18} className="text-[var(--ink)]" />
                </div>
                <div>
                  <div className="font-mono text-2xl">
                    {savedLocations.filter((l) => l.score >= 80).length}
                  </div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[var(--ink-muted)]">
                    High-potential spots
                  </div>
                </div>
              </div>
              <div className="text-sm text-[var(--ink-muted)]">
                Score 80 or above
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-3xl">Saved locations</h2>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
              >
                <MapPin size={14} />
                Add new
              </Link>
            </div>

            {savedLocations.length === 0 ? (
              <div className="p-12 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                  <MapPin size={24} className="text-[var(--ink-muted)]" />
                </div>
                <h3 className="font-serif text-2xl">No saved locations yet</h3>
                <p className="mt-2 text-[var(--ink-muted)]">
                  Explore Kampala and save locations to track your investments
                </p>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--accent)] transition-colors"
                >
                  Start exploring <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {savedLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-xl">{loc.name}</h3>
                        <p className="mt-1 font-mono text-xs text-[var(--ink-subtle)]">
                          {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-serif text-2xl text-[var(--accent)]">
                          {loc.score}
                        </div>
                        <div className="text-xs font-mono uppercase tracking-widest text-[var(--ink-subtle)]">
                          score
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-mono uppercase tracking-widest text-[var(--ink-subtle)]">
                            Top pick
                          </div>
                          <div className="font-medium mt-1">{loc.topBusiness}</div>
                        </div>
                        <Link
                          href={`/explore?lat=${loc.lat}&lng=${loc.lng}`}
                          className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
                        >
                          View <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}