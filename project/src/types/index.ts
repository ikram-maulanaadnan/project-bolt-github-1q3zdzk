export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular: boolean;
  discord_role_id: string;
  payment_link: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// PERUBAHAN: Menambahkan discord_invite_link
export interface HeroContent {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  whatsappNumber: string;
  discord_invite_link?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}