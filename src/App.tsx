import React, { useState, useEffect } from "react";
import { Book, Video, User, FeedPost } from "./types";
import { translations } from "./languages";

// Modular Components
import Splash from "./components/Splash";
import Login from "./components/Login";
import BookViewer from "./components/BookViewer";
import VideoPlayer from "./components/VideoPlayer";
import TelebirrModal from "./components/TelebirrModal";
import AiTutorChat from "./components/AiTutorChat";
import AdminPanel from "./components/AdminPanel";
import UploadModal from "./components/UploadModal";
import CameraView from "./components/CameraView";

import {
  GraduationCap,
  Home as HomeIcon,
  BookOpen,
  Video as VideoIcon,
  MessageSquare,
  User as UserIcon,
  Sparkles,
  Search,
  Lock,
  Wallet,
  LogOut,
  ChevronRight,
  BookMarked,
  Languages,
  PlusCircle,
  PlayCircle,
  Camera,
  Heart,
  MessageCircle,
  Share2,
  Tv,
  ArrowUpCircle,
  TrendingUp,
  Image as ImageIcon,
  Smile,
  AlertCircle,
  X,
  Volume2
} from "lucide-react";

export default function App() {
  // Navigation & Lifecycle
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "books" | "videos" | "ai" | "profile" | "admin">("home");

  // Content Catalogs
  const [books, setBooks] = useState<Book[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<"all" | "en" | "om" | "am">("all");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<"all" | "free" | "paid">("all");

  // Interactive Overlays
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [activeCheckoutBook, setActiveCheckoutBook] = useState<Book | null>(null);

  // Upload Social States
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showCameraRecorder, setShowCameraRecorder] = useState(false);
  const [showTextPostModal, setShowTextPostModal] = useState(false);
  const [showAiArtModal, setShowAiArtModal] = useState(false);
  const [aiArtPrompt, setAiArtPrompt] = useState("");
  const [postTextContent, setPostTextContent] = useState("");

  // Dynamic media uploads state controllers
  const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
  const [showBookUploadModal, setShowBookUploadModal] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);

  // Video wizard inputs
  const [videoTitleInput, setVideoTitleInput] = useState("");
  const [videoDescInput, setVideoDescInput] = useState("");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [videoCategoryInput, setVideoCategoryInput] = useState("Technology");
  const [videoLangInput, setVideoLangInput] = useState<"en" | "om" | "am">("en");

  // Book wizard inputs
  const [bookTitleInput, setBookTitleInput] = useState("");
  const [bookDescInput, setBookDescInput] = useState("");
  const [bookUrlInput, setBookUrlInput] = useState("");
  const [bookCategoryInput, setBookCategoryInput] = useState("Coding");
  const [bookLangInput, setBookLangInput] = useState<"en" | "om" | "am">("en");
  const [bookPagesInput, setBookPagesInput] = useState("12");
  const [bookIsPaidInput, setBookIsPaidInput] = useState(false);
  const [bookPriceInput, setBookPriceInput] = useState("50");

  // Photo wizard inputs
  const [photoCaptionInput, setPhotoCaptionInput] = useState("");
  const [photoUrlInput, setPhotoUrlInput] = useState("");

  // Stories List State
  const [stories, setStories] = useState([
    {
      id: "story-user",
      name: "Your Story",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
      hasStory: false,
      isUser: true
    },
    {
      id: "story-abdi",
      name: "Abdi T.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=1000",
      hasStory: true
    },
    {
      id: "story-selam",
      name: "Selam M.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000",
      hasStory: true
    },
    {
      id: "story-mekdes",
      name: "Mekdes T.",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
      hasStory: true
    },
    {
      id: "story-lidiya",
      name: "Lidiya",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1000",
      hasStory: true
    }
  ]);

  const [activeStoryViewer, setActiveStoryViewer] = useState<typeof stories[0] | null>(null);

  // Dynamic Feed State
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: "feed-1",
      authorName: "Abdi Tech",
      authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      authorRole: "Senior Flutter Instructor",
      followers: "12.5k",
      timeAgo: "2 hours ago",
      caption: "💡 Akkaataa salphaa ta'een koodii Flutter baradhaa! Vidiyo haaraa koo daawwadhaa. #SmartbookAIJourney",
      videoTitle: "TOP 5 AI TOOLS IN 2026",
      videoDuration: "8:45",
      videoThumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 245,
      comments: 42,
      shares: 19,
      likedByUser: false
    },
    {
      id: "feed-2",
      authorName: "Selam Media",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
      authorRole: "Trilingual Physics Coach",
      followers: "34.2k",
      timeAgo: "5 hours ago",
      caption: "Baga nagaan gara channel koo dhuftan! Har'a seenaa fi herrega wal-qabsiifnee ilaalla 💖 #Education #Maths",
      videoTitle: "Simulated Physics Gravity Experiment",
      videoDuration: "14:10",
      videoThumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://www.w3schools.com/html/movie.mp4",
      likes: 189,
      comments: 26,
      shares: 8,
      likedByUser: false
    }
  ]);

  // Selected post to watch video content inline
  const [playingFeedPostId, setPlayingFeedPostId] = useState<string | null>(null);

  // Cross-component state
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);
  const [lang, setLang] = useState<"en" | "om" | "am">("en");
  const [token, setToken] = useState("");

  const t = translations[lang];

  // Auto-login and load data on boot
  useEffect(() => {
    const savedUserId = localStorage.getItem("smartbook_userId");
    const savedLang = localStorage.getItem("smartbook_lang") as "en" | "om" | "am" | null;

    if (savedLang) {
      setLang(savedLang);
    }

    if (savedUserId) {
      setToken(savedUserId);
      fetchUserData(savedUserId);
    }
    fetchCatalog();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${userId}` },
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        if (data.user.language) {
          setLang(data.user.language);
        }
      } else {
        handleLogout();
      }
    } catch (e) {
      console.error("Auto login error:", e);
    }
  };

  const fetchCatalog = async () => {
    try {
      const bRes = await fetch("/api/books");
      const bData = await bRes.json();
      if (Array.isArray(bData)) setBooks(bData);

      const vRes = await fetch("/api/videos");
      const vData = await vRes.json();
      if (Array.isArray(vData)) setVideos(vData);
    } catch (e) {
      console.error("Failed to load catalog:", e);
    }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setToken(loggedInUser.id);
    setLang(loggedInUser.language);
    localStorage.setItem("smartbook_userId", loggedInUser.id);
    localStorage.setItem("smartbook_lang", loggedInUser.language);
    fetchCatalog();
    setActiveTab("home");
  };

  const handleLogout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("smartbook_userId");
    setActiveTab("home");
    setActiveBook(null);
    setActiveVideo(null);
    setActiveCheckoutBook(null);
  };

  const handleLangChange = async (newLang: "en" | "om" | "am") => {
    setLang(newLang);
    localStorage.setItem("smartbook_lang", newLang);

    if (user) {
      try {
        const res = await fetch("/api/auth/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ language: newLang }),
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleWalletAddFunds = async (amount: number) => {
    if (!user) return;
    try {
      const res = await fetch("/api/auth/add-funds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => prev ? { ...prev, balance: data.balance } : null);
        alert(`${amount} ETB added successfully!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenBook = async (book: Book) => {
    if (!user) return;
    if (!book.isPaid) {
      setActiveBook(book);
      return;
    }

    try {
      const res = await fetch(`/api/books/${book.id}/access`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.hasAccess) {
        setActiveBook(book);
      } else {
        setActiveCheckoutBook(book);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Video upload submission handler
  const handleUploadVideoSubmit = async () => {
    if (!videoTitleInput.trim() || !videoDescInput.trim()) {
      alert("Please fill in all required fields!");
      return;
    }

    const videoUrl = videoUrlInput.trim() || "https://www.w3schools.com/html/mov_bbb.mp4";
    const defaultThumbnails = [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    ];
    const thumb = defaultThumbnails[Math.floor(Math.random() * defaultThumbnails.length)];

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: videoTitleInput,
          description: videoDescInput,
          url: videoUrl,
          duration: "10:15",
          category: videoCategoryInput,
          language: videoLangInput
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload video");

      // Append to feed
      const newPost: FeedPost = {
        id: "feed-video-" + Date.now(),
        authorName: user?.name || "Student Chala",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
        authorRole: "Educational Content Creator",
        timeAgo: "Just now",
        caption: `🎥 **Uploaded New Video Lecture**\n\n"${videoTitleInput}"\n\nCategory: ${videoCategoryInput} | Language: ${videoLangInput === "om" ? "Afaan Oromoo" : videoLangInput === "am" ? "አማርኛ" : "English"}\n\n${videoDescInput}`,
        videoTitle: videoTitleInput,
        videoDuration: "10:15",
        videoThumbnail: thumb,
        videoUrl: videoUrl,
        likes: 5,
        comments: 0,
        shares: 2,
        likedByUser: false
      };

      setFeedPosts([newPost, ...feedPosts]);
      await fetchCatalog();
      setShowVideoUploadModal(false);
      
      // Clear inputs
      setVideoTitleInput("");
      setVideoDescInput("");
      setVideoUrlInput("");
      
      alert("Video lecture published and posted successfully!");
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  // Book upload submission handler
  const handleUploadBookSubmit = async () => {
    if (!bookTitleInput.trim() || !bookDescInput.trim()) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: bookTitleInput,
          description: bookDescInput,
          url: bookUrlInput.trim() || "https://pdfobject.com/pdf/sample.pdf",
          isPaid: bookIsPaidInput,
          price: bookIsPaidInput ? Number(bookPriceInput) : 0,
          category: bookCategoryInput,
          language: bookLangInput,
          pages: Number(bookPagesInput)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload book");

      // Append to feed
      const newPost: FeedPost = {
        id: "feed-book-" + Date.now(),
        authorName: user?.name || "Student Chala",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
        authorRole: "Student Publisher",
        timeAgo: "Just now",
        caption: `📚 **Uploaded New Textbook**\n\n"${bookTitleInput}"\n\nCategory: ${bookCategoryInput} | Language: ${bookLangInput === "om" ? "Afaan Oromoo" : bookLangInput === "am" ? "አማርኛ" : "English"} | Pages: ${bookPagesInput}\n\n${bookDescInput}\n\n*Study with our AI Tutor now to master this book step-by-step!*`,
        videoTitle: "New PDF Study Book",
        videoThumbnail: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=800",
        likes: 8,
        comments: 0,
        shares: 4,
        likedByUser: false
      };

      setFeedPosts([newPost, ...feedPosts]);
      await fetchCatalog();
      setShowBookUploadModal(false);

      // Clear inputs
      setBookTitleInput("");
      setBookDescInput("");
      setBookUrlInput("");
      setBookIsPaidInput(false);

      alert("Textbook registered and posted successfully! It is now live in Books Catalog and ready to study in AI Coach space.");
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  // Photo upload submission handler
  const handleUploadPhotoSubmit = () => {
    if (!photoCaptionInput.trim()) {
      alert("Please enter a caption!");
      return;
    }

    const defaultPhotos = [
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
    ];
    const imgUrl = photoUrlInput.trim() || defaultPhotos[Math.floor(Math.random() * defaultPhotos.length)];

    const newPost: FeedPost = {
      id: "feed-photo-" + Date.now(),
      authorName: user?.name || "Student Chala",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      authorRole: "Student Visualist",
      timeAgo: "Just now",
      caption: photoCaptionInput,
      videoThumbnail: imgUrl,
      likes: 10,
      comments: 0,
      shares: 1,
      likedByUser: false
    };

    setFeedPosts([newPost, ...feedPosts]);
    setShowPhotoUploadModal(false);
    setPhotoCaptionInput("");
    setPhotoUrlInput("");
    alert("Photo post published successfully to feed!");
  };

  const handleAskTutor = (prompt: string) => {
    setTutorInitialPrompt(prompt);
    setActiveBook(null);
    setActiveVideo(null);
    setActiveTab("ai");
  };

  // Like Toggle Function
  const handleLikePost = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.likedByUser;
          return {
            ...post,
            likedByUser: isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  // Social Bottom Sheet triggers
  const handleSelectUploadOption = (option: "video" | "live" | "art" | "post" | "story") => {
    setShowUploadMenu(false);
    if (option === "video") {
      setShowVideoUploadModal(true);
    } else if (option === "live") {
      alert("Simulating Trilingual Classroom Live Streaming Broadcast! Starting encoder...");
    } else if (option === "art") {
      setShowAiArtModal(true);
    } else if (option === "post") {
      setShowTextPostModal(true);
    } else if (option === "story") {
      // Add a dynamic story
      setStories((prev) =>
        prev.map((s) => (s.isUser ? { ...s, hasStory: true } : s))
      );
      alert("Successfully created a new story! Tap on 'Your Story' to watch it.");
    }
  };

  // Post creation handler from CameraView Story Maker
  const handleCameraPostCreated = (postData: { caption: string; speed: string; filter: string }) => {
    setShowCameraRecorder(false);
    const newPostId = "feed-custom-" + Date.now();
    const newPost: FeedPost = {
      id: newPostId,
      authorName: user?.name || "Student Chala",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      authorRole: `Level ${speedFilterText(postData.speed)} Learner`,
      timeAgo: "Just now",
      caption: postData.caption,
      videoTitle: `AI Creation (${postData.filter} filter)`,
      videoDuration: "0:15",
      videoThumbnail: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=800",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      likes: 1,
      comments: 0,
      shares: 0,
      likedByUser: false,
    };
    setFeedPosts([newPost, ...feedPosts]);
    alert("Smart Book AI Journey video posted successfully!");
    setActiveTab("home");
  };

  const speedFilterText = (speed: string) => {
    return speed === "1x" ? "Standard" : speed === "2x" ? "Fast" : "Slow";
  };

  // AI Art Generation Post handler
  const handleGenerateAiArt = () => {
    if (!aiArtPrompt.trim()) return;
    const newPostId = "feed-art-" + Date.now();
    const artImages = [
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800", // abstract neon
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800", // painting
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"  // modern neon chip
    ];
    const chosenArt = artImages[Math.floor(Math.random() * artImages.length)];

    const newPost: FeedPost = {
      id: newPostId,
      authorName: user?.name || "Chala Tolera",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      authorRole: "AI Digital Artist",
      timeAgo: "Just now",
      caption: `🤖 Prompt: "${aiArtPrompt}"\nGenerated via SmartBook AI Art Creator.`,
      videoTitle: "AI Art Artwork Showcase",
      videoThumbnail: chosenArt,
      likes: 12,
      comments: 1,
      shares: 0,
      likedByUser: false
    };

    setFeedPosts([newPost, ...feedPosts]);
    setShowAiArtModal(false);
    setAiArtPrompt("");
    alert("AI Art generated & showcase published!");
    setActiveTab("home");
  };

  // Community Text Post Handler
  const handlePublishTextPost = () => {
    if (!postTextContent.trim()) return;
    const newPostId = "feed-text-" + Date.now();
    const newPost: FeedPost = {
      id: newPostId,
      authorName: user?.name || "Chala Tolera",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      authorRole: "Community Student",
      timeAgo: "Just now",
      caption: postTextContent,
      likes: 3,
      comments: 0,
      shares: 0,
      likedByUser: false
    };
    setFeedPosts([newPost, ...feedPosts]);
    setShowTextPostModal(false);
    setPostTextContent("");
    alert("Community update published successfully!");
    setActiveTab("home");
  };

  // Filter lists based on search & language tags
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = selectedLanguageFilter === "all" || b.language === selectedLanguageFilter;
    const matchesPrice =
      selectedPriceFilter === "all" ||
      (selectedPriceFilter === "free" && !b.isPaid) ||
      (selectedPriceFilter === "paid" && b.isPaid);
    return matchesSearch && matchesLang && matchesPrice;
  });

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = selectedLanguageFilter === "all" || v.language === selectedLanguageFilter;
    return matchesSearch && matchesLang;
  });

  // Render Splash Screen
  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  // Render Auth flow if not logged in
  if (!user) {
    return <Login onSuccess={handleLoginSuccess} lang={lang} setLang={handleLangChange} />;
  }

  // Active book viewer mode
  if (activeBook) {
    return (
      <BookViewer
        book={activeBook}
        lang={lang}
        onBack={() => {
          setActiveBook(null);
          fetchCatalog();
        }}
        onAskTutor={handleAskTutor}
      />
    );
  }

  // Active video lecture player mode
  if (activeVideo) {
    return (
      <VideoPlayer
        video={activeVideo}
        lang={lang}
        onBack={() => setActiveVideo(null)}
        onAskTutor={handleAskTutor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-gray-800 flex flex-col font-sans select-none pb-20 md:pb-0 md:pl-64 relative overflow-x-hidden">
      
      {/* SIDEBAR NAVIGATION - Desktop only */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 z-20 hidden md:flex">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-[#7B53F4] to-[#5B37D4] p-2.5 rounded-2xl text-white shadow-lg shadow-purple-500/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 font-sans">
                SmartBook <span className="text-[#5B37D4]">AI</span>
              </h1>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Trilingual Hub</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("home")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === "home" ? "bg-[#F3F1FD] text-[#5B37D4]" : "text-gray-500 hover:text-[#5B37D4] hover:bg-gray-50"
              }`}
            >
              <HomeIcon className="h-4.5 w-4.5" />
              {t.tabHome}
            </button>
            <button
              onClick={() => setActiveTab("books")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === "books" ? "bg-[#F3F1FD] text-[#5B37D4]" : "text-gray-500 hover:text-[#5B37D4] hover:bg-gray-50"
              }`}
            >
              <BookOpen className="h-4.5 w-4.5" />
              {t.tabBooks}
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === "videos" ? "bg-[#F3F1FD] text-[#5B37D4]" : "text-gray-500 hover:text-[#5B37D4] hover:bg-gray-50"
              }`}
            >
              <VideoIcon className="h-4.5 w-4.5" />
              {t.tabVideos}
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === "ai" ? "bg-[#F3F1FD] text-[#5B37D4]" : "text-gray-500 hover:text-[#5B37D4] hover:bg-gray-50"
              }`}
            >
              <MessageSquare className="h-4.5 w-4.5" />
              Ammaa & AI
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === "profile" ? "bg-[#F3F1FD] text-[#5B37D4]" : "text-gray-500 hover:text-[#5B37D4] hover:bg-gray-50"
              }`}
            >
              <UserIcon className="h-4.5 w-4.5" />
              {t.tabProfile}
            </button>

            {user.role === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all border border-dashed cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                    : "text-emerald-600 border-emerald-500/20 hover:text-white hover:bg-emerald-500"
                }`}
              >
                <Sparkles className="h-4.5 w-4.5" />
                {t.tabAdmin}
              </button>
            )}
          </nav>
        </div>

        {/* Sidebar bottom user info */}
        <div className="border-t border-gray-100 pt-4 space-y-4 text-left">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 text-[#5B37D4] p-2.5 rounded-xl font-bold text-xs uppercase shrink-0">
              {user.name.substring(0, 2)}
            </div>
            <div className="truncate">
              <h4 className="text-xs font-black text-gray-900 truncate">{user.name}</h4>
              <span className="text-[10px] text-gray-400 font-bold block truncate capitalize">{user.subscription} student</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 justify-center py-2.5 border border-gray-200 hover:border-red-500/50 text-gray-500 hover:text-red-500 rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            {t.logoutBtn}
          </button>
        </div>
      </aside>

      {/* TOP HEADER BAR (Multi-device matching Screenshot colors) */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 px-4 sm:px-6 py-3.5 flex items-center justify-between text-gray-800">
        
        {/* Mobile menu branding logo */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="bg-gradient-to-tr from-[#7B53F4] to-[#5B37D4] p-1.5 rounded-xl text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h1 className="text-base font-black tracking-tight text-gray-900 font-sans">
            smartbook <span className="text-[#5B37D4]">ai</span>
          </h1>
        </div>

        {/* Desktop Global Search */}
        <div className="relative hidden sm:block max-w-xs w-full">
          <Search className="absolute inset-y-0 left-0 pl-3 h-full w-4 text-gray-400 flex items-center pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="block w-full pl-9 pr-3 py-2 bg-gray-50 hover:bg-gray-100 focus:bg-white rounded-2xl border border-gray-200 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs font-semibold text-gray-800 placeholder-gray-400 transition-all"
          />
        </div>

        {/* Top-right settings */}
        <div className="flex items-center gap-4">
          {/* Quick wallet button */}
          <div 
            onClick={() => setActiveTab("profile")}
            className="bg-purple-50 hover:bg-purple-100 cursor-pointer rounded-2xl px-3.5 py-1.5 flex items-center gap-2 border border-purple-100/50 transition-all"
          >
            <Wallet className="h-4 w-4 text-[#5B37D4]" />
            <div className="text-left">
              <span className="text-[8px] font-bold text-[#5B37D4] block tracking-wider uppercase">Wallet</span>
              <span className="text-xs font-black text-gray-900 font-mono">{user.balance} ETB</span>
            </div>
          </div>

          {/* Quick language selector */}
          <div className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 transition-colors px-3 py-1.5 rounded-2xl border border-gray-200">
            <Languages className="h-4 w-4 text-gray-400" />
            <select
              value={lang}
              onChange={(e) => handleLangChange(e.target.value as any)}
              className="text-xs font-bold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="om">OM</option>
              <option value="am">አማ</option>
            </select>
          </div>
        </div>
      </header>

      {/* PRIMARY VIEWER CONTAINER */}
      <main className="flex-1 relative z-10">
        
        {/* ======================================= */}
        {/* TAB 1: SOCIAL-STYLE PORTAL FEED (Screenshot 5) */}
        {/* ======================================= */}
        {activeTab === "home" && (
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-200 text-left">
            
            {/* 1. STORIES SECTION (Screenshot 5: Horizontal Stories) */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3.5 ml-1">
                Recent Smart Stories
              </h3>
              
              <div className="flex gap-4 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
                {stories.map((story) => (
                  <button
                    key={story.id}
                    onClick={() => {
                      if (story.isUser && !story.hasStory) {
                        setShowUploadMenu(true);
                      } else {
                        setActiveStoryViewer(story);
                      }
                    }}
                    className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none cursor-pointer group"
                  >
                    <div className="relative">
                      <img
                        src={story.avatar}
                        alt={story.name}
                        className={`h-14 w-14 rounded-full object-cover p-0.5 border-2 ${
                          story.hasStory 
                            ? "border-purple-600 ring-2 ring-purple-100 animate-pulse" 
                            : "border-gray-200"
                        } group-hover:scale-105 transition-transform`}
                      />
                      {story.isUser && !story.hasStory && (
                        <span className="absolute bottom-0 right-0 h-5 w-5 bg-purple-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-xs">
                          +
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 group-hover:text-gray-900 truncate max-w-[64px]">
                      {story.isUser ? "You" : story.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. "WHAT'S ON YOUR MIND?" CARD (Screenshot 5: Post Box) */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-3.5">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                  alt="Student Avatar"
                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
                />
                
                {/* Clickable input trigger */}
                <button
                  onClick={() => setShowTextPostModal(true)}
                  className="flex-1 bg-[#F1F4FA] hover:bg-gray-100 text-left px-5 py-3 rounded-full text-xs font-semibold text-gray-500 transition-colors cursor-pointer"
                >
                  {lang === "om" ? "Barreessi ykn waa uumi..." : lang === "am" ? "የተሰማዎትን ይጻፉ ወይም የሆነ ነገር ይፍጠሩ..." : "What's on your mind, student?"}
                </button>
              </div>

              <div className="border-t border-gray-100 pt-3 grid grid-cols-4 gap-1">
                {/* Tool 1: Upload Video */}
                <button
                  onClick={() => setShowVideoUploadModal(true)}
                  className="flex flex-col items-center justify-center gap-1 py-1.5 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all text-[10px] font-black text-red-500 cursor-pointer"
                >
                  <VideoIcon className="h-4.5 w-4.5 text-red-500 animate-pulse" />
                  {lang === "om" ? "Vidio" : lang === "am" ? "ቪዲዮ" : "Video"}
                </button>

                {/* Tool 2: Upload PDF Book */}
                <button
                  onClick={() => setShowBookUploadModal(true)}
                  className="flex flex-col items-center justify-center gap-1 py-1.5 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all text-[10px] font-black text-indigo-600 cursor-pointer"
                >
                  <BookOpen className="h-4.5 w-4.5 text-indigo-500" />
                  {lang === "om" ? "Kitaaba" : lang === "am" ? "መጽሐፍ" : "Book/PDF"}
                </button>

                {/* Tool 3: Upload Photo */}
                <button
                  onClick={() => setShowPhotoUploadModal(true)}
                  className="flex flex-col items-center justify-center gap-1 py-1.5 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all text-[10px] font-black text-emerald-600 cursor-pointer"
                >
                  <ImageIcon className="h-4.5 w-4.5 text-emerald-500" />
                  {lang === "om" ? "Suraa" : lang === "am" ? "ፎቶ" : "Photo"}
                </button>

                {/* Tool 4: AI Art Prompt */}
                <button
                  onClick={() => setShowAiArtModal(true)}
                  className="flex flex-col items-center justify-center gap-1 py-1.5 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all text-[10px] font-black text-[#5B37D4] cursor-pointer"
                >
                  <Sparkles className="h-4.5 w-4.5 text-[#5B37D4]" />
                  AI Art
                </button>
              </div>
            </div>

            {/* 3. DYNAMIC SOCIAL VIDEOS FEED (Screenshot 5: Feed items) */}
            <div className="space-y-6">
              {feedPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                  
                  {/* Header Author Info */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="h-10 w-10 rounded-full object-cover border border-purple-100 shadow-sm"
                      />
                      <div className="text-left">
                        <h4 className="text-xs font-black text-gray-900 leading-tight">
                          {post.authorName}
                        </h4>
                        <span className="text-[9px] text-gray-400 font-bold block mt-0.5 uppercase tracking-wider">
                          {post.authorRole || "Student"} • {post.timeAgo}
                        </span>
                      </div>
                    </div>

                    {post.followers && (
                      <span className="text-[9px] bg-purple-50 text-[#5B37D4] font-black px-2.5 py-1 rounded-full border border-purple-100/50">
                        {post.followers} followers
                      </span>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="px-4 pb-3">
                    <p className="text-xs font-semibold text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {post.caption}
                    </p>
                  </div>

                  {/* Video/Image Content Space */}
                  {post.videoThumbnail && (
                    <div className="px-4 pb-4">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-gray-100 group shadow-md flex items-center justify-center">
                        {playingFeedPostId === post.id && post.videoUrl ? (
                          <video
                            src={post.videoUrl}
                            autoPlay
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <img
                              src={post.videoThumbnail}
                              alt="Post Artwork"
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              {post.videoUrl ? (
                                <button
                                  onClick={() => setPlayingFeedPostId(post.id)}
                                  className="h-14 w-14 bg-white hover:bg-purple-100 text-[#5B37D4] rounded-full flex items-center justify-center shadow-2xl scale-95 group-hover:scale-100 transition-all cursor-pointer"
                                >
                                  <PlayCircle className="h-8 w-8" />
                                </button>
                              ) : (
                                <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-wider">
                                  AI Image Creation
                                </span>
                              )}
                            </div>
                            
                            {post.videoDuration && (
                              <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-[9px] text-white font-mono font-bold">
                                {post.videoDuration}
                              </div>
                            )}

                            {post.videoTitle && (
                              <div className="absolute bottom-3 left-3 bg-purple-900/90 backdrop-blur-md px-3 py-1 rounded-xl text-[9px] text-white font-extrabold shadow">
                                📺 {post.videoTitle}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bottom Stats & Actions bar */}
                  <div className="bg-gray-50/50 border-t border-gray-100 px-4 py-2.5 flex items-center justify-between text-gray-500 text-xs font-bold">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1.5 py-1 px-3 rounded-full transition-colors cursor-pointer ${
                        post.likedByUser ? "text-red-500 bg-red-50" : "hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Heart className={`h-4.5 w-4.5 ${post.likedByUser ? "fill-red-500" : ""}`} />
                      {post.likes}
                    </button>

                    <button
                      onClick={() => {
                        const comment = prompt("Add a trilingual study comment:");
                        if (comment) {
                          alert(`Comment published successfully under post of ${post.authorName}!`);
                        }
                      }}
                      className="flex items-center gap-1.5 py-1 px-3 hover:bg-gray-100 rounded-full transition-colors hover:text-gray-900 cursor-pointer"
                    >
                      <MessageCircle className="h-4.5 w-4.5" />
                      {post.comments}
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`Check out this smart update by ${post.authorName}!`);
                        alert("Link copied to clipboard!");
                      }}
                      className="flex items-center gap-1.5 py-1 px-3 hover:bg-gray-100 rounded-full transition-colors hover:text-gray-900 cursor-pointer"
                    >
                      <Share2 className="h-4.5 w-4.5" />
                      {post.shares}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Link to AI tutor below */}
            <div className="p-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl border border-purple-200 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-[#5B37D4]">Stuck on homework?</h4>
                <p className="text-[11px] text-purple-700 font-bold mt-0.5">Instant trilingual tutoring available in Coach Space!</p>
              </div>
              <button
                onClick={() => setActiveTab("ai")}
                className="py-2.5 px-4 bg-[#5B37D4] text-white rounded-2xl text-xs font-black hover:opacity-90 cursor-pointer"
              >
                Open Coach
              </button>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 2: BOOKS CATALOG (STANDARD) */}
        {/* ======================================= */}
        {activeTab === "books" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
            {/* Library filtering controls */}
            <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between text-left">
              <div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">📚 Trilingual Curriculum Library</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Explore free and premium textbooks across Ethiopia</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Language Select */}
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-2xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Lang</span>
                  <select
                    value={selectedLanguageFilter}
                    onChange={(e) => setSelectedLanguageFilter(e.target.value as any)}
                    className="text-xs font-bold text-gray-800 bg-transparent outline-none cursor-pointer"
                  >
                    <option value="all">{t.all}</option>
                    <option value="en">{t.english}</option>
                    <option value="om">{t.oromo}</option>
                    <option value="am">{t.amharic}</option>
                  </select>
                </div>

                {/* Price Select */}
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-2xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Price</span>
                  <select
                    value={selectedPriceFilter}
                    onChange={(e) => setSelectedPriceFilter(e.target.value as any)}
                    className="text-xs font-bold text-gray-800 bg-transparent outline-none cursor-pointer"
                  >
                    <option value="all">{t.all}</option>
                    <option value="free">{t.free}</option>
                    <option value="paid">{t.paid}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Books catalog Grid */}
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                No matching books found. Try modifying your search or tag filters!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:border-purple-300 transition-all group"
                  >
                    <div className="p-5 text-left">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[9px] font-mono font-bold bg-purple-50 text-[#5B37D4] border border-purple-100 px-2.5 py-1 rounded-full uppercase">
                          {b.category}
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-gray-50 text-gray-500 border border-gray-100 px-2.5 py-1 rounded-full uppercase">
                          {b.language === "en" ? "English" : b.language === "om" ? "Oromoo" : "Amharic"}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-gray-950 leading-snug line-clamp-2 min-h-[40px] font-display">
                        {b.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed mt-2 min-h-[48px]">
                        {b.description}
                      </p>
                    </div>

                    <div className="bg-gray-50 border-t border-gray-100 px-5 py-3.5 flex items-center justify-between">
                      <div className="flex flex-col text-left">
                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">access price</span>
                        <span className="text-xs font-mono font-black text-gray-900">
                          {b.isPaid ? `${b.price} ETB` : "Bilaasha (Free)"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenBook(b)}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                          b.isPaid
                            ? "bg-[#5B37D4] text-white hover:opacity-90 shadow-md shadow-purple-500/15"
                            : "bg-white hover:bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {b.isPaid ? <Lock className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                        {b.isPaid ? t.unlockBook : t.readNow}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 3: VIDEOS CATALOG (RE reels feel) */}
        {/* ======================================= */}
        {activeTab === "videos" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
            {/* Video filters & Recorder launcher */}
            <div className="bg-white border border-gray-100 p-4 rounded-3xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between text-left">
              <div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">🎥 Trilingual Interactive Lectures</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">Learn with high-quality visual summaries & coding tutorials</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Launch Recorder Button matches Screenshot 2 entry */}
                <button
                  onClick={() => setShowCameraRecorder(true)}
                  className="px-4.5 py-2.5 bg-[#DF7649] text-white rounded-2xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer hover:opacity-95"
                >
                  <Camera className="h-4 w-4" />
                  Record Story
                </button>

                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-2xl border border-gray-200">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Language</span>
                  <select
                    value={selectedLanguageFilter}
                    onChange={(e) => setSelectedLanguageFilter(e.target.value as any)}
                    className="text-xs font-bold text-gray-800 bg-transparent outline-none cursor-pointer"
                  >
                    <option value="all">{t.all}</option>
                    <option value="en">{t.english}</option>
                    <option value="om">{t.oromo}</option>
                    <option value="am">{t.amharic}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Video items Grid */}
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                No video lectures matching criteria found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setActiveVideo(v)}
                    className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all cursor-pointer group"
                  >
                    <div className="aspect-video bg-black/5 flex items-center justify-center relative overflow-hidden shrink-0 border-b border-gray-100">
                      {/* Play overlay overlay */}
                      <PlayCircle className="h-11 w-11 text-amber-500 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all z-10" />
                      <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-all duration-300" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600')` }}></div>
                      <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] text-white font-mono font-bold tracking-wider">
                        {v.duration}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between text-left">
                      <div>
                        <div className="flex justify-between items-center mb-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                          <span>{v.category}</span>
                          <span className="text-amber-500">{v.language === "en" ? "English" : v.language === "om" ? "Oromoo" : "Amharic"}</span>
                        </div>
                        <h3 className="text-sm font-black text-gray-900 leading-snug font-display line-clamp-2">
                          {v.title}
                        </h3>
                        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3 mt-2">
                          {v.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 mt-4 text-xs font-black text-[#5B37D4] flex items-center gap-1 group-hover:text-purple-700">
                        Watch Lecture Video
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 4: AI TUTOR SPACE ("Ammaa & AI") */}
        {/* ======================================= */}
        {activeTab === "ai" && (
          <div className="py-6 px-4 animate-in fade-in duration-200">
            <AiTutorChat
              lang={lang}
              authToken={token}
              initialPrompt={tutorInitialPrompt}
              onClearInitialPrompt={() => setTutorInitialPrompt(undefined)}
              books={books}
            />
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 5: STUDENT DASHBOARD PROFILE (Screenshot 3 background) */}
        {/* ======================================= */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-200 text-left">
            
            {/* Profile banner & Avatar matches Screenshot 3 */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden relative">
              {/* Cover Banner background image */}
              <div 
                className="h-36 bg-cover bg-center relative"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=1000')" }}
              >
                {/* Glowing neon backdrop filters */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#5B37D4]/40 to-transparent"></div>
                <div className="absolute bottom-3 left-4 text-white text-[10px] font-black tracking-widest uppercase bg-black/35 backdrop-blur-md px-3 py-1 rounded-full">
                  My Smartbook AI Journey 🚀
                </div>
              </div>

              {/* User Portrait Details */}
              <div className="px-6 pb-6 relative pt-12">
                {/* Floating Big Avatar */}
                <div className="absolute -top-14 left-6">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"
                    alt="Chala Tolera"
                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-emerald-400"
                  />
                  <span className="absolute bottom-1 right-1 h-5.5 w-5.5 bg-emerald-500 rounded-full border-4 border-white"></span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                  <div className="text-left">
                    <h2 className="text-lg font-black text-gray-900">{user.name}</h2>
                    <p className="text-xs text-gray-400 font-bold">{user.email}</p>
                    <p className="text-[11px] text-purple-600 font-bold mt-1 uppercase tracking-wide">
                      Trilingual Tech Enthusiast | AI Explorer
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => {
                        const name = prompt("Update your full name:", user.name);
                        if (name) {
                          setUser({ ...user, name });
                          alert("Profile updated successfully!");
                        }
                      }}
                      className="px-4.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl text-xs font-black shadow-sm transition-all cursor-pointer"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => alert("Simulated share profile link copied to clipboard!")}
                      className="px-4.5 py-2 bg-[#5B37D4] hover:opacity-95 text-white rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer"
                    >
                      Share Journey
                    </button>
                  </div>
                </div>

                {/* 3 stats indicators (Screenshot 3 background indicators) */}
                <div className="border-t border-gray-100 mt-6 pt-5 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-[#F8FAFD] rounded-2xl border border-gray-50">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Followers</span>
                    <span className="text-base font-black text-[#5B37D4] block mt-0.5">105k</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFD] rounded-2xl border border-gray-50">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Following</span>
                    <span className="text-base font-black text-[#5B37D4] block mt-0.5">212</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFD] rounded-2xl border border-gray-50">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">AI Creations</span>
                    <span className="text-base font-black text-amber-500 block mt-0.5">450</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet & Topups (Full compliance with prior wallets features) */}
            <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-black text-gray-900 mb-1 flex items-center gap-2 font-display">
                <Wallet className="h-5 w-5 text-emerald-500" />
                {t.myWallet} (ethio telecom telebirr)
              </h2>
              <p className="text-[11px] text-gray-400 font-bold uppercase mb-4">Sandbox topups for easy developmental checkouts</p>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleWalletAddFunds(50)}
                  className="py-3 px-4 border border-emerald-500/10 hover:border-emerald-500 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black transition-all cursor-pointer text-center"
                >
                  + 50 ETB
                </button>
                <button
                  onClick={() => handleWalletAddFunds(100)}
                  className="py-3 px-4 border border-emerald-500/10 hover:border-emerald-500 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black transition-all cursor-pointer text-center"
                >
                  + 100 ETB
                </button>
                <button
                  onClick={() => handleWalletAddFunds(250)}
                  className="py-3 px-4 border border-emerald-500/10 hover:border-emerald-500 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black transition-all cursor-pointer text-center"
                >
                  + 250 ETB
                </button>
              </div>
            </div>

            {/* Subscriptions parameters */}
            <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 block">Subscription Type</span>
                <span className="text-xs font-black text-[#5B37D4] block uppercase mt-0.5">{user.subscription} Plan</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-400 block">Application Language</span>
                <span className="text-xs font-black text-gray-900 block uppercase mt-0.5">{lang === "om" ? "Afaan Oromoo" : lang === "am" ? "አማርኛ" : "English"}</span>
              </div>
            </div>

            {/* Logout actions */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 justify-center py-3.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-2xl text-xs font-black transition-all cursor-pointer border border-red-100"
            >
              <LogOut className="h-4.5 w-4.5" />
              {t.logoutBtn}
            </button>
          </div>
        )}

        {/* ======================================= */}
        {/* TAB 6: ADMIN PANEL CONSOLE */}
        {/* ======================================= */}
        {activeTab === "admin" && user.role === "admin" && (
          <AdminPanel lang={lang} authToken={token} />
        )}
      </main>

      {/* FLOATING ACTION UPLOAD BUTTON (Screenshot 5: Upload button) */}
      <button
        onClick={() => setShowUploadMenu(true)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 h-14 w-14 bg-gradient-to-tr from-[#7B53F4] to-[#5B37D4] hover:opacity-95 text-white rounded-full flex items-center justify-center shadow-2xl z-40 animate-bounce cursor-pointer transition-transform duration-300"
        title="Upload stories, videos or AI Art"
      >
        <ArrowUpCircle className="h-7 w-7" />
      </button>

      {/* MOBILE BOTTOM NAVIGATION TAB BAR */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center justify-around py-2 px-3 z-30 md:hidden shadow-lg">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-black cursor-pointer transition-colors ${
            activeTab === "home" ? "text-[#5B37D4]" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <HomeIcon className="h-4.5 w-4.5" />
          Home
        </button>
        <button
          onClick={() => setActiveTab("books")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-black cursor-pointer transition-colors ${
            activeTab === "books" ? "text-[#5B37D4]" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <BookOpen className="h-4.5 w-4.5" />
          Books
        </button>
        
        {/* Middle shortcut to popup options menu */}
        <button
          onClick={() => setShowUploadMenu(true)}
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-black text-purple-600 cursor-pointer hover:opacity-80"
        >
          <PlusCircle className="h-5 w-5 text-[#5B37D4] animate-pulse" />
          Upload
        </button>

        <button
          onClick={() => setActiveTab("videos")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-black cursor-pointer transition-colors ${
            activeTab === "videos" ? "text-[#5B37D4]" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <VideoIcon className="h-4.5 w-4.5" />
          Videos
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-black cursor-pointer transition-colors ${
            activeTab === "profile" ? "text-[#5B37D4]" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <UserIcon className="h-4.5 w-4.5" />
          Profile
        </button>
      </nav>

      {/* TELEBIRR CHECKOUT GATEWAY SECURE OVERLAY MODAL */}
      {activeCheckoutBook && (
        <TelebirrModal
          book={activeCheckoutBook}
          lang={lang}
          authToken={token}
          onClose={() => setActiveCheckoutBook(null)}
          onSuccess={() => {
            const purchasedBook = activeCheckoutBook;
            setActiveCheckoutBook(null);
            handleOpenBook(purchasedBook);
          }}
        />
      )}

      {/* DYNAMIC STORIES PLAYER POPUP (Watch full screen story) */}
      {activeStoryViewer && (
        <div className="fixed inset-0 bg-[#050508] text-white z-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url('${activeStoryViewer.image}')` }}></div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
          
          {/* Progress bar timer */}
          <div className="absolute top-6 inset-x-6 z-10 flex gap-1">
            <div className="h-1 bg-purple-600 rounded-full flex-1 animate-pulse"></div>
          </div>

          <div className="absolute top-10 inset-x-6 flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <img src={activeStoryViewer.avatar} alt={activeStoryViewer.name} className="h-8 w-8 rounded-full border border-purple-500 object-cover" />
              <span className="text-xs font-black text-white">{activeStoryViewer.name}</span>
            </div>
            <button 
              onClick={() => setActiveStoryViewer(null)}
              className="h-9 w-9 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="relative z-10 text-center max-w-sm p-6 space-y-4">
            <span className="text-[10px] bg-purple-600/30 text-purple-200 border border-purple-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
              watching story
            </span>
            <p className="text-sm font-bold text-gray-100">
              {activeStoryViewer.isUser 
                ? "Baga nagaan gara SmartBook AI dhuftan! Click on bottom upload to share your story."
                : `Simulated Story of ${activeStoryViewer.name} - Trilingual journey logs.`
              }
            </p>
          </div>
        </div>
      )}

      {/* UPLOAD BOTTOM MENU POPUP (Screenshot 3) */}
      {showUploadMenu && (
        <UploadModal
          onClose={() => setShowUploadMenu(false)}
          onSelectOption={handleSelectUploadOption}
        />
      )}

      {/* CAMERA VIEW VIDEO LECTURE CREATOR (Screenshot 2) */}
      {showCameraRecorder && (
        <CameraView
          onClose={() => setShowCameraRecorder(false)}
          onPostCreated={handleCameraPostCreated}
        />
      )}

      {/* COMMUNITY UPDATE TEXT COMPOSER */}
      {showTextPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-left text-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Post Community Update</h3>
              <button onClick={() => setShowTextPostModal(false)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 cursor-pointer">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <textarea
              value={postTextContent}
              onChange={(e) => setPostTextContent(e.target.value)}
              placeholder="What's on your mind? Share updates with fellow students or teachers..."
              className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs focus:ring-1 focus:ring-purple-500 outline-none font-semibold leading-relaxed"
            />

            <button
              onClick={handlePublishTextPost}
              className="w-full py-3.5 bg-[#5B37D4] text-white rounded-2xl text-xs font-black shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              Publish Update
            </button>
          </div>
        </div>
      )}

      {/* AI ART PROMPT MODEL CREATOR */}
      {showAiArtModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-left text-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-[#5B37D4] animate-pulse" />
                AI Art Showcase Generator
              </h3>
              <button onClick={() => setShowAiArtModal(false)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 cursor-pointer">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <p className="text-[11px] text-gray-400 font-bold uppercase">The AI Tutor will render visual artwork corresponding to your educational concept</p>
            
            <input
              type="text"
              value={aiArtPrompt}
              onChange={(e) => setAiArtPrompt(e.target.value)}
              placeholder="e.g. A gorgeous cyberpunk classroom in Semien Mountains..."
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs focus:ring-1 focus:ring-purple-500 outline-none font-semibold"
            />

            <button
              onClick={handleGenerateAiArt}
              className="w-full py-3.5 bg-gradient-to-r from-[#7B53F4] to-[#5B37D4] text-white rounded-2xl text-xs font-black shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              Generate & Publish Art
            </button>
          </div>
        </div>
      )}

      {/* 🎥 VIDEO LECTURE UPLOADER MODAL (YouTube-style) */}
      {showVideoUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-left text-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <VideoIcon className="h-5 w-5 text-red-500" />
                Upload Video Lecture
              </h3>
              <button onClick={() => setShowVideoUploadModal(false)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 cursor-pointer">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <p className="text-[10px] text-gray-400 font-bold uppercase">Share video lectures with other students. Live in Catalog immediately!</p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Video Title *</label>
                <input
                  type="text"
                  value={videoTitleInput}
                  onChange={(e) => setVideoTitleInput(e.target.value)}
                  placeholder="e.g. Introduction to Flutter Widgets"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Description *</label>
                <textarea
                  value={videoDescInput}
                  onChange={(e) => setVideoDescInput(e.target.value)}
                  placeholder="e.g. Master Stateless vs Stateful widgets in under 10 minutes..."
                  className="w-full h-20 p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Video File / URL (MP4)</label>
                <input
                  type="text"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder="e.g. https://www.w3schools.com/html/mov_bbb.mp4"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Category</label>
                  <select
                    value={videoCategoryInput}
                    onChange={(e) => setVideoCategoryInput(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Geography">Geography</option>
                    <option value="Language">Language</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Language</label>
                  <select
                    value={videoLangInput}
                    onChange={(e) => setVideoLangInput(e.target.value as any)}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="en">English</option>
                    <option value="om">Afaan Oromoo</option>
                    <option value="am">አማርኛ (Amharic)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowVideoUploadModal(false);
                  setShowCameraRecorder(true);
                }}
                className="flex-1 py-3 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-black transition-all cursor-pointer text-center text-gray-600"
              >
                📸 Live Camera
              </button>

              <button
                onClick={handleUploadVideoSubmit}
                className="flex-1 py-3 bg-[#5B37D4] text-white rounded-xl text-xs font-black shadow-md hover:opacity-95 transition-all cursor-pointer text-center"
              >
                Publish Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📚 PDF TEXTBOOK / STUDY BOOK UPLOADER MODAL (Smartbook-style) */}
      {showBookUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-left text-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                Publish Study Book
              </h3>
              <button onClick={() => setShowBookUploadModal(false)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 cursor-pointer">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <p className="text-[10px] text-gray-400 font-bold uppercase">Register educational books. Live in Catalog & ready for AI Coach Tutoring!</p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Book Title *</label>
                <input
                  type="text"
                  value={bookTitleInput}
                  onChange={(e) => setBookTitleInput(e.target.value)}
                  placeholder="e.g. Grade 12 Advanced Physics Guide"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Description *</label>
                <textarea
                  value={bookDescInput}
                  onChange={(e) => setBookDescInput(e.target.value)}
                  placeholder="e.g. Complete textbook analyzing Thermodynamics, Mechanics, and Nuclear Physics step-by-step..."
                  className="w-full h-20 p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">PDF File URL</label>
                <input
                  type="text"
                  value={bookUrlInput}
                  onChange={(e) => setBookUrlInput(e.target.value)}
                  placeholder="e.g. https://pdfobject.com/pdf/sample.pdf"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Category</label>
                  <select
                    value={bookCategoryInput}
                    onChange={(e) => setBookCategoryInput(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-semibold outline-none"
                  >
                    <option value="Coding">Coding</option>
                    <option value="Mathematics">Math</option>
                    <option value="Physics">Physics</option>
                    <option value="Geography">Geography</option>
                    <option value="Grammar">Grammar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Language</label>
                  <select
                    value={bookLangInput}
                    onChange={(e) => setBookLangInput(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-semibold outline-none"
                  >
                    <option value="en">English</option>
                    <option value="om">Oromoo</option>
                    <option value="am">አማርኛ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Pages count</label>
                  <input
                    type="number"
                    value={bookPagesInput}
                    onChange={(e) => setBookPagesInput(e.target.value)}
                    className="w-full p-2 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-semibold outline-none"
                  />
                </div>
              </div>

              {/* Paid parameters with telebirr compatibility */}
              <div className="border border-purple-100 p-3 bg-purple-50/50 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block text-xs font-black text-purple-900">Commercial Textbook?</span>
                    <span className="block text-[9px] text-gray-400 font-bold">Students will pay via Telebirr sandbox</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBookIsPaidInput(!bookIsPaidInput)}
                    className={`h-5 w-9 rounded-full p-0.5 transition-colors duration-300 relative ${bookIsPaidInput ? "bg-purple-600" : "bg-gray-300"}`}
                  >
                    <div className={`h-4 w-4 bg-white rounded-full shadow transform transition-transform ${bookIsPaidInput ? "translate-x-3.5" : "translate-x-0"}`} />
                  </button>
                </div>

                {bookIsPaidInput && (
                  <div className="animate-in slide-in-from-top duration-200">
                    <label className="block text-[9px] font-black text-purple-700 uppercase mb-1">Price (ETB)</label>
                    <input
                      type="number"
                      value={bookPriceInput}
                      onChange={(e) => setBookPriceInput(e.target.value)}
                      placeholder="50"
                      className="w-full p-2 bg-white border border-purple-100 rounded-xl text-xs font-black text-purple-900 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleUploadBookSubmit}
              className="w-full py-3.5 bg-[#5B37D4] text-white rounded-2xl text-xs font-black shadow-md hover:opacity-95 transition-all cursor-pointer text-center"
            >
              Publish Book
            </button>
          </div>
        </div>
      )}

      {/* 🖼️ PHOTO UPDATE UPLOADER MODAL (Facebook-style) */}
      {showPhotoUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-left text-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-emerald-500" />
                Share Photo Update
              </h3>
              <button onClick={() => setShowPhotoUploadModal(false)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 cursor-pointer">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <p className="text-[10px] text-gray-400 font-bold uppercase">Publish gorgeous visuals directly to the community feed!</p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Caption / Thoughts *</label>
                <textarea
                  value={photoCaptionInput}
                  onChange={(e) => setPhotoCaptionInput(e.target.value)}
                  placeholder="e.g. Loving my afternoon trilingual Gadaa studies today! 📖💡"
                  className="w-full h-24 p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Photo Image URL (Optional)</label>
                <input
                  type="text"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-semibold outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              onClick={handleUploadPhotoSubmit}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl text-xs font-black shadow-md hover:opacity-95 transition-all cursor-pointer text-center"
            >
              Publish Post
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
