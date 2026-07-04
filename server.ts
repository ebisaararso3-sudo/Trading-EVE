import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { LocalDB } from "./server-db.js"; // Note: tsx supports importing with or without extension, using local file directly

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- LAZY INITIALIZATION OF GEMINI API ---
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not defined or is placeholder. Please configure it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// --- EXPRESS MIDDLEWARE FOR AUTH ---
// To avoid complex JWT setups, we support a simple Authorization header: "Bearer <userId>"
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const userId = authHeader.substring(7);
    const user = LocalDB.findUserById(userId);
    if (user) {
      (req as any).user = user;
    }
  }
  next();
});

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!(req as any).user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = (req as any).user;
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// ==========================================
// ================== API ROUTES ============
// ==========================================

// --- AUTH API ---
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, language } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  const existing = LocalDB.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const user = LocalDB.createUser({
    name,
    email,
    passwordHash: password, // simple storage for demo
    role: "user",
    language: language || "en",
    subscription: "free",
  });

  res.status(201).json({
    message: "Registration successful!",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      language: user.language,
      subscription: user.subscription,
      balance: user.balance,
    },
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Please enter email and password" });
  }

  const user = LocalDB.findUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  res.json({
    message: "Login successful!",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      language: user.language,
      subscription: user.subscription,
      balance: user.balance,
    },
  });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = (req as any).user;
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      language: user.language,
      subscription: user.subscription,
      balance: user.balance,
    },
  });
});

app.put("/api/auth/profile", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { name, language, subscription } = req.body;

  const updated = LocalDB.updateUser(user.id, {
    ...(name && { name }),
    ...(language && { language }),
    ...(subscription && { subscription }),
  });

  res.json({
    message: "Profile updated successfully!",
    user: updated,
  });
});

app.post("/api/auth/add-funds", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const updated = LocalDB.updateUser(user.id, {
    balance: user.balance + Number(amount),
  });

  res.json({
    message: `${amount} ETB added successfully!`,
    balance: updated?.balance,
  });
});

// --- BOOKS API ---
app.get("/api/books", (req, res) => {
  const books = LocalDB.getBooks();
  res.json(books);
});

app.get("/api/books/:id", (req, res) => {
  const book = LocalDB.findBookById(req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

app.get("/api/books/:id/access", requireAuth, (req, res) => {
  const user = (req as any).user;
  const hasAccess = LocalDB.checkAccess(user.id, req.params.id);
  res.json({ hasAccess });
});

app.post("/api/books", requireAuth, (req, res) => {
  const { title, description, url, isPaid, price, category, language, pages } = req.body;
  if (!title || !description || isPaid === undefined || !category || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const book = LocalDB.createBook({
    title,
    description,
    url: url || "https://pdfobject.com/pdf/sample.pdf",
    isPaid,
    price: isPaid ? Number(price || 50) : 0,
    category,
    language,
    pages: Number(pages || 10),
  });

  res.status(201).json({ message: "Book created successfully!", book });
});

app.put("/api/books/:id", requireAuth, requireAdmin, (req, res) => {
  const updated = LocalDB.updateBook(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Book not found" });
  res.json({ message: "Book updated successfully!", book: updated });
});

app.delete("/api/books/:id", requireAuth, requireAdmin, (req, res) => {
  const success = LocalDB.deleteBook(req.params.id);
  if (!success) return res.status(404).json({ error: "Book not found" });
  res.json({ message: "Book deleted successfully!" });
});

// --- VIDEOS API ---
app.get("/api/videos", (req, res) => {
  const videos = LocalDB.getVideos();
  res.json(videos);
});

app.post("/api/videos", requireAuth, (req, res) => {
  const { title, description, url, duration, category, language } = req.body;
  if (!title || !description || !url || !category || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const video = LocalDB.createVideo({
    title,
    description,
    url,
    duration: duration || "10:00",
    category,
    language,
  });

  res.status(201).json({ message: "Video uploaded successfully!", video });
});

app.delete("/api/videos/:id", requireAuth, requireAdmin, (req, res) => {
  const success = LocalDB.deleteVideo(req.params.id);
  if (!success) return res.status(404).json({ error: "Video not found" });
  res.json({ message: "Video deleted successfully!" });
});

// --- PAYMENTS & CHECKOUT SIMULATION ---
app.post("/api/payments/create", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { bookId, phone } = req.body;

  if (!bookId || !phone) {
    return res.status(400).json({ error: "Book ID and Telebirr number are required" });
  }

  const book = LocalDB.findBookById(bookId);
  if (!book) return res.status(404).json({ error: "Book not found" });

  const tx = LocalDB.createPayment(user.id, bookId, book.price, phone);

  res.json({
    message: "Checkout initialized",
    checkoutUrl: `/payment-gateway?txId=${tx.txId}`,
    txId: tx.txId,
    amount: tx.amount,
  });
});

app.post("/api/payments/simulate-otp", (req, res) => {
  const { txId } = req.body;
  if (!txId) return res.status(400).json({ error: "Transaction ID is required" });

  res.json({
    message: "Simulated Telebirr OTP has been sent!",
    otpCode: "123456", // standard dummy verification OTP
  });
});

app.post("/api/payments/simulate-confirm", requireAuth, (req, res) => {
  const user = (req as any).user;
  const { txId, otp } = req.body;

  if (!txId || !otp) {
    return res.status(400).json({ error: "Transaction ID and OTP are required" });
  }

  if (otp !== "123456") {
    return res.status(400).json({ error: "Invalid simulated OTP code" });
  }

  const completed = LocalDB.completePayment(txId, "success");
  if (!completed) return res.status(404).json({ error: "Transaction not found" });

  res.json({
    message: "Payment successfully verified by Telebirr!",
    transaction: completed,
  });
});

// --- CHAT WITH AI TUTOR (GEMINI) ---
app.get("/api/chats", requireAuth, (req, res) => {
  const user = (req as any).user;
  res.json(LocalDB.getChats(user.id));
});

app.post("/api/chats", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const { message, language, bookId, autopilot } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message content is required" });
  }

  const userLang = language || user.language || "en";

  // Store user message
  const userMsg = LocalDB.addChatMessage(user.id, "user", message, userLang);

  // Retrieve chat history to keep Gemini conversational
  const history = LocalDB.getChats(user.id);

  // Retrieve active book context if provided
  let bookContext = "";
  if (bookId) {
    const book = LocalDB.findBookById(bookId);
    if (book) {
      bookContext = `\n\n[CRITICAL LESSON FOCUS]
The student has loaded the textbook: "${book.title}" (Category: ${book.category}, Language: ${book.language}, Total Pages: ${book.pages}).
Book Description: ${book.description}
Your primary mission is to teach content exclusively related to this textbook.
${autopilot ? "AUTOPILOT TUTOR MODE is ACTIVE! Guide the user step-by-step through the topics of this book. Keep lessons structured, interactive, and check if they understand after each small section." : "Answer any questions they have about this book specifically using the context of the book description and details provided."}`;
    }
  }

  // Build appropriate system prompt
  const systemPrompt = `You are 'SmartBook AI Tutor', an expert educational virtual assistant and friendly teacher for Ethiopian students.
You teach subjects like computer science/Flutter coding, mathematics, physics, geography, and language grammar.
You are fluent in English, Afaan Oromoo, and Amharic.
The current student's language setting is: ${userLang === "om" ? "Afaan Oromoo" : userLang === "am" ? "Amharic" : "English"}.
If they ask in Afaan Oromoo or Amharic, you MUST reply entirely in that language with clear educational terminology.
If they ask in English, reply in English.
Provide step-by-step, simplified explanations. Include real-world Ethiopian examples where appropriate (e.g. trading in Mercato, distances between Addis Ababa and Adama, Ethiopian geography, or writing Afaan Oromoo/Amharic sentences).
Break down code or equations beautifully. Be supportive, warm, and encouraging.${bookContext}`;

  try {
    // Lazy initialize Gemini
    const ai = getGeminiClient();

    // Map existing history into structure for generateContent or chat
    // Since we want simple chat structure, let's pass a list of messages.
    // In @google/genai, ai.models.generateContent accepts 'contents'.
    // We can compile the full conversation history into a structured text prompt for simpler token management,
    // or pass them in a structured contents format.
    // Let's create a conversational prompt.
    const contents: any[] = [];
    
    // Add history
    const contextPrompt = history.slice(-10).map(c => {
      const roleLabel = c.role === "user" ? "Student" : "SmartBook AI Tutor";
      return `${roleLabel}: ${c.content}`;
    }).join("\n");

    const fullPrompt = `System Context:\n${systemPrompt}\n\nChat History:\n${contextPrompt}\n\nStudent: ${message}\nSmartBook AI Tutor:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
    });

    const aiText = response.text || "I apologize, I could not formulate a response at this time.";

    // Store AI reply
    const modelMsg = LocalDB.addChatMessage(user.id, "model", aiText, userLang);

    res.json({
      userMessage: userMsg,
      modelResponse: modelMsg,
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);

    // Provide detailed offline/simulation mode when Gemini Key is missing, so it doesn't break app experience
    let friendlyReply = "";
    if (bookId) {
      const book = LocalDB.findBookById(bookId);
      const bookTitle = book ? book.title : "this textbook";
      if (userLang === "om") {
        friendlyReply = `💡 **[SmartBook AI Tutor - Offline]** Kitaaba filatte "${bookTitle}" keessaa barachaa jirta. Seensa koodii, barumsa herregaa ykn fiiziksii kitaaba kana keessatti argamu hunda gadi fageenyaan siif ibsa! Mee maal irratti akka si gargaaru barbaadda? (API Key configure gochuun live AI dandeessa)`;
      } else if (userLang === "am") {
        friendlyReply = `💡 **[SmartBook AI Tutor - Offline]** መማሪያ መጽሐፍ "${bookTitle}" መርጠዋል። የዚህን መጽሐፍ ምዕራፎች፣ ፅንሰ-ሃሳቦች እና ጥያቄዎች በዝርዝር ለማስተማር ዝግጁ ነኝ! በምን ልርዳዎት? (Gemini API ቁልፍ ሲዋቀር የቀጥታ ኤአይ ትምህርት ይነቃ)`;
      } else {
        friendlyReply = `💡 **[SmartBook AI Tutor - Offline]** You are currently studying "${bookTitle}". I am fully prepared to teach you chapter-by-chapter and solve any practice questions from this book! What section should we explore first? (Configure GEMINI_API_KEY for live tutoring)`;
      }
    } else if (error.message && error.message.includes("GEMINI_API_KEY")) {
      // Simulate tutor answers based on keywords
      const lower = message.toLowerCase();
      if (lower.includes("flutter") || lower.includes("dart") || lower.includes("code")) {
        friendlyReply = userLang === "om"
          ? "💡 **[Tutor Gorsa Offline]** Flutter bu'uura isaa koodii hojjechuuf, jalqaba 'Widget' maali akka ta'e beekuu qabda. Flutter keessatti hundi isaanii Widget dha! Fakkeenyaaf, koodiin seensaa: \n```dart\nvoid main() {\n  runApp(Text('Baga Nagaan Dhuftan!'));\n}\n```\n*(Api Key hin dhimmanne, simulated mode)*"
          : userLang === "am"
            ? "💡 **[የትምህርት ፈጣን ምላሽ]** ፍላተርን ለመማር መጀመሪያ 'Widget' ምን እንደሆነ መረዳት አለብዎት። በፍላተር ውስጥ ሁሉም ነገር ዊጄት ነው። ለምሳሌ:\n```dart\nvoid main() {\n  runApp(Text('እንኳን ደህና መጡ!'));\n}\n```\n*(Gemini API ቁልፍ ስላልተዋቀረ በሲሙሌሽን የተሰጠ ምላሽ)*"
            : "💡 **[Tutor Offline Mode]** To get started with Flutter, understand that 'Everything is a Widget'. Here is a basic Hello World example in Dart:\n```dart\nimport 'package:flutter/material.dart';\nvoid main() => runApp(const MaterialApp(home: Scaffold(body: Center(child: Text('Hello SmartBook!')))));\n```\n*(Please add your GEMINI_API_KEY in the Secrets panel to activate live AI tutoring.)*";
      } else if (lower.includes("math") || lower.includes("calculus") || lower.includes("limit")) {
        friendlyReply = userLang === "om"
          ? "💡 **[Tutor Gorsa Offline]** Hiika herregaa 'Limit' jechuun: gatiin fankshinii tokkoo yeroo inni gara point tokkootti dhiyaatu dha. Fakkeenyaaf:\n$$\\lim_{{x \\to 2}} (3x + 1) = 3(2) + 1 = 7$$"
          : userLang === "am"
            ? "💡 **[የትምህርት ፈጣን ምላሽ]** ሊሚት (Limits) ማለት አንድ ፋንክሽን ወደ አንድ የተወሰነ ቁጥር ሲጠጋ የሚኖረው ዋጋ ነው። ለምሳሌ:\n$$\\lim_{{x \\to 2}} (3x + 1) = 3(2) + 1 = 7$$"
            : "💡 **[Tutor Offline Mode]** In calculus, a Limit describes the value that a function approaches as the input approaches some value. For example:\n$$\\lim_{{x \\to 2}} (3x + 1) = 3(2) + 1 = 7$$";
      } else {
        friendlyReply = userLang === "om"
          ? `💡 **[SmartBook AI Tutor - Simulation]** Gaaffii kee: "${message}" simatameera. Gargaaraa barnootaa siif ta'uuf qophiidha! Live AI gochuuf mee kiisii keetti GEMINI_API_KEY dabali.`
          : userLang === "am"
            ? `💡 **[SmartBook AI Tutor - ሲሙሌሽን]** ጥያቄዎ: "${message}" ደርሶኛል። እርስዎን ለማስተማር ሁል ጊዜ ዝግጁ ነኝ! ሙሉውን የኤአይ ትምህርት ለማግኘት እባክዎ በሴቲንግ ውስጥ የGemini API ቁልፍ ያስገቡ።`
            : `💡 **[SmartBook AI Tutor - Offline Simulation]** I received your question: "${message}". I am fully prepared to teach you step-by-step! To activate real-time Gemini intelligence, configure your GEMINI_API_KEY in the Secrets panel.`;
      }
    } else {
      friendlyReply = `⚠️ I encountered an error communicating with the AI Brain: ${error.message || "Unknown error"}.`;
    }

    const modelMsg = LocalDB.addChatMessage(user.id, "model", friendlyReply, userLang);
    res.json({
      userMessage: userMsg,
      modelResponse: modelMsg,
      isSimulated: true,
    });
  }
});

app.post("/api/chats/clear", requireAuth, (req, res) => {
  const user = (req as any).user;
  LocalDB.clearChatHistory(user.id);
  res.json({ message: "Chat history cleared successfully!" });
});

// --- ADMIN STATS API ---
app.get("/api/admin/stats", requireAuth, requireAdmin, (req, res) => {
  const users = LocalDB.getUsers();
  const books = LocalDB.getBooks();
  const videos = LocalDB.getVideos();
  const payments = LocalDB.getPayments();

  const totalRevenue = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  const transactions = payments.map((p) => {
    const buyer = users.find((u) => u.id === p.userId);
    const book = books.find((b) => b.id === p.bookId);
    return {
      ...p,
      buyerName: buyer ? buyer.name : "Unknown Student",
      bookTitle: book ? book.title : "Unknown Book",
    };
  });

  res.json({
    totalUsers: users.length,
    totalBooks: books.length,
    totalVideos: videos.length,
    totalRevenue,
    transactions,
  });
});

// ==========================================
// ========== FRONTEND STATIC SERVING =======
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite middleware setup for Development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartBook AI full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
