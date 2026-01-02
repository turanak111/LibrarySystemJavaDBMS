import { useState, useEffect } from "react";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Yeni üye formu state'i
  const [newMember, setNewMember] = useState({ fullName: "", email: "" });

  // --- ÖNERİ SİSTEMİ STATE'LERİ ---
  const [showModal, setShowModal] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedMemberName, setSelectedMemberName] = useState("");
  // --------------------------------

  // 1. Üyeleri Çek
  const fetchMembers = () => {
    fetch("http://localhost:8080/api/members")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
        setLoading(false);
      })
      .catch((err) => console.error("Hata:", err));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 2. Yeni Üye Ekle
  const handleAddMember = (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const memberData = {
      fullName: newMember.fullName,
      email: newMember.email,
      joinDate: today 
    };

    fetch("http://localhost:8080/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberData),
    })
      .then((res) => {
        if (res.ok) {
          alert("Üye başarıyla eklendi! ✅");
          setNewMember({ fullName: "", email: "" });
          fetchMembers();
        } else {
          alert("Hata oluştu! Email benzersiz olmalı.");
        }
      });
  };

  // 3. ÖNERİ GETİR (YENİ FONKSİYON) 🤖
  const handleRecommend = (memberId, memberName) => {
    setSelectedMemberName(memberName);
    setRecommendations([]); // Önce temizle
    setShowModal(true); // Modalı aç

    fetch(`http://localhost:8080/api/recommend?memberId=${memberId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data);
      })
      .catch((err) => {
        console.error("Öneri hatası:", err);
        alert("Öneri alınırken hata oluştu.");
        setShowModal(false);
      });
  };

  return (
    <div className="p-8 w-full text-white relative">
      <h1 className="text-3xl font-black mb-6">Üye Yönetimi</h1>

      {/* Yeni Üye Formu */}
      <div className="bg-[#1a1d2d] p-6 rounded-xl border border-[#232948] mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1132d4]">person_add</span>
          Yeni Üye Kaydı
        </h2>
        <form onSubmit={handleAddMember} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-sm text-gray-400 mb-1 block">Ad Soyad</label>
            <input 
              required
              type="text" 
              className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
              placeholder="Örn: Ahmet Yılmaz"
              value={newMember.fullName}
              onChange={(e) => setNewMember({...newMember, fullName: e.target.value})}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="text-sm text-gray-400 mb-1 block">E-Posta</label>
            <input 
              required
              type="email" 
              className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
              placeholder="ahmet@ornek.com"
              value={newMember.email}
              onChange={(e) => setNewMember({...newMember, email: e.target.value})}
            />
          </div>
          <button type="submit" className="bg-[#1132d4] hover:bg-blue-700 px-6 py-2.5 rounded font-bold transition-colors h-[46px] w-full md:w-auto">
            Kaydet
          </button>
        </form>
      </div>

      {/* Üye Listesi */}
      <h2 className="text-xl font-bold mb-4">Kayıtlı Üyeler</h2>
      {loading ? <p>Yükleniyor...</p> : (
        <div className="bg-[#1a1d2d] rounded-xl border border-[#232948] overflow-hidden">
          <table className="w-full text-left text-sm text-[#929bc9]">
            <thead className="bg-[#232948] text-white uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Ad Soyad</th>
                <th className="px-6 py-4">E-Posta</th>
                <th className="px-6 py-4">İşlemler</th> {/* Yeni Kolon */}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232948]">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-[#232948]/50 transition-colors">
                  <td className="px-6 py-4 text-white">#{member.id}</td>
                  <td className="px-6 py-4 font-bold text-white">{member.fullName}</td>
                  <td className="px-6 py-4">{member.email}</td>
                  <td className="px-6 py-4">
                    {/* ÖNERİ BUTONU */}
                    <button 
                      onClick={() => handleRecommend(member.id, member.fullName)}
                      className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500 hover:text-white text-purple-400 px-3 py-1.5 rounded transition-all font-medium text-xs border border-purple-500/30"
                    >
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      Öneri Al
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ÖNERİ MODALI (POP-UP) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1d2d] border border-[#232948] w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-bounce-in">
            {/* Kapat Butonu */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-500">auto_awesome</span>
              {selectedMemberName} İçin Öneriler
            </h3>
            <p className="text-[#929bc9] text-sm mb-6">
              Kullanıcının okuma geçmişine dayalı yapay zeka önerileri:
            </p>

            {/* Kitap Listesi */}
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
              {recommendations.length > 0 ? (
                recommendations.map((book) => (
                  <div key={book.id} className="flex items-center gap-4 bg-[#101322] p-3 rounded-lg border border-[#232948]">
                    <div className="bg-[#232948] h-12 w-10 rounded flex items-center justify-center text-xl">📚</div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{book.title}</h4>
                      <p className="text-xs text-[#929bc9]">{book.author} • {book.genre}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[#929bc9]">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                  <p>Henüz yeterli okuma geçmişi yok veya uygun öneri bulunamadı.</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => setShowModal(false)}
              className="w-full mt-6 bg-[#232948] hover:bg-[#2f365f] text-white py-2 rounded-lg font-bold transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

    </div>
  );
}