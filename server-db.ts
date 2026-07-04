import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "db.json");

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // for simplicity, direct match in dev
  role: "user" | "admin";
  language: "en" | "om" | "am";
  subscription: "free" | "pro" | "premium";
  balance: number; // Simulated wallet balance (ETB)
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  url: string; // simulated or actual pdf link
  isPaid: boolean;
  price: number; // in ETB
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
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "model";
  content: string;
  language: "en" | "om" | "am";
  timestamp: string;
}

interface DatabaseSchema {
  users: User[];
  books: Book[];
  videos: Video[];
  payments: PaymentTransaction[];
  chats: ChatMessage[];
}

const DEFAULT_DB: DatabaseSchema = {
  users: [
    {
      id: "u-admin",
      name: "Admin User",
      email: "admin@smartbook.ai",
      passwordHash: "admin123",
      role: "admin",
      language: "en",
      subscription: "premium",
      balance: 1000,
      createdAt: new Date().toISOString(),
    },
    {
      id: "u-student",
      name: "Chala Tolera",
      email: "student@smartbook.ai",
      passwordHash: "student123",
      role: "user",
      language: "om",
      subscription: "free",
      balance: 150,
      createdAt: new Date().toISOString(),
    }
  ],
  books: [
    {
      id: "b-1",
      title: "Introduction to Flutter (Afaan Oromoo)",
      description: "Kitaaba seensa Flutter Afaan Oromootiin qophaa'e. Barreessaa: Team SmartBook AI. Waliin baranna!",
      url: "https://pdfobject.com/pdf/sample.pdf",
      isPaid: false,
      price: 0,
      category: "Software Development",
      language: "om",
      pages: 45
    },
    {
      id: "b-2",
      title: "Advanced Grade 12 Mathematics (Amharic)",
      description: "ለ12ኛ ክፍል ተማሪዎች የተዘጋጀ የላቀ ሂሳብ መጽሐፍ። ከባለሙያዎች የተሰበሰቡ ማብራሪያዎች እና የቀድሞ ፈተናዎች ስብስብ።",
      url: "https://pdfobject.com/pdf/sample.pdf",
      isPaid: true,
      price: 50,
      category: "Mathematics",
      language: "am",
      pages: 120
    },
    {
      id: "b-3",
      title: "AI & Machine Learning Pro Guide (English)",
      description: "A comprehensive developer-focused guide to artificial intelligence, neural networks, and prompt engineering using modern models like Gemini 3.5.",
      url: "https://pdfobject.com/pdf/sample.pdf",
      isPaid: true,
      price: 80,
      category: "Artificial Intelligence",
      language: "en",
      pages: 215
    },
    {
      id: "b-4",
      title: "Grade 11 Physics Textbook (Afaan Oromoo)",
      description: "Kitaaba barataa Fiiziksii kutaa 11ffaa. Seera n-Newton, Humna, sochiifi anniisaa dabalatee irratti xiyyeeffata.",
      url: "https://pdfobject.com/pdf/sample.pdf",
      isPaid: false,
      price: 0,
      category: "Physics",
      language: "om",
      pages: 95
    },
    {
      id: "b-5",
      title: "Geography of Ethiopia (English)",
      description: "Explore the topographical regions, beautiful microclimates, demographic parameters, and historic trade systems of the Horn of Africa.",
      url: "https://pdfobject.com/pdf/sample.pdf",
      isPaid: true,
      price: 40,
      category: "Geography",
      language: "en",
      pages: 80
    },
    {
      id: "b-6",
      title: "Amharic Literature & Essay Grammar (Amharic)",
      description: "የአማርኛ ስነ-ጽሁፍ፣ ቅኔ እና ሰዋሰው መማሪያ መጽሐፍ። የንባብ ክህሎት እና የስነ-ፅሁፍ ውበትን ለማሳደግ የሚረዳ።",
      url: "https://pdfobject.com/pdf/sample.pdf",
      isPaid: false,
      price: 0,
      category: "Language",
      language: "am",
      pages: 64
    }
  ],
  videos: [
    {
      id: "v-1",
      title: "How to Setup Flutter & Dart",
      description: "Akkaataa kompiutara keessan irratti Flutter SDK fi Dart install gootanii hojii jalqabdu, Afaan Oromootiin.",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: "15:20",
      category: "Coding",
      language: "om"
    },
    {
      id: "v-2",
      title: "Calculus Limits & Derivatives Complete Guide",
      description: "ስለ ሊሚት እና ዴሪቬቲቭስ ዝርዝር ማብራሪያ በአማርኛ። ለዩኒቨርሲቲ መግቢያ ፈተናዎች የሚጠቅም አጭር ስልት።",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: "22:45",
      category: "Mathematics",
      language: "am"
    },
    {
      id: "v-3",
      title: "Deep Learning Neural Networks Demystified",
      description: "An interactive masterclass on neural networks, activation functions, weights, backpropagation, and artificial intelligence architectures.",
      url: "https://www.w3schools.com/html/movie.mp4",
      duration: "30:10",
      category: "Artificial Intelligence",
      language: "en"
    },
    {
      id: "v-4",
      title: "Newtonian Laws of Motion & Real-world Forces",
      description: "Visual animations proving Newton's three fundamental laws of motion with real-world examples and mathematical exercises.",
      url: "https://www.w3schools.com/html/movie.mp4",
      duration: "18:15",
      category: "Physics",
      language: "en"
    }
  ],
  payments: [],
  chats: []
};

export class LocalDB {
  private static read(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
        return DEFAULT_DB;
      }
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to read database file, returning default schema:", e);
      return DEFAULT_DB;
    }
  }

  private static write(data: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Failed to write database file:", e);
    }
  }

  // --- USERS ---
  static getUsers(): User[] {
    return this.read().users;
  }

  static findUserByEmail(email: string): User | undefined {
    return this.read().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  static findUserById(id: string): User | undefined {
    return this.read().users.find((u) => u.id === id);
  }

  static createUser(user: Omit<User, "id" | "createdAt" | "balance">): User {
    const db = this.read();
    const newUser: User = {
      ...user,
      id: "u-" + Math.random().toString(36).substring(2, 9),
      balance: 100, // seed a default starting simulated wallet with 100 ETB!
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    this.write(db);
    return newUser;
  }

  static updateUser(id: string, updates: Partial<User>): User | undefined {
    const db = this.read();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    db.users[idx] = { ...db.users[idx], ...updates };
    this.write(db);
    return db.users[idx];
  }

  // --- BOOKS ---
  static getBooks(): Book[] {
    return this.read().books;
  }

  static findBookById(id: string): Book | undefined {
    return this.read().books.find((b) => b.id === id);
  }

  static createBook(book: Omit<Book, "id">): Book {
    const db = this.read();
    const newBook: Book = {
      ...book,
      id: "b-" + Math.random().toString(36).substring(2, 9),
    };
    db.books.push(newBook);
    this.write(db);
    return newBook;
  }

  static updateBook(id: string, updates: Partial<Book>): Book | undefined {
    const db = this.read();
    const idx = db.books.findIndex((b) => b.id === id);
    if (idx === -1) return undefined;
    db.books[idx] = { ...db.books[idx], ...updates };
    this.write(db);
    return db.books[idx];
  }

  static deleteBook(id: string): boolean {
    const db = this.read();
    const initialLen = db.books.length;
    db.books = db.books.filter((b) => b.id !== id);
    if (db.books.length === initialLen) return false;
    this.write(db);
    return true;
  }

  // --- VIDEOS ---
  static getVideos(): Video[] {
    return this.read().videos;
  }

  static createVideo(video: Omit<Video, "id">): Video {
    const db = this.read();
    const newVideo: Video = {
      ...video,
      id: "v-" + Math.random().toString(36).substring(2, 9),
    };
    db.videos.push(newVideo);
    this.write(db);
    return newVideo;
  }

  static deleteVideo(id: string): boolean {
    const db = this.read();
    const initialLen = db.videos.length;
    db.videos = db.videos.filter((v) => v.id !== id);
    if (db.videos.length === initialLen) return false;
    this.write(db);
    return true;
  }

  // --- PAYMENTS & PURCHASES ---
  static getPayments(): PaymentTransaction[] {
    return this.read().payments;
  }

  static checkAccess(userId: string, bookId: string): boolean {
    const book = this.findBookById(bookId);
    if (!book) return false;
    if (!book.isPaid) return true; // free book is accessible by everyone

    // check if user is an admin
    const user = this.findUserById(userId);
    if (user && user.role === "admin") return true;

    // check user's purchases
    const db = this.read();
    return db.payments.some(
      (p) => p.userId === userId && p.bookId === bookId && p.status === "success"
    );
  }

  static createPayment(userId: string, bookId: string, amount: number, phone: string): PaymentTransaction {
    const db = this.read();
    const txId = "TXN" + Math.floor(100000 + Math.random() * 900000);
    const newTx: PaymentTransaction = {
      id: "p-" + Math.random().toString(36).substring(2, 9),
      userId,
      bookId,
      amount,
      phone,
      txId,
      status: "pending",
      timestamp: new Date().toISOString(),
    };
    db.payments.push(newTx);
    this.write(db);
    return newTx;
  }

  static completePayment(txId: string, status: "success" | "failed"): PaymentTransaction | undefined {
    const db = this.read();
    const idx = db.payments.findIndex((p) => p.txId === txId);
    if (idx === -1) return undefined;
    db.payments[idx].status = status;

    if (status === "success") {
      // deduct from user's simulated wallet balance if they used wallet balance, or simulate incoming external Telebirr payment
      const p = db.payments[idx];
      const uIdx = db.users.findIndex((u) => u.id === p.userId);
      if (uIdx !== -1) {
        // Just as simulation, if they pay, we deduct from simulated wallet, OR let's say it was loaded externally.
        // Let's add simulation where if they have enough balance we can deduct, or if they simulated Telebirr pay, we add it to records.
      }
    }

    this.write(db);
    return db.payments[idx];
  }

  // --- CHATS ---
  static getChats(userId: string): ChatMessage[] {
    return this.read().chats.filter((c) => c.userId === userId);
  }

  static addChatMessage(userId: string, role: "user" | "model", content: string, language: "en" | "om" | "am"): ChatMessage {
    const db = this.read();
    const msg: ChatMessage = {
      id: "c-" + Math.random().toString(36).substring(2, 9),
      userId,
      role,
      content,
      language,
      timestamp: new Date().toISOString(),
    };
    db.chats.push(msg);
    this.write(db);
    return msg;
  }

  static clearChatHistory(userId: string) {
    const db = this.read();
    db.chats = db.chats.filter((c) => c.userId !== userId);
    this.write(db);
  }
}
