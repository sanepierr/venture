"use client";

import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, TrendingUp, Star, LogOut, ArrowRight, User, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    const stored = localStorage.getItem("venture_saved_locations");
    if (stored) {
      setSavedLocations(JSON.parse(stored));
    }
  }, [user, router]);

  if (!user) return null;

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 px-6 py-4 backdrop-blur-md bg-[var(--bg)]/80 border-b border-[var(--border)]">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white font-serif text-lg">V</span>
            </div>
            <span className="font-serif text-xl">Venture</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/explore"
              className="hidden sm:flex items-center gap-2 text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            >
              <MapPin size={16} />
              Explore
            </Link>
            <div className="h-4 w-px bg-[var(--border)]" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                <User size={16} className="text-[var(--accent)]" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-[var(--ink-muted)]">{user.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full border border-[var(--border)] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 py-8 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-serif text-4xl md:text-5xl tracking-tight">
              Your Dashboard
            </h1>
            <p className="mt-2 text-[var(--ink-muted)]">
              Welcome back, {user.name.split(" ")[0]}. Track your saved investment opportunities.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
            >
              <div className="flex items-center gap-3 mb-3">
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
                Explore new <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
            >
              <div className="flex items-center gap-3 mb-3">
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
                    Avg. score
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
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--ink)]/10 flex items-center justify-center">
                  <Star size={18} className="text-[var(--ink)]" />
                </div>
                <div>
                  <div className="font-mono text-2xl">
                    {savedLocations.filter((l) => l.score >= 80).length}
                  </div>
                  <div className="text-xs font-mono uppercase tracking-widest text-[var(--ink-muted)]">
                    High-potential
                  </div>
                </div>
              </div>
              <div className="text-sm text-[var(--ink-muted)]">
                Score 80 or above
              </div>
            </motion.div>
          </div>

          {/* Saved Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl">Saved Locations</h2>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--accent)] transition-colors"
              >
                <MapPin size={14} />
                Explore
              </Link>
            </div>

            {savedLocations.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
                  <MapPin size={22} className="text-[var(--ink-muted)]" />
                </div>
                <h3 className="font-serif text-xl">No saved locations yet</h3>
                <p className="mt-2 text-[var(--ink-muted)] text-sm">
                  Explore Kampala and save locations to track your investments
                </p>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--accent)] transition-colors"
                >
                  Start exploring <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {savedLocations.map((loc) => (
                  <Link
                    key={loc.id}
                    href={`/explore?lat=${loc.lat}&lng=${loc.lng}`}
                    className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-serif text-lg group-hover:text-[var(--accent)] transition-colors">
                          {loc.name}
                        </h3>
                        <p className="mt-0.5 font-mono text-xs text-[var(--ink-subtle)]">
                          {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-2xl text-[var(--accent)]">{loc.score}</div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-subtle)]">
                          score
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-subtle)]">
                          Top pick
                        </div>
                        <div className="font-medium text-sm mt-0.5">{loc.topBusiness}</div>
                      </div>
                      <BarChart3 size={16} className="text-[var(--ink-subtle)]" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}