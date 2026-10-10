export interface User {
  id: string;
  full_name: string;
  email: string;
  document_id: string | null;
  role: "student" | "admin";
}

export interface CourseSummary {
  slug: string;
  title: string;
  category: string;
  color: string;
  summary: string;
  price_cop: number;
  free_modules: number;
  modules: number;
  topics: number;
}

export interface TopicItem {
  id: number;
  position: number;
  title: string;
  completed: boolean;
}

export interface ModuleItem {
  id: number;
  position: number;
  title: string;
  is_free: boolean;
  unlocked: boolean;
  topics: TopicItem[];
}

export interface CourseDetail {
  slug: string;
  title: string;
  category: string;
  color: string;
  summary: string;
  price_cop: number;
  free_modules: number;
  plan: "free" | "premium" | null;
  progress: { completed: number; total: number; percent: number };
  certificate_code: string | null;
  modules: ModuleItem[];
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  video_url: string | null;
  position: number;
  module: { position: number; title: string };
  course: { slug: string; title: string };
  completed: boolean;
  prev_id: number | null;
  next_id: number | null;
}

export interface MyCourse {
  slug: string;
  title: string;
  color: string;
  category: string;
  plan: "free" | "premium";
  completed_topics: number;
  total_topics: number;
  certificate_code: string | null;
}

export interface CheckoutResponse {
  reference: string;
  amount_cop: number;
  course: string;
  checkout_url: string | null;
  demo_mode: boolean;
}
