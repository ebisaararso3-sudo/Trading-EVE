import React, { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Edit3, MessageSquare, Save, Settings, Sparkles, Trash2 } from "lucide-react";
import { Book } from "../types";
import { translations } from "../languages";

interface BookViewerProps {
  book: Book;
  onBack: () => void;
  lang: "en" | "om" | "am";
  onAskTutor: (pageText: string) => void;
}

// Generate high quality simulated curriculum content for books
const getSimulatedPages = (bookId: string, bookTitle: string) => {
  if (bookId.includes("1") || bookTitle.toLowerCase().includes("flutter")) {
    return [
      {
        pageNum: 1,
        title: "Seensa Flutter fi Dart",
        content: `Flutter sassaabame koodii tokkoon (Single Codebase) aplikeeshinii bareedoo baay'ee saffisoo ta'an kanneen akka Android, iOS, Web fi Desktop ta'aniif hojjechuuf gargaara. Google dhaan kan kalaqame yoo ta'u, afaan sagaleessuuf Dart fayyadama.\n\nAkkaataa barumsa kana keessatti:\n1. Maalummaa 'Widget' beekuu\n2. Maalummaa 'State' (Kallattii qabeenyaa) hubachuu\n3. Hojii jalqabaa hojjechuu\n\nFlutter keessatti hundi isaanii 'Widget' dha! Qajeelfamni asii olitti barreeffame tokkoon tokkoon isaa visual elements kan akka barruu (Text), fakkii (Image), ykn bifa (Container) ta'uu danda'u.`,
      },
      {
        pageNum: 2,
        title: "Stateless vs Stateful Widgets",
        content: `Widget'ni bakka gurguddoo lamatti qoodama:\n\n1. **Stateless Widget**: Gatiin isaa erga uumamee booda hin jijjiiramu. Fakkeenyaaf, barruu (Text) ykn mallattoo (Icon) ifaa.\n\n2. **Stateful Widget**: Haala (state) irratti hundaa'uun jijjiiramuu danda'a. Fakkeenyaaf, lakkooftu (Counter), text field, ykn checkbox.\n\nKoodiin jalqabaa seensaa:\n\`\`\`dart\nclass MyHome extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) {\n    return Scaffold(\n      appBar: AppBar(title: Text('SmartBook AI')),\n      body: Center(child: Text('Baga Nagaan Dhuftan')),\n    );\n  }\n}\n\`\`\``,
      },
      {
        pageNum: 3,
        title: "Ijaarsa (Building UI)",
        content: `Ijaarsa UI (User Interface) keessatti, koodiin keessan mallattoo 'build' jedhu jalatti qorannoo isaa xumura. Bu'uura koodii kanaa hubachuuf, ijaarsa garaa garaa dandeessisuuf, meeshaalee akka Columns, Rows, fi Containers xiyyeeffannoo itti kennuun barbaachisaadha.\n\nFakkeenyaaf, Column meeshaalee gara gadiitti walduraa duubaan kaahuuf gargaara:\n\`\`\`dart\nColumn(\n  children: [\n    Text('Line 1'),\n    Text('Line 2'),\n  ],\n)\n\`\`\``
      }
    ];
  } else if (bookId.includes("2") || bookTitle.toLowerCase().includes("math")) {
    return [
      {
        pageNum: 1,
        title: "ሊሚት እና ተዋፅኦ (Limits & Derivatives)",
        content: `ሊሚት (Limits) በአንድ ፈንክሽን ውስጥ ግብዓቱ (x) ወደ አንድ የተወሰነ ቁጥር ሲጠጋ የሚኖረውን የፈንክሽን ዋጋ የሚገልጽ የሂሳብ ክፍል ነው። ይህ በተለይ በካልኩለስ (Calculus) ውስጥ መሰረታዊ ጽንሰ-ሀሳብ ነው።\n\n$$\\lim_{{x \\to c}} f(x) = L$$\n\nይህ ማለት x ወደ c ሲጠጋ፣ ፈንክሽኑ f(x) ወደ L ይቀርባል። ለምሳሌ:\n\n$$\\lim_{{x \\to 2}} (3x + 1) = 3(2) + 1 = 7$$\n\nይህም x እጅግ በጣም ወደ 2 ሲቃረብ፣ የ3x + 1 ዋጋ ወደ 7 ይቃረባል ማለት ነው።`,
      },
      {
        pageNum: 2,
        title: "ተከታታይነት እና የአንድ ፈንክሽን ተዋፅኦ",
        content: `ተዋፅኦ (Derivatives) የአንድ ፈንክሽን ለውጥ መጠን (Rate of Change) ወይም የንክኪ መስመር ኩርባ (Slope of Tangent) የሚሰጠን ነው።\n\nቀመሩም እንደሚከተለው ነው:\n\n$$f'(x) = \\lim_{{h \\to 0}} \\frac{{f(x+h) - f(x)}}{{h}}$$\n\nለምሳሌ የ $f(x) = x^2$ ተዋፅኦን ለመፈለግ:\n\n$$f'(x) = 2x$$\n\nይህ ማለት በማንኛውም ነጥብ ላይ x ኩርባው ምን ያህል ፍጥነት እንደሚቀየር ያሳየናል።`,
      },
      {
        pageNum: 3,
        title: "ተግባራዊ የካልኩለስ ምሳሌዎች",
        content: `ካልኩለስ በዕለት ተዕለት ሕይወት ውስጥ እጅግ በጣም ጠቃሚ ነው። ለምሳሌ:\n- የስበት ኃይልን እና የፈጣንነት ለውጥን (Velocity & Acceleration) ለማስላት።\n- በኢኮኖሚክስ ውስጥ ከፍተኛ ትርፍ (Maximum Profit) እና አነስተኛ ኪሳራን ለማግኘት።\n- በምህንድስና ውስጥ የሕንፃዎችን ጥንካሬ እና ክብደት ስርጭት ለመለካት።`
      }
    ];
  } else if (bookId.includes("3") || bookTitle.toLowerCase().includes("ai")) {
    return [
      {
        pageNum: 1,
        title: "Introduction to Neural Networks",
        content: `Artificial Neural Networks (ANN) are computing systems inspired by the biological neural networks that constitute animal brains. \n\nAn ANN is based on a collection of connected units or nodes called artificial neurons, which loosely model the neurons in a biological brain. Each connection, like the synapses in a biological brain, can transmit a signal to other neurons. An artificial neuron receives signals, processes them, and can signal neurons connected to it.`,
      },
      {
        pageNum: 2,
        title: "Deep Learning Layers & Activation",
        content: `A typical neural network contains:\n1. **Input Layer**: Receives features (e.g. image pixels, text words).\n2. **Hidden Layers**: Extracts complex patterns using weights ($W$) and biases ($b$).\n3. **Output Layer**: Produces prediction (e.g. classification label, next word).\n\nActivation functions ($f$) introduce non-linearity into the network, enabling it to learn complex mappings:\n\n$$\\text{Output} = f(\\sum (W_i X_i) + b)$$\n\nPopular activation functions include ReLU ($f(x) = \\max(0, x)$) and Sigmoid ($f(x) = \\frac{1}{1+e^{-x}}$).`,
      },
      {
        pageNum: 3,
        title: "Large Language Models & Transformers",
        content: `Modern Generative AI, including Gemini 3.5, relies on the Transformer Architecture. Introduced in 2017, Transformers utilize an 'Attention Mechanism' to understand relationships between words in a sentence regardless of their distance from each other.\n\nThis self-attention mechanism enables high-fidelity next-word prediction, summarization, logical coding, and multi-turn educational tutoring.`
      }
    ];
  } else {
    // General fallback template for other books
    return [
      {
        pageNum: 1,
        title: `${bookTitle} - Chapter 1`,
        content: `This is the first chapter of "${bookTitle}". It covers basic terms, structural ideas, and curriculum requirements designed for comprehensive study.\n\nPlease navigate to the next page to continue reading. Use the notes panel to summarize key definitions.`,
      },
      {
        pageNum: 2,
        title: `${bookTitle} - Chapter 2`,
        content: `This is the second chapter of "${bookTitle}". It details contextual exercises, and introduces specialized formulas to deepen your technical understanding. Use the inline 'Ask Tutor' option if you require supplementary explanations.`,
      }
    ];
  }
};

export default function BookViewer({ book, onBack, lang, onAskTutor }: BookViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [fontSize, setFontSize] = useState("text-base");
  const [noteText, setNoteText] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);

  const t = translations[lang];
  const pages = getSimulatedPages(book.id, book.title);
  const totalPages = pages.length;
  const currentContent = pages.find((p) => p.pageNum === currentPage) || pages[0];

  // Load Saved Notes for this specific book
  useEffect(() => {
    const local = localStorage.getItem(`notes_${book.id}`);
    if (local) {
      setSavedNotes(JSON.parse(local));
    }
  }, [book.id]);

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    const newNotes = [...savedNotes, `Page ${currentPage}: ${noteText}`];
    setSavedNotes(newNotes);
    localStorage.setItem(`notes_${book.id}`, JSON.stringify(newNotes));
    setNoteText("");
  };

  const handleDeleteNote = (index: number) => {
    const newNotes = savedNotes.filter((_, idx) => idx !== index);
    setSavedNotes(newNotes);
    localStorage.setItem(`notes_${book.id}`, JSON.stringify(newNotes));
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col select-none relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1a1a2e_0%,transparent_50%)] opacity-40 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#2e1a1a_0%,transparent_50%)] opacity-30 pointer-events-none"></div>

      {/* Viewer Header */}
      <div className="bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-10 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white max-w-xs md:max-w-md truncate font-display">
              {book.title}
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              {t.pages}: {currentPage} / {totalPages}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Font Settings Dropdown */}
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1">
            <Settings className="h-3.5 w-3.5 text-blue-400 mr-1.5" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="text-xs font-bold text-gray-200 bg-transparent border-none outline-none cursor-pointer"
            >
              <option value="text-sm" className="bg-[#0F0F1A] text-white">Small</option>
              <option value="text-base" className="bg-[#0F0F1A] text-white">Medium</option>
              <option value="text-lg" className="bg-[#0F0F1A] text-white">Large</option>
              <option value="text-xl" className="bg-[#0F0F1A] text-white">X-Large</option>
            </select>
          </div>

          <button
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Notes ({savedNotes.length})</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        {/* Main Book Reader Sheet */}
        <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-between max-w-4xl mx-auto w-full">
          <div className="w-full bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10 p-6 md:p-10 flex-1 flex flex-col min-h-[400px]">
            {/* Header of simulated page */}
            <div className="border-b border-white/10 pb-4 mb-6 flex justify-between items-center text-xs text-gray-400 font-mono font-semibold">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                SMARTBOOK CURRICULUM
              </span>
              <span>PAGE {currentPage}</span>
            </div>

            {/* Page Content */}
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold text-white mb-4 font-display">
                {currentContent.title}
              </h2>
              <div className={`${fontSize} text-gray-200 leading-relaxed whitespace-pre-wrap font-sans`}>
                {currentContent.content}
              </div>
            </div>

            {/* AI Tutor Assistant Trigger Panel */}
            <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-2.5 rounded-xl text-white shadow-md">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">Struggling to understand this page?</h4>
                  <p className="text-[10px] text-gray-400">Ask your trilingual AI Coach to explain it simply.</p>
                </div>
              </div>
              <button
                onClick={() => onAskTutor(`Regarding the book "${book.title}", on page ${currentPage} titled "${currentContent.title}", can you explain this concept in simplified terms with an example? Here is the page content:\n\n${currentContent.content}`)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Ask AI Tutor
              </button>
            </div>
          </div>

          {/* Book Navigation controls */}
          <div className="w-full mt-6 flex justify-between items-center px-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="flex items-center gap-1.5 px-4 py-2 border border-white/10 rounded-2xl text-xs font-bold bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 transition-all cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            <span className="text-xs font-mono font-bold text-gray-300 bg-white/10 px-3 py-1 rounded-full border border-white/5">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="flex items-center gap-1.5 px-4 py-2 border border-white/10 rounded-2xl text-xs font-bold bg-white/5 text-white hover:bg-white/10 disabled:opacity-30 transition-all cursor-pointer"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Study Notes Sidebar Drawer */}
        {(showNotesDrawer || savedNotes.length > 0) && (
          <div className="w-full md:w-80 bg-black/40 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 p-4 flex flex-col shrink-0">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-blue-400" />
                Study Notes
              </h3>
              {savedNotes.length > 0 && (
                <span className="text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  {savedNotes.length} Saved
                </span>
              )}
            </div>

            {/* Note Editor */}
            <div className="space-y-3 mb-6">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write summary notes, equations, or code logs for this page..."
                rows={3}
                className="w-full p-2.5 text-xs bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-500 resize-none"
              ></textarea>
              <button
                onClick={handleSaveNote}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Save Note
              </button>
            </div>

            {/* List of saved notes */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[220px] md:max-h-none">
              {savedNotes.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-500">
                  No notes saved yet. Write some points to memorize!
                </div>
              ) : (
                savedNotes.map((note, index) => (
                  <div
                    key={index}
                    className="p-2.5 bg-white/5 rounded-xl border border-white/10 relative group text-[11px] text-gray-300"
                  >
                    <button
                      onClick={() => handleDeleteNote(index)}
                      className="absolute top-1.5 right-1.5 p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <div className="font-sans pr-4 whitespace-pre-wrap">{note}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
