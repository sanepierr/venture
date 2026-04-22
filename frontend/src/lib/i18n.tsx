"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "lg";

const dict = {
  en: {
    "nav.explore": "Explore",
    "nav.how": "How it works",
    "nav.about": "About",
    "nav.launch": "Launch app",
    "hero.eyebrow": "Business intelligence for Uganda",
    "hero.title.1": "Know where",
    "hero.title.2": "to build.",
    "hero.sub":
      "Venture analyses any location in Kampala — schools, taxi stages, markets, and competition — then tells you which business will thrive there, how much it could earn, and whether it will survive its first year.",
    "hero.cta.primary": "Explore a location",
    "hero.cta.secondary": "See how it works",
    "hero.stat1.label": "Business types",
    "hero.stat1.value": "24",
    "hero.stat2.label": "Ground-truth cells",
    "hero.stat2.value": "5,000",
    "hero.stat3.label": "Kampala coverage",
    "hero.stat3.value": "100%",
    "feat.title": "Turn guesswork into intelligence.",
    "feat.sub":
      "Small businesses fail when founders pick the wrong spot. Venture grounds every decision in data.",
    "feat.1.title": "Location-aware",
    "feat.1.body":
      "We score every square of Kampala on foot traffic proxies, nearby anchors, and existing competition.",
    "feat.2.title": "Revenue-forecasted",
    "feat.2.body":
      "A gradient-boosted model estimates daily revenue for each business category at your point.",
    "feat.3.title": "Survival-tested",
    "feat.3.body":
      "A 12-month survival probability, calibrated against Ugandan small-business closure patterns.",
    "how.title": "Three steps. One decision.",
    "how.1.k": "01",
    "how.1.t": "Drop a pin",
    "how.1.b": "Click anywhere on the Kampala map.",
    "how.2.k": "02",
    "how.2.t": "We read the ground",
    "how.2.b": "Schools, stages, markets, competitors — all within a 400m walk.",
    "how.3.k": "03",
    "how.3.t": "Get your answer",
    "how.3.b": "Ranked business types, revenue estimate, survival odds.",
    "cta.title": "Ready to pick your spot?",
    "cta.sub": "It takes 10 seconds. No signup.",
    "cta.button": "Launch Venture",
    "footer.tag": "Built in Kampala. For Kampala.",
    "explore.title": "Click anywhere in Kampala",
    "explore.sub": "We'll read the neighborhood and return ranked recommendations.",
    "explore.loading": "Reading the ground…",
    "explore.results": "Recommendations",
    "explore.survival": "12-month survival",
    "explore.revenue": "Est. daily revenue",
    "explore.confidence": "Confidence",
    "explore.competition": "Nearby competitors",
    "explore.anchors": "Anchors within 400m",
    "explore.empty.title": "Pick a point to begin",
    "explore.empty.sub":
      "Tap the map to analyse a location. Try a busy junction or near a market.",
    "explore.retry": "Try another point",
    "lang.toggle": "Luganda",
  },
  lg: {
    "nav.explore": "Noonya",
    "nav.how": "Engeri gye kikola",
    "nav.about": "Ebikufaako",
    "nav.launch": "Tandika",
    "hero.eyebrow": "Amagezi g'ebyobusuubuzi mu Uganda",
    "hero.title.1": "Manya wa",
    "hero.title.2": "okuzimba.",
    "hero.sub":
      "Venture ekebera ekifo kyonna mu Kampala — amasomero, estegi, n'amakatale — n'eraga bizinensi eyinza okukulaakulana, engeri gy'eyinza okufuna, n'obanga eriwangaala omwaka ogusooka.",
    "hero.cta.primary": "Noonya ekifo",
    "hero.cta.secondary": "Laba engeri gy'ekola",
    "hero.stat1.label": "Ebika bya bizinensi",
    "hero.stat1.value": "24",
    "hero.stat2.label": "Obubonero bw'amazima",
    "hero.stat2.value": "5,000",
    "hero.stat3.label": "Kampala yonna",
    "hero.stat3.value": "100%",
    "feat.title": "Kyusa okukyekasa okufuuka amagezi.",
    "feat.sub":
      "Bizinensi entono zigwa nga bannannyini bazo balonda ekifo ekikyamu. Venture esinziira ku data.",
    "feat.1.title": "Emanyi ekifo",
    "feat.1.body":
      "Tupima buli kantu ka Kampala ku bantu abayitawo, eby'okulaga, n'abavuganya.",
    "feat.2.title": "Ebbanjo eriraguliddwa",
    "feat.2.body":
      "Model yaffe ebala sente buli bizinensi z'eyinza okufuna buli lunaku.",
    "feat.3.title": "Okuwangaala okukebereddwa",
    "feat.3.body":
      "Okuwangaala kw'emyezi 12, nga kupimiddwa ku ngeri bizinensi za Uganda gye zikola.",
    "how.title": "Amatendeka asatu. Okusalawo kumu.",
    "how.1.k": "01",
    "how.1.t": "Teeka akabonero",
    "how.1.b": "Koona ku mapu ya Kampala.",
    "how.2.k": "02",
    "how.2.t": "Tusoma ettaka",
    "how.2.b": "Amasomero, estegi, amakatale — mu mitaalimu 400.",
    "how.3.k": "03",
    "how.3.t": "Funa eky'okuddamu",
    "how.3.b": "Bizinensi ezirondedwa, sente eziraguliddwa, n'obuwangaazi.",
    "cta.title": "Weetegese okulonda ekifo kyo?",
    "cta.sub": "Kitwala sekonda 10. Tewetaaga kwewandiisa.",
    "cta.button": "Tandika Venture",
    "footer.tag": "Kizimbiddwa mu Kampala. Ku lwa Kampala.",
    "explore.title": "Koona wonna mu Kampala",
    "explore.sub": "Tujja kusoma ekitundu n'okuwa ebirondeddwa.",
    "explore.loading": "Tusoma ettaka…",
    "explore.results": "Ebirondeddwa",
    "explore.survival": "Okuwangaala emyezi 12",
    "explore.revenue": "Sente za buli lunaku",
    "explore.confidence": "Obukakafu",
    "explore.competition": "Abavuganya",
    "explore.anchors": "Ebiri mu mitaalimu 400",
    "explore.empty.title": "Londa ekifo okutandika",
    "explore.empty.sub":
      "Koona mapu okukebera ekifo. Gezaako ku kkona ekkulu oba okumpi n'akatale.",
    "explore.retry": "Gezaako ekirala",
    "lang.toggle": "English",
  },
} as const;

type Key = keyof typeof dict.en;

const Ctx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = (localStorage.getItem("lang") as Lang | null) ?? "en";
    setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (k: Key) => (dict[lang] as Record<string, string>)[k] ?? k;

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n outside provider");
  return v;
};
