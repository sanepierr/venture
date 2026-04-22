"use client";

const items = [
  "Mobile Money Agent",
  "Chapati Stand",
  "Salon",
  "Pharmacy",
  "Hardware Shop",
  "Boda Stage",
  "Grocery",
  "Phone Repair",
  "Internet Cafe",
  "Tailor",
  "Restaurant",
  "Bakery",
  "Stationery",
  "Butchery",
  "Fruit Vendor",
  "School Supplies",
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden py-10 border-y border-[var(--border)] bg-[var(--surface)]">
      <div className="marquee-track flex gap-12 whitespace-nowrap w-max">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-12 font-serif text-2xl text-[var(--ink-muted)]">
            <span>{item}</span>
            <span className="text-[var(--accent)]">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
