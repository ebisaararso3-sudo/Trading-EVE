export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  language: "en" | "om" | "am";
  subscription: "free" | "pro" | "premium";
  balance: number;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  url: string;
  isPaid: boolean;
  price: number;
  category: string;
  language: "en" | "om" | "am";
  pages: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  category: string;
  language: "en" | "om" | "am";
  thumbnail?: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  bookId: string;
  amount: number;
  phone: string;
  txId: string;
  status: "pending" | "success" | "failed";
  timestamp: string;
  buyerName?: string;
  bookTitle?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "model";
  content: string;
  language: "en" | "om" | "am";
  timestamp: string;
}

export interface AdminStats {
  totalUsers: number;
  totalBooks: number;
  totalVideos: number;
  totalRevenue: number;
  transactions: PaymentTransaction[];
}

export interface FeedPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  followers?: string;
  timeAgo: string;
  caption: string;
  videoUrl?: string;
  videoDuration?: string;
  videoTitle?: string;
  videoThumbnail?: string;
  likes: number;
  comments: number;
  shares: number;
  likedByUser?: boolean;
}

