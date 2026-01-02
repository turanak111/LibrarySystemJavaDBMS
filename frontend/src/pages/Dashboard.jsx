import { useState, useEffect } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeLoans: 0 // Bunu backend düzelince güncelleriz
  });

  useEffect(() => {
    // 1. Kitap Sayısını Çek
    fetch("http://localhost:8080/api/books")
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({ ...prev, totalBooks: data.length }));
      })
      .catch(err => console.error(err));

    // 2. Üye Sayısını Çek
    fetch("http://localhost:8080/api/members")
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({ ...prev, totalMembers: data.length }));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8 w-full text-white">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Dashboard</h1>
        <p className="text-[#929bc9]">Kütüphane durumuna genel bakış.</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Kart 1: Toplam Kitap */}
        <div className="bg-[#1a1d2d] p-6 rounded-xl border border-[#232948] flex items-center gap-4 hover:border-[#1132d4] transition-colors group">
          <div className="bg-[#1132d4]/10 p-3 rounded-lg group-hover:bg-[#1132d4] transition-colors">
            <span className="material-symbols-outlined text-[#1132d4] text-3xl group-hover:text-white">menu_book</span>
          </div>
          <div>
            <p className="text-[#929bc9] text-sm font-medium">Toplam Kitap</p>
            <h2 className="text-3xl font-bold">{stats.totalBooks}</h2>
          </div>
        </div>

        {/* Kart 2: Toplam Üye */}
        <div className="bg-[#1a1d2d] p-6 rounded-xl border border-[#232948] flex items-center gap-4 hover:border-[#1132d4] transition-colors group">
          <div className="bg-[#1132d4]/10 p-3 rounded-lg group-hover:bg-[#1132d4] transition-colors">
            <span className="material-symbols-outlined text-[#1132d4] text-3xl group-hover:text-white">group</span>
          </div>
          <div>
            <p className="text-[#929bc9] text-sm font-medium">Kayıtlı Üye</p>
            <h2 className="text-3xl font-bold">{stats.totalMembers}</h2>
          </div>
        </div>

        {/* Kart 3: Aktif İşlemler (Temsili) */}
        <div className="bg-[#1a1d2d] p-6 rounded-xl border border-[#232948] flex items-center gap-4 hover:border-orange-500 transition-colors group">
          <div className="bg-orange-500/10 p-3 rounded-lg group-hover:bg-orange-500 transition-colors">
            <span className="material-symbols-outlined text-orange-500 text-3xl group-hover:text-white">sync_alt</span>
          </div>
          <div>
            <p className="text-[#929bc9] text-sm font-medium">Aktif Ödünç</p>
            <h2 className="text-3xl font-bold">{stats.activeLoans}</h2>
          </div>
        </div>
      </div>

      {/* Hızlı İşlemler Bölümü */}
      <h2 className="text-xl font-bold mb-4">Hızlı İşlemler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1a1d2d] p-6 rounded-xl border border-[#232948]">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-green-400">add_circle</span>
            Yeni Kitap Ekle
          </h3>
          <p className="text-sm text-[#929bc9] mb-4">Kütüphane envanterine yeni bir kitap kaydı oluşturun.</p>
          <a href="/books" className="text-sm font-bold text-[#1132d4] hover:underline">Kitaplara Git →</a>
        </div>

        <div className="bg-[#1a1d2d] p-6 rounded-xl border border-[#232948]">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400">person_add</span>
            Üye Kaydı
          </h3>
          <p className="text-sm text-[#929bc9] mb-4">Sisteme yeni bir okuyucu ekleyin ve takibini yapın.</p>
          <a href="/members" className="text-sm font-bold text-[#1132d4] hover:underline">Üyelere Git →</a>
        </div>
      </div>
    </div>
  );
}