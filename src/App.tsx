import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Heart, Send, Search, Sparkles, Star, RefreshCw, X, PenTool, Trash2 } from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyCRuJxbJ6ck7BdUvK-28vVPUmWJMyBaHcY",
  authDomain: "caytamthu.firebaseapp.com",
  projectId: "caytamthu",
  storageBucket: "caytamthu.firebasestorage.app",
  messagingSenderId: "1075739457245",
  appId: "1:1075739457245:web:c87e21d1b6f9782a710d34",
  measurementId: "G-BECQYV44G0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const PASTEL_COLORS = [
  { id: "pink", hex: "#FFD1DC", name: "Hồng pastel" },
  { id: "yellow", hex: "#FFFACD", name: "Vàng bơ" },
  { id: "mint", hex: "#E8F5E9", name: "Xanh mint" },
  { id: "purple", hex: "#D8B4FE", name: "Tím pastel" },
  { id: "orange", hex: "#FDBA74", name: "Cam nhạt" },
];

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [letters, setLetters] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [readingLetter, setReadingLetter] = useState<any>(null);

  const [message, setMessage] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [recipient, setRecipient] = useState("Thầy Cô & Bạn Bè");
  const [selectedColor, setSelectedColor] = useState(PASTEL_COLORS[0].hex);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    signInAnonymously(auth).then((res) => setUser(res.user)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "letters"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setLetters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [user]);

  const handleSendLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    
    // Tọa độ ngẫu nhiên GỌN TRONG TÁN CÂY
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.sqrt(Math.random());
    const randomX = 600 + (radius * 220) * Math.cos(angle);
    const randomY = 310 + (radius * 150) * Math.sin(angle);

    try {
      await addDoc(collection(db, "letters"), {
        message: message.trim(),
        author: authorName.trim() || "Người ẩn danh",
        recipient,
        color: selectedColor,
        xPos: randomX,
        yPos: randomY,
        createdAt: serverTimestamp()
      });
      setMessage("");
      setAuthorName("");
      setIsWriteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLetter = async () => {
    const pass = prompt("Nhập mật khẩu quản trị viên để xóa thư này:");
    if (pass === "nova2026") {
      try {
        await deleteDoc(doc(db, "letters", readingLetter.id));
        setReadingLetter(null);
        alert("Đã xóa thư thành công!");
      } catch (err) {
        alert("Có lỗi xảy ra khi xóa thư!");
      }
    } else if (pass !== null) {
      alert("Mật khẩu không chính xác. Bạn không có quyền xóa!");
    }
  };

  const filteredLetters = letters.filter(item => 
    item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#B3E5FC] to-[#F1F8E9] flex flex-col relative font-sans">
      
      {/* Header Rút Gọn */}
      <header className="px-6 py-4 bg-white/60 backdrop-blur-md shadow-sm flex items-center justify-between z-30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-emerald-900 tracking-wide flex items-center gap-2">
              Cây Tâm Thư <span className="text-xs px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded-full">NOVA</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Tìm theo tên/người nhận..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/90 border border-emerald-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 w-56 md:w-64 shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative flex items-end justify-center overflow-hidden">
        
        {/* Tên Sự Kiện */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-full px-4">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-100 font-serif tracking-wider"
            style={{ filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.4))' }}
          >
            Đi qua một mùa tri thức
          </h2>
        </div>

        {/* SVG Bản vẽ */}
        <div className="absolute inset-0 w-full h-full flex items-end justify-center z-10">
          <svg className="w-full h-full" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
            
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF59D" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FFF59D" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="1000" cy="180" r="150" fill="url(#sunGlow)" pointerEvents="none" />
            <circle cx="1000" cy="180" r="50" fill="#FFD54F" pointerEvents="none" />

            <path d="M 200 250 a 30 30 0 0 1 30 -30 a 50 50 0 0 1 90 0 a 30 30 0 0 1 0 60 h -120 a 30 30 0 0 1 0 -60 z" fill="white" opacity="0.9" pointerEvents="none" />
            <path d="M 850 280 a 25 25 0 0 1 25 -25 a 40 40 0 0 1 70 0 a 25 25 0 0 1 0 50 h -95 a 25 25 0 0 1 0 -50 z" fill="white" opacity="0.8" pointerEvents="none" />
            <path d="M 400 150 a 20 20 0 0 1 20 -20 a 30 30 0 0 1 50 0 a 20 20 0 0 1 0 40 h -70 a 20 20 0 0 1 0 -40 z" fill="white" opacity="0.7" pointerEvents="none" />

            <ellipse cx="300" cy="900" rx="700" ry="250" fill="#81C784" pointerEvents="none" />
            <ellipse cx="900" cy="950" rx="800" ry="280" fill="#66BB6A" pointerEvents="none" />
            <ellipse cx="600" cy="850" rx="550" ry="150" fill="#4CAF50" pointerEvents="none" />

            <circle cx="350" cy="780" r="6" fill="#FF8A80" pointerEvents="none" />
            <circle cx="365" cy="785" r="5" fill="#FFFF8D" pointerEvents="none" />
            <circle cx="800" cy="810" r="7" fill="#B388FF" pointerEvents="none" />
            <circle cx="815" cy="805" r="5" fill="#FF8A80" pointerEvents="none" />
            <circle cx="200" cy="850" r="6" fill="#FFFF8D" pointerEvents="none" />
            <circle cx="950" cy="750" r="6" fill="#FF8A80" pointerEvents="none" />
            <circle cx="500" cy="870" r="5" fill="#8C9EFF" pointerEvents="none" />
            <circle cx="680" cy="860" r="6" fill="#FFFF8D" pointerEvents="none" />

            <path d="M 560 300 L 560 650 Q 560 820 400 880 L 800 880 Q 640 820 640 650 L 640 300 Z" fill="#4E342E" pointerEvents="none" />
            <path d="M 600 400 Q 480 300 380 300" stroke="#4E342E" strokeWidth="25" strokeLinecap="round" fill="none" pointerEvents="none" />
            <path d="M 600 400 Q 720 300 820 300" stroke="#4E342E" strokeWidth="25" strokeLinecap="round" fill="none" pointerEvents="none" />
            <path d="M 600 400 L 600 200" stroke="#4E342E" strokeWidth="30" strokeLinecap="round" fill="none" pointerEvents="none" />
            
            <circle cx="600" cy="350" r="240" fill="#2E7D32" opacity="0.95" pointerEvents="none" />
            <circle cx="420" cy="380" r="160" fill="#388E3C" opacity="0.95" pointerEvents="none" />
            <circle cx="780" cy="380" r="160" fill="#4CAF50" opacity="0.95" pointerEvents="none" />
            <circle cx="600" cy="180" r="150" fill="#66BB6A" opacity="0.95" pointerEvents="none" />
            <circle cx="500" cy="460" r="120" fill="#81C784" opacity="0.9" pointerEvents="none" />
            <circle cx="700" cy="460" r="120" fill="#388E3C" opacity="0.9" pointerEvents="none" />

            {/* HIỂN THỊ THƯ DÍNH LÊN CÂY */}
            {filteredLetters.map((item) => {
              const x = item.xPos || 600;
              const y = item.yPos || 310;
              return (
                <foreignObject
                  key={item.id}
                  x={x - 60} 
                  y={y - 30}
                  width="120"
                  height="80"
                  className="overflow-visible"
                >
                  <div 
                    className="w-full h-full flex flex-col items-center justify-start group cursor-pointer animate-in zoom-in duration-300"
                    onClick={() => setReadingLetter(item)}
                  >
                    <div 
                      style={{ backgroundColor: item.color || '#FFFACD' }} 
                      className="w-11 h-8 rounded shadow-md border border-black/10 flex items-center justify-center relative overflow-hidden group-hover:-translate-y-1 transition-transform"
                    >
                      <div className="absolute top-0 left-0 w-full h-[55%] border-b border-black/10 bg-white/30" style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}></div>
                      <Heart size={10} className="text-red-400 opacity-80 mt-2" fill="currentColor" />
                    </div>
                    <div className="mt-1 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
                      Đến: {item.recipient}
                    </div>
                  </div>
                </foreignObject>
              );
            })}
          </svg>
        </div>

        {/* Nút Gửi Tâm Thư */}
        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="absolute bottom-8 right-6 md:right-8 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold shadow-2xl hover:from-emerald-600 hover:to-teal-700 transition transform hover:scale-110 hover:-translate-y-1 z-30 border-2 border-white/50"
        >
          <PenTool size={22} />
          <span className="text-lg hidden sm:block">Viết Tâm Thư</span>
          <span className="text-lg sm:hidden">Viết</span>
        </button>

        {/* Thống kê */}
        <div className="absolute bottom-8 left-6 md:left-8 bg-white/90 backdrop-blur px-5 py-3 rounded-full shadow-lg text-sm font-bold text-emerald-800 flex items-center gap-2 z-20 border border-white">
          <Star size={18} className="text-yellow-500 fill-yellow-500" /> 
          <span className="hidden sm:inline">Tổng số:</span> {letters.length} phong bì
        </div>
      </main>

      {/* Modal Viết Thư */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">💌 Viết phong bì mới</h3>
              <button onClick={() => setIsWriteModalOpen(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSendLetter} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gửi tới ai?</label>
                <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="VD: Thầy cô, Ban tổ chức..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nội dung tâm thư</label>
                <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Những lời chưa ngỏ..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tên của bạn</label>
                  <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Ẩn danh" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Màu phong bì</label>
                  <div className="flex gap-2 mt-2">
                    {PASTEL_COLORS.map((c) => (
                      <button key={c.id} type="button" style={{ backgroundColor: c.hex }} onClick={() => setSelectedColor(c.hex)} className={`w-7 h-7 rounded-full border-2 transition-transform ${selectedColor === c.hex ? 'border-emerald-600 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`} />
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2 mt-2">
                {isSubmitting ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />} Treo Lên Cây
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Đọc Thư */}
      {readingLetter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div style={{ backgroundColor: readingLetter.color || '#FFFACD' }} className="rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-black/10 animate-in zoom-in-95 duration-200">
            
            <button onClick={() => setReadingLetter(null)} className="absolute top-4 right-4 text-gray-700 hover:text-black bg-white/40 hover:bg-white/80 transition p-1.5 rounded-full z-10">
              <X size={18} />
            </button>
            
            <button 
              onClick={handleDeleteLetter} 
              title="Xóa thư (Chỉ Admin)"
              className="absolute bottom-4 left-4 text-red-400 hover:text-red-600 hover:bg-red-50 transition bg-white/40 p-2 rounded-full z-10"
            >
              <Trash2 size={18} />
            </button>

            <div className="mb-6 border-b border-black/10 pb-3 pr-8">
              <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800 bg-white/50 px-3 py-1.5 rounded-full shadow-sm">
                Đến: {readingLetter.recipient}
              </span>
            </div>
            
            <p className="text-gray-900 font-serif text-xl italic mb-10 leading-relaxed whitespace-pre-wrap">
              "{readingLetter.message}"
            </p>
            
            <div className="text-right">
              <span className="font-bold text-sm text-gray-800 bg-white/40 px-3 py-1 rounded-lg">Ký tên: {readingLetter.author}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
