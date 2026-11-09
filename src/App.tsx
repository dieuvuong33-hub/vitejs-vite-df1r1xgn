import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Heart, Send, Search, Sparkles, Star, RefreshCw, X, PenTool } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    });
  }, [user]);

  const handleSendLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "letters"), {
        message: message.trim(),
        author: authorName.trim() || "Người ẩn danh",
        recipient,
        color: selectedColor,
        createdAt: serverTimestamp()
      });
      setMessage("");
      setAuthorName("");
      setIsWriteModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLetters = letters.filter(item => 
    item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-screen h-screen overflow-hidden bg-gradient-to-b from-[#87CEEB] via-[#B3E5FC] to-[#F1F8E9] flex flex-col relative font-sans">
      
      {/* Thanh Header Rút Gọn */}
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
              className="pl-9 pr-4 py-2 bg-white/90 border border-emerald-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 w-64 shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* Khu vực trung tâm */}
      <main className="flex-1 relative flex items-end justify-center overflow-hidden">
        
        {/* Tên Sự Kiện - Ở giữa trên cùng */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none w-full px-4">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-100 font-serif tracking-wider"
            style={{ filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.4))' }}
          >
            Đi qua một mùa tri thức
          </h2>
        </div>

        {/* Bản vẽ Cây Hình Tròn & Gốc Loe */}
        <div className="absolute inset-0 w-full h-full flex items-end justify-center pointer-events-none z-0">
          <svg className="w-full h-full" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMax meet" fill="none" xmlns="http://www.w3.org/2000/svg">
            
            {/* Nắng & Mây */}
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF59D" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FFF59D" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="1000" cy="180" r="150" fill="url(#sunGlow)" />
            <circle cx="1000" cy="180" r="50" fill="#FFD54F" />

            <path d="M 200 250 a 30 30 0 0 1 30 -30 a 50 50 0 0 1 90 0 a 30 30 0 0 1 0 60 h -120 a 30 30 0 0 1 0 -60 z" fill="white" opacity="0.9" />
            <path d="M 850 280 a 25 25 0 0 1 25 -25 a 40 40 0 0 1 70 0 a 25 25 0 0 1 0 50 h -95 a 25 25 0 0 1 0 -50 z" fill="white" opacity="0.8" />
            <path d="M 400 150 a 20 20 0 0 1 20 -20 a 30 30 0 0 1 50 0 a 20 20 0 0 1 0 40 h -70 a 20 20 0 0 1 0 -40 z" fill="white" opacity="0.7" />

            {/* Bãi cỏ uốn lượn */}
            <ellipse cx="300" cy="900" rx="700" ry="250" fill="#81C784" />
            <ellipse cx="900" cy="950" rx="800" ry="280" fill="#66BB6A" />
            <ellipse cx="600" cy="850" rx="550" ry="150" fill="#4CAF50" />

            {/* Hoa trên cỏ */}
            <circle cx="350" cy="780" r="6" fill="#FF8A80" />
            <circle cx="365" cy="785" r="5" fill="#FFFF8D" />
            <circle cx="800" cy="810" r="7" fill="#B388FF" />
            <circle cx="815" cy="805" r="5" fill="#FF8A80" />
            <circle cx="200" cy="850" r="6" fill="#FFFF8D" />
            <circle cx="950" cy="750" r="6" fill="#FF8A80" />
            <circle cx="500" cy="870" r="5" fill="#8C9EFF" />
            <circle cx="680" cy="860" r="6" fill="#FFFF8D" />

            {/* GỐC CÂY CỔ THỤ (Bám rễ, phình to ở dưới) */}
            <path d="M 560 300 L 560 650 Q 560 820 400 880 L 800 880 Q 640 820 640 650 L 640 300 Z" fill="#4E342E" />
            {/* Các cành ẩn trong tán */}
            <path d="M 600 400 Q 480 300 380 300" stroke="#4E342E" strokeWidth="25" strokeLinecap="round" fill="none" />
            <path d="M 600 400 Q 720 300 820 300" stroke="#4E342E" strokeWidth="25" strokeLinecap="round" fill="none" />
            <path d="M 600 400 L 600 200" stroke="#4E342E" strokeWidth="30" strokeLinecap="round" fill="none" />
            
            {/* TÁN LÁ HÌNH TRÒN */}
            {/* Lớp nền sau */}
            <circle cx="600" cy="350" r="240" fill="#2E7D32" opacity="0.95" />
            {/* Cụm trái / phải */}
            <circle cx="420" cy="380" r="160" fill="#388E3C" opacity="0.95" />
            <circle cx="780" cy="380" r="160" fill="#4CAF50" opacity="0.95" />
            {/* Cụm trên */}
            <circle cx="600" cy="180" r="150" fill="#66BB6A" opacity="0.95" />
            {/* Cụm xoè dưới */}
            <circle cx="500" cy="460" r="120" fill="#81C784" opacity="0.9" />
            <circle cx="700" cy="460" r="120" fill="#388E3C" opacity="0.9" />
          </svg>
        </div>

        {/* Lớp hiển thị Phong bì thư */}
        <div className="absolute top-[20%] w-full max-w-4xl h-[45%] z-10 px-8">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex items-center gap-2 bg-white/80 px-6 py-3 rounded-full text-emerald-800 shadow">
                <RefreshCw className="animate-spin" size={20} /> Đang tải cây tâm thư...
              </div>
            </div>
          ) : filteredLetters.length === 0 ? (
            <div className="flex justify-center items-center h-full mt-10">
              <div className="text-center bg-white/90 backdrop-blur px-8 py-6 rounded-2xl shadow-lg border border-emerald-100">
                <p className="text-gray-700 font-medium mb-2">Chưa có lá thư nào treo trên cây.</p>
                <p className="text-sm text-gray-500">Hãy gửi chiếc phong bì đầu tiên lên cây nhé! ✨</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center content-start gap-x-6 gap-y-8 w-full h-full overflow-y-auto pb-10" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {filteredLetters.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setReadingLetter(item)}
                  className="relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 animate-in zoom-in group"
                >
                  <div 
                    style={{ backgroundColor: item.color || '#FFFACD' }} 
                    className="w-16 h-12 rounded-md shadow-md border border-black/10 flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[55%] border-b border-black/10 bg-white/30" style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}></div>
                    <Heart size={12} className="text-red-400 opacity-80 mt-3" fill="currentColor" />
                  </div>
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/75 text-white text-[11px] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity shadow-lg">
                    Gửi: {item.recipient}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nút Gửi Tâm Thư - Góc dưới bên phải */}
        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="absolute bottom-8 right-8 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-bold shadow-2xl hover:from-emerald-600 hover:to-teal-700 transition transform hover:scale-110 hover:-translate-y-1 z-30 border-2 border-white/50"
        >
          <PenTool size={22} />
          <span className="text-lg">Viết Tâm Thư</span>
        </button>

        {/* Thống kê - Góc dưới bên trái */}
        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur px-5 py-3 rounded-full shadow-lg text-sm font-bold text-emerald-800 flex items-center gap-2 z-20 border border-white">
          <Star size={18} className="text-yellow-500 fill-yellow-500" /> Tổng: {letters.length} phong bì
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
            <button onClick={() => setReadingLetter(null)} className="absolute top-4 right-4 text-gray-700 hover:text-black bg-white/40 hover:bg-white/80 transition p-1.5 rounded-full"><X size={18} /></button>
            
            <div className="mb-6 border-b border-black/10 pb-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-800 bg-white/50 px-3 py-1.5 rounded-full shadow-sm">
                Đến: {readingLetter.recipient}
              </span>
            </div>
            
            <p className="text-gray-900 font-serif text-xl italic mb-8 leading-relaxed">
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