"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function MobilePreview() {
  const { t } = useI18n();

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--accent)] mb-4">
              Now on Mobile
            </div>
            <h2 className="font-serif text-5xl md:text-6xl leading-[1.1] tracking-tight text-[var(--ink)]">
              Venture in Your <span className="italic">Pocket</span>.
            </h2>
            <p className="mt-8 text-xl text-[var(--ink-muted)] leading-relaxed max-w-lg">
              Take the power of predictive geo-analytics wherever you go. Our native iOS and Android apps provide real-time investment insights on the ground.
            </p>
            
            <ul className="mt-10 space-y-4">
              {[
                "Real-time location pin dropping",
                "Offline-first predictive analysis",
                "Native PDF report generation",
                "Instant market saturation alerts"
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-[var(--ink)] font-medium"
                >
                  <CheckCircle2 size={18} className="text-[var(--success)]" />
                  {item}
                </motion.li>
              ))}
            </ul>

            <div className="mt-12 flex flex-wrap gap-4">
              <div className="px-6 py-3 rounded-full bg-[var(--ink)] text-[var(--bg)] font-medium flex items-center gap-2 cursor-not-allowed opacity-50">
                <span className="text-sm">App Store (Coming Soon)</span>
              </div>
              <div className="px-6 py-3 rounded-full border border-[var(--border-strong)] text-[var(--ink)] font-medium flex items-center gap-2 cursor-not-allowed opacity-50">
                <span className="text-sm">Play Store (Coming Soon)</span>
              </div>
            </div>
          </motion.div>

          {/* Mobile Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
            className="relative"
          >
            {/* Background Orbs */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[var(--accent)]/10 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[var(--success)]/10 blur-[100px]" />
            
            <div className="relative z-10 p-4 rounded-[3rem] bg-[var(--surface)] border border-[var(--border-strong)] shadow-2xl overflow-hidden group">
              <Image 
                src="/mobile-mockup.png" 
                alt="Venture Mobile App Preview" 
                width={800} 
                height={800}
                className="rounded-[2.5rem] transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            </div>
            
            {/* Floating UI Element */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-1/4 z-20 bg-white border border-[var(--border-strong)] p-4 rounded-2xl shadow-xl hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--success)]/20 flex items-center justify-center">
                  <span className="text-[var(--success)] font-bold">94%</span>
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--ink-subtle)]">Survival Rate</div>
                  <div className="text-sm font-bold text-[var(--ink)]">Optimal Entry</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
