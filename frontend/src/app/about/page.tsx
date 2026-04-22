"use client";

import { useI18n } from "@/lib/i18n";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Brain, TrendingUp, Users, BookOpen } from "lucide-react";

const team = [
  {
    name: "Dr. Sarah Nakiganda",
    role: "ML Lead",
    bio: "PhD in Applied Statistics, Makerere University. 8 years building predictive models for East African markets.",
  },
  {
    name: "James Okello",
    role: "Urban Analyst",
    bio: "GIS specialist mapping Kampala's informal economy since 2019. Published researcher on SME location dynamics.",
  },
  {
    name: "Grace Nabisere",
    role: "Product Lead",
    bio: "Former Y Combinator cohort founder. Built fintech products reaching 2M+ Ugandan users.",
  },
];

const values = [
  {
    icon: MapPin,
    title: "Ground in reality",
    body: "Every model output is traceable to real ground-truth data — not scraped listings or guessed proxies.",
  },
  {
    icon: Brain,
    title: "Explainable decisions",
    body: "When we say a location scores 94 for Mobile Money, we show you why: schools, stages, markets, competitors.",
  },
  {
    icon: TrendingUp,
    title: "Honest forecasts",
    body: "We show confidence intervals and survival odds as they are — not as founders want to hear them.",
  },
  {
    icon: Users,
    title: "Built with, not for",
    body: "The business taxonomy and survival benchmarks come from interviews with 200+ Kampala entrepreneurs.",
  },
];

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <main className="min-h-screen">
      <Nav />

      <div className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm text-xs font-mono uppercase tracking-widest text-[var(--ink-muted)]">
              {t("nav.about")}
            </div>
            <h1 className="mt-8 font-serif text-6xl md:text-7xl leading-[1] tracking-tight">
              Built in Kampala.<br />
              <span className="italic text-[var(--accent)]">For Kampala.</span>
            </h1>
            <p className="mt-8 text-xl text-[var(--ink-muted)] max-w-2xl mx-auto leading-relaxed">
              Venture started from a simple frustration: every year, thousands of Ugandan entrepreneurs 
              pick the wrong location and lose everything. We&apos;re building the intelligence layer they deserve.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 grid md:grid-cols-4 gap-4"
          >
            {[
              { v: "5,000+", l: "Ground-truth data points" },
              { v: "24", l: "Business categories" },
              { v: "200+", l: "Entrepreneur interviews" },
              { v: "100%", l: "Kampala coverage" },
            ].map((s) => (
              <div key={s.l} className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-center">
                <div className="font-serif text-4xl text-[var(--accent)]">{s.v}</div>
                <div className="mt-2 text-xs font-mono uppercase tracking-widest text-[var(--ink-muted)]">
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <section className="py-24 px-6 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
              — Our story
            </div>
            <h2 className="mt-4 font-serif text-5xl leading-tight tracking-tight">
              Why location matters more in Kampala
            </h2>
          </motion.div>

          <div className="mt-16 grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <p className="text-lg text-[var(--ink-muted)] leading-relaxed">
                In Kampala&apos;s informal economy, a single street corner can mean the difference between 
                thriving and closing. A chapati stand 50 meters from a taxi stage earns differently 
                than one near a school. A pharmacy near a market performs differently than one 
                near office blocks.
              </p>
              <p className="text-lg text-[var(--ink-muted)] leading-relaxed">
                Yet most new business owners choose locations based on gut feel, word of mouth, 
                or where they can afford rent — not where customers actually are.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-6"
            >
              <p className="text-lg text-[var(--ink-muted)] leading-relaxed">
                Venture solves this by analyzing every location through a gradient-boosted model 
                trained on 5,000+ ground-truth observations: what businesses exist, how much 
                they earn, and whether they survived their first year.
              </p>
              <p className="text-lg text-[var(--ink-muted)] leading-relaxed">
                The result: ranked recommendations with revenue forecasts and survival probabilities, 
                all grounded in Kampala&apos;s specific patterns.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
              — How we work
            </div>
            <h2 className="mt-4 font-serif text-5xl leading-tight tracking-tight">
              Grounded in reality
            </h2>
          </motion.div>

          <div className="mt-16 grid md:grid-cols-2 gap-4">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                  <val.icon size={20} />
                </div>
                <h3 className="mt-6 font-serif text-2xl">{val.title}</h3>
                <p className="mt-3 text-[var(--ink-muted)] leading-relaxed">{val.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
              — The team
            </div>
            <h2 className="mt-4 font-serif text-5xl leading-tight tracking-tight">
              Built by people who understand Kampala
            </h2>
          </motion.div>

          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--bg)] border border-[var(--border)]"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--accent)]/20 flex items-center justify-center mb-4">
                  <span className="font-serif text-2xl text-[var(--accent)]">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <h3 className="font-serif text-xl">{member.name}</h3>
                <div className="mt-1 text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
                  {member.role}
                </div>
                <p className="mt-4 text-sm text-[var(--ink-muted)] leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent)]">
              — Data & methodology
            </div>
            <h2 className="mt-4 font-serif text-5xl leading-tight tracking-tight">
              How the model works
            </h2>
          </motion.div>

          <div className="mt-12 space-y-6 text-left">
            {[
              {
                icon: BookOpen,
                title: "Training data",
                body: "5,000+ data points collected through field surveys, business registrations, and follow-up interviews. Each point records: location, business type, daily revenue, monthly rent, survival status at 6 and 12 months.",
              },
              {
                icon: MapPin,
                title: "Location features",
                body: "We compute 40+ features per location: distance to nearest schools, taxi stages, markets; population density estimates; count of same-business competitors within 200m radius; road network proximity.",
              },
              {
                icon: Brain,
                title: "Model architecture",
                body: "Gradient-boosted trees (XGBoost) with separate heads for revenue prediction and survival classification. Trained on 80% of data, validated on held-out 20% across multiple Kampala neighborhoods.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex gap-6 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shrink-0">
                  <item.icon size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-xl">{item.title}</h3>
                  <p className="mt-2 text-[var(--ink-muted)] leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}