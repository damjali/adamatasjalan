export const BRAND = "Adam Atas Jalan";

export type Shot = { src: string; w: number; h: number; alt: string };

export type Genre = {
  slug: string;
  label: string;
  title: string;
  tagline: string;
  intro: string;
};

const genre = (g: Genre): Genre => g;

export const genres: Genre[] = [
  genre({
    slug: "convocation",
    label: "Convo",
    title: "Convocation",
    tagline: "Caps, gowns & the people who got you there.",
    intro:
      "Years of late nights distilled into a single walk across the stage. I photograph the pride, the relief and the family hugs that happen just outside the frame of everyone else's camera.",
  }),
  genre({
    slug: "weddings",
    label: "Weddings",
    title: "Weddings",
    tagline: "Quiet glances. Loud celebrations. Everything in between.",
    intro:
      "From the akad nikah to the last song of the reception, I work unobtrusively to document your day as it truly unfolds — honest, elegant and made to be passed down.",
  }),
  genre({
    slug: "sports",
    label: "Sports",
    title: "Sports",
    tagline: "Sweat, grit and the split-second that decides it all.",
    intro:
      "Fast glass, sharper instincts. Whether it's a tournament final or a Sunday league, I chase the peak moment and the raw emotion that comes after the whistle.",
  }),
  genre({
    slug: "portraits",
    label: "Portraits",
    title: "Portraits",
    tagline: "You, as you are — just a little more timeless.",
    intro:
      "Personal branding, couples, families and editorial sessions. Natural light, careful direction and a relaxed atmosphere so the person in front of the lens can simply be.",
  }),
  genre({
    slug: "events",
    label: "Events",
    title: "Events",
    tagline: "Launches, galas & gatherings, told as a story.",
    intro:
      "Corporate functions, product launches and private celebrations — covered with a documentary eye and delivered fast, with highlight films available for every event.",
  }),
];

export const getGenre = (slug: string) => genres.find((g) => g.slug === slug);

export type Tier = {
  name: string;
  price: number;
  duration: string;
  featured?: boolean;
  features: string[];
};

export const pricing: Record<string, Tier[]> = {
  convocation: [
    {
      name: "Solo",
      price: 250,
      duration: "1 hour",
      features: ["1 graduate", "60+ edited photos", "Online gallery", "Delivery in 7 days"],
    },
    {
      name: "Family",
      price: 450,
      duration: "2 hours",
      featured: true,
      features: [
        "Graduate + family",
        "150+ edited photos",
        "1-minute highlight reel",
        "Online gallery",
        "Delivery in 7 days",
      ],
    },
    {
      name: "Squad",
      price: 750,
      duration: "3 hours",
      features: [
        "Up to 5 graduates",
        "300+ edited photos",
        "Group & individual sets",
        "Online gallery",
        "Delivery in 10 days",
      ],
    },
  ],
  weddings: [
    {
      name: "Akad / Solemnisation",
      price: 1800,
      duration: "4 hours",
      features: ["1 photographer", "400+ edited photos", "Online gallery", "Delivery in 4 weeks"],
    },
    {
      name: "Full Day",
      price: 3800,
      duration: "10 hours",
      featured: true,
      features: [
        "Photographer + videographer",
        "800+ edited photos",
        "3–5 minute cinematic film",
        "Same-day teaser",
        "Premium online gallery",
      ],
    },
    {
      name: "Heirloom",
      price: 6500,
      duration: "2 days",
      features: [
        "Two-person team, both days",
        "1,500+ edited photos",
        "Feature film + full ceremony edit",
        "Linen-bound fine art album",
        "Pre-wedding session",
      ],
    },
  ],
  sports: [
    {
      name: "Match Day",
      price: 400,
      duration: "Up to 3 hours",
      features: ["1 match or session", "100+ edited photos", "Delivery in 48 hours"],
    },
    {
      name: "Tournament",
      price: 1200,
      duration: "Full day",
      featured: true,
      features: [
        "Multiple matches",
        "350+ edited photos",
        "60-second social highlight",
        "Rush selects in 2 hours",
      ],
    },
    {
      name: "Season",
      price: 4500,
      duration: "Up to 8 events",
      features: [
        "Team & athlete portraits",
        "Highlight film per event",
        "Content-ready crops",
        "Priority scheduling",
      ],
    },
  ],
  portraits: [
    {
      name: "Mini",
      price: 200,
      duration: "30 minutes",
      features: ["1 location", "15 edited photos", "Online gallery"],
    },
    {
      name: "Signature",
      price: 450,
      duration: "90 minutes",
      featured: true,
      features: ["2 locations", "40 edited photos", "Outfit changes", "Styling guidance"],
    },
    {
      name: "Editorial",
      price: 900,
      duration: "Half day",
      features: [
        "Studio or location",
        "80 edited photos",
        "Behind-the-scenes clip",
        "Commercial usage licence",
      ],
    },
  ],
  events: [
    {
      name: "Essential",
      price: 800,
      duration: "3 hours",
      features: ["1 photographer", "200+ edited photos", "Delivery in 5 days"],
    },
    {
      name: "Complete",
      price: 1800,
      duration: "6 hours",
      featured: true,
      features: [
        "Photographer + videographer",
        "400+ edited photos",
        "2-minute highlight film",
        "Next-day social selects",
      ],
    },
    {
      name: "Production",
      price: 3500,
      duration: "Full day",
      features: [
        "Three-person crew",
        "Unlimited photos",
        "Highlight + full-length film",
        "Live social coverage",
      ],
    },
  ],
};

export const addOns = [
  { name: "Additional hour", price: "RM 150" },
  { name: "Drone aerial coverage", price: "RM 350" },
  { name: "Same-day edit film", price: "RM 900" },
  { name: "Fine art printed album", price: "from RM 600" },
  { name: "Rush delivery (48h)", price: "RM 250" },
  { name: "Travel outside Klang Valley", price: "on request" },
];

export const faqs = [
  {
    q: "How do I secure my date?",
    a: "A 30% non-refundable retainer and a signed agreement lock in your date. The balance is due one week before the session.",
  },
  {
    q: "Do you travel?",
    a: "Yes — anywhere in Malaysia and abroad. Travel and accommodation outside the Klang Valley are quoted separately.",
  },
  {
    q: "Can I get the RAW files?",
    a: "I deliver fully edited, high-resolution images only. The edit is half of the photograph and part of what you're booking.",
  },
  {
    q: "How long until I receive my gallery?",
    a: "Delivery times are listed with each package. You'll always get a handful of sneak peeks within 72 hours.",
  },
];
