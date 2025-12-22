export type Creator = {
  id: string;
  name: string;
  bio: string;
  category: string;
  price: number;
  avatar: string;
  cover: string;
};

export type Publication = {
  id: string;
  creatorId: string;
  title: string;
  excerpt: string;
  image?: string;
  video?: string;
  isPublic: boolean;
  date: string;
};

export const creators: Creator[] = [
  {
    id: "luz",
    name: "Luz Romero",
    bio: "Ilustradora digital y notas de proceso cada semana.",
    category: "Ilustracion",
    price: 4.5,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=60",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "mar",
    name: "Mar Perez",
    bio: "Productora de video corto con tutoriales y backstage.",
    category: "Video",
    price: 6.0,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=60",
    cover: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: "sofia",
    name: "Sofia Vidal",
    bio: "Periodista freelance con crónicas exclusivas.",
    category: "Escritura",
    price: 5.0,
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=60",
    cover: "https://images.unsplash.com/photo-1522206024047-9c9254216757?auto=format&fit=crop&w=1200&q=60",
  },
];

export const publications: Publication[] = [
  {
    id: "pub-1",
    creatorId: "luz",
    title: "Boceto del cartel de marzo",
    excerpt: "Trazo inicial, paleta y cómo llegué al contraste final.",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=800&q=80",
    isPublic: true,
    date: "2025-01-03",
  },
  {
    id: "pub-2",
    creatorId: "mar",
    title: "Cómo grabo con luz natural",
    excerpt: "Checklist de equipo ligero y ajustes rápidos.",
    video: "",
    isPublic: false,
    date: "2025-01-02",
  },
  {
    id: "pub-3",
    creatorId: "sofia",
    title: "Crónica: mercado nocturno",
    excerpt: "Notas que no entraron en el artículo público.",
    isPublic: false,
    date: "2025-01-01",
  },
];
