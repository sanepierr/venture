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
    "hero.title.1": "Know Where",
    "hero.title.2": "to Invest.",
    "hero.sub":
      "Venture analyses any location in Kampala. Schools, taxi stages, markets, and competition, all within reach. Then tells you which business will thrive there, how much it could earn, and whether it will survive its first year.",
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
    "how.2.b": "Schools, stages, markets, competitors , all within a 400m walk.",
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

    // Common
    "common.back_home": "Back to home",
    "common.loading": "Loading…",
    "common.sign_in": "Sign in",
    "common.sign_out": "Sign out",
    "common.dashboard": "Dashboard",
    "common.plan": "Plan",

    // Auth
    "auth.login.title": "Welcome back",
    "auth.login.subtitle": "Sign in to your account",
    "auth.login.email": "Email",
    "auth.login.email_ph": "you@example.com",
    "auth.login.password": "Password",
    "auth.login.password_ph": "Enter your password",
    "auth.login.submit": "Sign in",
    "auth.login.submitting": "Signing in…",
    "auth.login.no_account": "Don't have an account?",
    "auth.login.create_one": "Create one",

    "auth.signup.title": "Create account",
    "auth.signup.subtitle": "Start making better investment decisions",
    "auth.signup.name": "Full name",
    "auth.signup.name_ph": "John Doe",
    "auth.signup.email": "Email",
    "auth.signup.password": "Password",
    "auth.signup.password_ph": "At least 6 characters",
    "auth.signup.submit": "Create account",
    "auth.signup.submitting": "Creating account…",
    "auth.signup.have_account": "Already have an account?",
    "auth.signup.sign_in": "Sign in",

    // Dashboard
    "dash.title": "Your Dashboard",
    "dash.welcome": "Welcome back, {name}. Track your saved investment opportunities.",
    "dash.explore": "Explore",
    "dash.saved_locations": "Saved locations",
    "dash.explore_new": "Explore new",
    "dash.avg_score": "Avg. score",
    "dash.avg_score_sub": "Based on your saved locations",
    "dash.high_potential": "High-potential",
    "dash.high_potential_sub": "Score 80 or above",
    "dash.saved_locations_title": "Saved Locations",
    "dash.no_saved_title": "No saved locations yet",
    "dash.no_saved_sub": "Explore Kampala and save locations to track your investments",
    "dash.start_exploring": "Start exploring",
    "dash.top_pick": "Top pick",
    "dash.score": "score",

    // Explore + map + saving
    "explore.save_location": "Save location",
    "explore.saved": "Saved",
    "explore.coords": "{lat}°, {lng}°",
    "explore.loading_map": "loading map…",
    "explore.loading_explore": "Loading explore…",
    "explore.search_locations": "Search locations",
    "explore.search_neighborhoods_ph": "Search neighborhoods...",
    "explore.no_locations_found": "No locations found",

    // Results panel (extra)
    "results.location": "Location",
    "results.schools": "Schools",
    "results.stages": "Stages",
    "results.markets": "Markets",
    "results.density": "Density",
    "results.top_match": "Top match",
    "results.area_insights": "Area Insights",
    "results.something_wrong": "Something went wrong",

    // Chatbot
    "chat.prompt_closed": "Ask about this location…",
    "chat.hint": 'Ask "Why [top business]?" or "Startup costs?" etc.',
    "chat.placeholder": "Ask about business viability...",

    // Plan
    "plan.analyzing": "Analyzing location...",
    "plan.no_location": "No location selected.",
    "plan.go_explore": "Go to explore",
    "plan.or_pick_saved": "or pick a saved location above.",
    "plan.plan_for": "Plan for",
    "plan.select_saved": "Select a saved location",
    "plan.no_saved": "No saved locations yet",
    "plan.url_override": "Showing plan for URL coordinates. Clear the query params to use saved locations.",
    "plan.download": "Download PDF Guide",
    "plan.section.goals_notes": "Goals & Notes",
    "plan.section.market": "Market Analysis",
    "plan.section.financial": "Financial Projections",
    "plan.section.checklist": "Startup Checklist",
    "plan.section.risks": "Risks & Mitigation",
    "plan.field.plan_title": "Plan title",
    "plan.field.owner_name": "Owner name",
    "plan.field.budget": "Starting budget (UGX)",
    "plan.field.goals": "Goals",
    "plan.field.notes": "Notes",
    "plan.field.goals_ph": "What do you want to achieve in the first 90 days?",
    "plan.field.notes_ph": "Add assumptions, suppliers, pricing ideas, etc.",
    "plan.value.owner": "Owner:",
    "plan.value.budget": "Budget:",

    // About (hackathon narrative)
    "about.title": "AI‑Powered Business Recommendation System",
    "about.subtitle": "with Chatbot & Luganda Translation",
    "about.badge": "Future Makers Hackathon 2026 Submission",
    "about.problem.title": "Problem",
    "about.problem.body":
      "Over 50% of small businesses in Uganda fail within 18 months. The leading cause is lack of data‑driven guidance on where to locate a business. Entrepreneurs guess, copy others, or rent the cheapest space available. Many entrepreneurs are more comfortable using Luganda than English, creating a language barrier.",
    "about.solution.title": "Solution",
    "about.solution.body":
      "Venture is an AI‑powered business recommendation system with two key accessibility features: a conversational chatbot and full Luganda language translation. Users can drop a pin on a map or simply chat in English or Luganda. The chatbot asks clarifying questions, analyzes the location, and returns personalized recommendations. Every page can be toggled between English and Luganda.",
    "about.how.title": "How it works",
    "about.how.1": "User opens Venture and selects English or Luganda",
    "about.how.2": 'User asks: "Nina sente 500,000. Nsobola okutandika ki?"',
    "about.how.3": "Chatbot extracts intent + location and calls the AI model",
    "about.how.4": "Recommendations appear in the selected language with revenue and survival probability",
    "about.impact.title": "Impact on the $500B economy",
    "about.impact.body":
      "Removes language barriers that exclude Luganda‑speaking entrepreneurs. Reduces business failure rates by 25–35%. Preserves startup capital. Creates more jobs. Encourages formalization across all language groups.",
    "about.scale.title": "Scalability",
    "about.scale.body":
      "Start with Kampala zones in English and Luganda. Expand to regional cities. Add more local languages (Swahili, Runyankore, Luo) in future phases.",
    "about.stack.title": "Technology stack",
    "about.stack.body":
      "Next.js frontend with Leaflet maps, FastAPI backend serving an AI model, Supabase for database, LLM API for chatbot, and an i18n layer for Luganda translation.",
    "about.team.title": "Team members",
    "about.team.1": "Geno Owor Joshua",
    "about.team.2": "Mokili Promise Pierre",
    "about.prototype": "Prototype access",
  },
  lg: {
    "nav.explore": "Noonya",
    "nav.how": "Engeri gye kikola",
    "nav.about": "Ebikufaako",
    "nav.launch": "Tandika",
    "hero.eyebrow": "Amagezi g'ebyobusuubuzi mu Uganda",
    "hero.title.1": "Teeka Sente",
    "hero.title.2": "w'olaba.",
    "hero.sub":
      "Venture ekebera ekifo kyonna mu Kampala , amasomero, estegi, n'amakatale , n'eraga bizinensi eyinza okukulaakulana, engeri gy'eyinza okufuna, n'obanga eriwangaala omwaka ogusooka.",
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
    "how.2.b": "Amasomero, estegi, amakatale , mu mitaalimu 400.",
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

    // Common
    "common.back_home": "Ddayo awaka",
    "common.loading": "Kikyali kifuluma…",
    "common.sign_in": "Yingira",
    "common.sign_out": "Fulumya",
    "common.dashboard": "Ddashiboodi",
    "common.plan": "Pulaani",

    // Auth
    "auth.login.title": "Tukusanyuse okudda",
    "auth.login.subtitle": "Yingira mu akawunti yo",
    "auth.login.email": "Email",
    "auth.login.email_ph": "you@example.com",
    "auth.login.password": "Pasiwaadi",
    "auth.login.password_ph": "Yingiza pasiwaadi yo",
    "auth.login.submit": "Yingira",
    "auth.login.submitting": "Oyinziza…",
    "auth.login.no_account": "Tolina akawunti?",
    "auth.login.create_one": "Kolawo emu",

    "auth.signup.title": "Kolawo akawunti",
    "auth.signup.subtitle": "Tandika okusalawo obulungi ku busuubuzi bwo",
    "auth.signup.name": "Erinnya lyonna",
    "auth.signup.name_ph": "John Doe",
    "auth.signup.email": "Email",
    "auth.signup.password": "Pasiwaadi",
    "auth.signup.password_ph": "Wansi wa nnaku 6 tekituuka",
    "auth.signup.submit": "Kolawo akawunti",
    "auth.signup.submitting": "Nkolawo akawunti…",
    "auth.signup.have_account": "Olina akawunti dda?",
    "auth.signup.sign_in": "Yingira",

    // Dashboard
    "dash.title": "Ddashiboodi yo",
    "dash.welcome": "Tukusanyuse, {name}. Goberera ebifo by'oteeseeko obusuubuzi.",
    "dash.explore": "Noonya",
    "dash.saved_locations": "Ebifo ebikuumiddwa",
    "dash.explore_new": "Noonya ebirala",
    "dash.avg_score": "Avariji y'obubonero",
    "dash.avg_score_sub": "Kusinziira ku bifo byo ebikuumiddwa",
    "dash.high_potential": "Ebirina amaanyi",
    "dash.high_potential_sub": "Obubonero 80 oba okusingawo",
    "dash.saved_locations_title": "Ebifo ebikuumiddwa",
    "dash.no_saved_title": "Tewali bifo bikuumiddwa",
    "dash.no_saved_sub": "Noonya Kampala era okuume ebifo okwegatta ku by'oteeseeko",
    "dash.start_exploring": "Tandika okunoonyereza",
    "dash.top_pick": "Ekisinga",
    "dash.score": "obubonero",

    // Explore + map + saving
    "explore.save_location": "Kuuma ekifo",
    "explore.saved": "Kikuumiddwa",
    "explore.coords": "{lat}°, {lng}°",
    "explore.loading_map": "mapu ejja…",
    "explore.loading_explore": "Ekifo kino kisomeddwa…",
    "explore.search_locations": "Noonya ebifo",
    "explore.search_neighborhoods_ph": "Noonya ekitundu...",
    "explore.no_locations_found": "Tewali bifo bifuniddwa",

    // Results panel (extra)
    "results.location": "Ekifo",
    "results.schools": "Amasomero",
    "results.stages": "Esiteegi",
    "results.markets": "Akatale",
    "results.density": "Obungi",
    "results.top_match": "Ekisinga okutuuka",
    "results.area_insights": "Eby'okumanya ku kitundu",
    "results.something_wrong": "Waliwo ekitambudde bubi",

    // Chatbot
    "chat.prompt_closed": "Buuza ku kitundu kino…",
    "chat.hint": 'Buuza "Lwaki [bizinensi]?" oba "Zitandika sente mmeka?"',
    "chat.placeholder": "Buuza ku busuubuzi buno bwe buyinza okukola...",

    // Plan
    "plan.analyzing": "Tukebere ekifo...",
    "plan.no_location": "Tewali kifo kirondeddwa.",
    "plan.go_explore": "Genda okunoonyereza",
    "plan.or_pick_saved": "oba londa ku bifo byo ebikuumiddwa waggulu.",
    "plan.plan_for": "Pulaani ya",
    "plan.select_saved": "Londa ekifo ekikuumiddwa",
    "plan.no_saved": "Tewali bifo bikuumiddwa",
    "plan.url_override": "Tulina pulaani ya coords eziri mu link. Jjako query params okusebenzisa ebifo ebikuumiddwa.",
    "plan.download": "Wanoonya PDF",
    "plan.section.goals_notes": "Ebigendererwa & Ebiwandiiko",
    "plan.section.market": "Okukebera akatale",
    "plan.section.financial": "Ebibalo by'ensimbi",
    "plan.section.checklist": "Ebyetaagisa okutandika",
    "plan.section.risks": "Obulabe & Okuzibira",
    "plan.field.plan_title": "Erinnya lya pulaani",
    "plan.field.owner_name": "Erinnya lya nannyini",
    "plan.field.budget": "Sente z'otandika nazo (UGX)",
    "plan.field.goals": "Ebigendererwa",
    "plan.field.notes": "Ebiwandiiko",
    "plan.field.goals_ph": "Okwagala okutuukiriza ki mu nnaku 90 ezisooka?",
    "plan.field.notes_ph": "Wandiika ebirowoozo, abasuubuzi, ebbeeyi, n'ebirala.",
    "plan.value.owner": "Nannyini:",
    "plan.value.budget": "Sente:",

    // About (hackathon narrative)
    "about.title": "Sistemu ya AI ey'okulonda obusuubuzi",
    "about.subtitle": "erina Chatbot & Okuvvuunula mu Luganda",
    "about.badge": "Future Makers Hackathon 2026",
    "about.problem.title": "Obuzibu",
    "about.problem.body":
      "Bizinensi ezingera ku 50% mu Uganda zigwa mu myezi 18. Ekisinga okuleeta kino kwe butaba na magezi agasinziira ku data ku kifo ky'okutandikira. Abasuubuzi bapima ku kirowoozo, okukoppa abalala, oba okufuna rent eya wansi. Era bangi basobola Luganda okusinga English, ekireeta obuzibu bw'olulimi.",
    "about.solution.title": "Ekikozesebwa",
    "about.solution.body":
      "Venture ye sistemu ya AI ey'okulonda obusuubuzi nga erina ebintu bibiri eby'omugaso: chatbot ey'okusaba n'okuddamu, n'okuvvuunula kwonna mu Luganda. Oyinza okuteeka akabonero ku mapu oba okuwandiika obubuuzi mu English oba Luganda. Chatbot ebuuza ebibuuzo eby'okweyongera, ekebere ekifo, n'ewa amagezi agakwata ku muntu.",
    "about.how.title": "Engeri gye kikola",
    "about.how.1": "Omuntu aggulawo Venture n'alonda English oba Luganda",
    "about.how.2": 'Abuuza: "Nina sente 500,000. Nsobola okutandika ki?"',
    "about.how.3": "Chatbot ekwata ku kigendererwa n'ekifo, n'ekuba model ya AI",
    "about.how.4": "Ebirondeddwa bijja mu lulimi olwo, n'ensimbi ne survival probability",
    "about.impact.title": "Enkola ku $500B economy",
    "about.impact.body":
      "Ejjawo ekiziyiza ky'olulimi eri aboogera Luganda. Ekendeeza okuggwa kwa bizinensi ku 25–35%. Ekuuma sente z'okutandika. Ekola emirimu mingi. Ezza abasuubuzi mu nkola y'ebyamateeka.",
    "about.scale.title": "Okugaziya",
    "about.scale.body":
      "Tandika ne Kampala mu English ne Luganda. Gaziya mu bibuga ebirala. Yongera ennimi endala (Swahili, Runyankore, Luo) mu biseera eby'omu maaso.",
    "about.stack.title": "Tekinologiya",
    "about.stack.body":
      "Next.js ku frontend ne mapu ya Leaflet, FastAPI ku backend n'AI model, Supabase ku database, API ya LLM ku chatbot, n'i18n okuvvuunula Luganda.",
    "about.team.title": "Aba team",
    "about.team.1": "Geno Owor Joshua",
    "about.team.2": "Mokili Promise Pierre",
    "about.prototype": "Okufuna prototype",
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
