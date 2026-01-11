import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [branches, setBranches] = useState([]); // Şubeleri tutacak
  const [loading, setLoading] = useState(true);

  // Yeni üyeye branchId ekledik (Varsayılan 1)
  const [newMember, setNewMember] = useState({ fullName: "", email: "", branchId: "1" });

  const [showModal, setShowModal] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedMemberName, setSelectedMemberName] = useState("");

  // Verileri Çekme
  const fetchData = async () => {
    setLoading(true);
    try {
      // Üyeleri ve Şubeleri paralel çekelim
      const [membersRes, branchesRes] = await Promise.all([
        fetch("http://localhost:8080/api/members"),
        fetch("http://localhost:8080/api/branches")
      ]);

      const membersData = await membersRes.json();
      const branchesData = await branchesRes.json();

      setMembers(membersData);
      setBranches(branchesData);
    } catch (error) {
      console.error("Veri hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMember = (e) => {
    e.preventDefault();

    if (!newMember.email || newMember.email.trim() === "") {
      toast.error("Lütfen bir e-posta adresi girin.");
      return;
    }

    const existingMember = members.find(m => m.email.toLowerCase() === newMember.email.toLowerCase());
    if (existingMember) {
      toast.error(`"${newMember.email}" adresiyle kayıtlı bir üye zaten var!`);
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    // Backend entity yapısına uygun payload
    const memberData = {
      fullName: newMember.fullName,
      email: newMember.email,
      joinDate: today,
      branch: {
        id: parseInt(newMember.branchId)
      }
    };

    fetch("http://localhost:8080/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberData),
    })
        .then((res) => {
          if (res.ok) {
            toast.success("Üye başarıyla eklendi! ✅");
            setNewMember({ fullName: "", email: "", branchId: "1" });
            fetchData(); // Listeyi güncelle
          } else {
            toast.error("Kaydedilirken bir hata oluştu.");
          }
        });
  };

  const handleDelete = (id) => {
    if(!window.confirm("Bu üyeyi silmek istediğinize emin misiniz?")) return;

    fetch(`http://localhost:8080/api/members/${id}`, {
      method: "DELETE"
    })
        .then(async (res) => {
          if(res.ok) {
            toast.success("Üye silindi.");
            fetchData();
          } else {
            toast.error("Bu üye silinemedi!", { duration: 4000 });
          }
        })
        .catch(err => toast.error("Sunucu ile bağlantı hatası."));
  };

  const handleRecommend = (memberId, memberName) => {
    setSelectedMemberName(memberName);
    setRecommendations([]);
    const loadingToast = toast.loading("Öneriler hazırlanıyor...");

    fetch(`http://localhost:8080/api/recommend?memberId=${memberId}`)
        .then((res) => {
          if(!res.ok) throw new Error("Öneri servisi hata verdi");
          return res.json();
        })
        .then((data) => {
          toast.dismiss(loadingToast);
          setRecommendations(data);
          setShowModal(true);
          if(data.length > 0) toast.success(`${data.length} kitap önerildi!`);
          else toast("Uygun öneri bulunamadı.", { icon: 'ℹ️' });
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          setShowModal(false);
          toast.error("Öneri alınırken hata oluştu.");
        });
  };

  return (
      <div className="p-8 w-full text-white relative">
        <h1 className="text-3xl font-black mb-6">Üye Yönetimi</h1>

        {/* Yeni Üye Formu */}
        <div className="bg-[#1a1d2d] p-6 rounded-xl border border-[#232948] mb-8 shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1132d4]">person_add</span>
            Yeni Üye Kaydı
          </h2>
          <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

            <div className="w-full">
              <label className="text-sm text-gray-400 mb-1 block uppercase font-bold">Ad Soyad</label>
              <input required type="text" className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
                     placeholder="Örn: Ahmet Yılmaz" value={newMember.fullName} onChange={(e) => setNewMember({...newMember, fullName: e.target.value})} />
            </div>

            <div className="w-full">
              <label className="text-sm text-gray-400 mb-1 block uppercase font-bold">E-Posta</label>
              <input required type="email" className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
                     placeholder="ahmet@ornek.com" value={newMember.email} onChange={(e) => setNewMember({...newMember, email: e.target.value})} />
            </div>

            {/* ŞUBE SEÇİMİ */}
            <div className="w-full">
              <label className="text-sm text-gray-400 mb-1 block uppercase font-bold">Kayıtlı Şube</label>
              <select
                  className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none appearance-none"
                  value={newMember.branchId}
                  onChange={(e) => setNewMember({...newMember, branchId: e.target.value})}
              >
                {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                ))}
                {branches.length === 0 && <option value="1">Şube Yok / Yükleniyor</option>}
              </select>
            </div>

            <button type="submit" className="bg-[#1132d4] hover:bg-blue-700 px-6 py-2.5 rounded font-bold transition-colors h-[46px] w-full text-white">
              Kaydet
            </button>
          </form>
        </div>

        {/* Üye Listesi Tablosu */}
        {!loading && (
            <div className="bg-[#1a1d2d] rounded-xl border border-[#232948] overflow-hidden shadow-2xl">
              <table className="w-full text-left text-sm text-[#929bc9]">
                <thead className="bg-[#232948] text-white uppercase text-xs font-bold">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Ad Soyad</th>
                  <th className="px-6 py-4">E-Posta</th>
                  <th className="px-6 py-4">Kayıtlı Şube</th>
                  <th className="px-6 py-4 text-right">İşlemler</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-[#232948]">
                {members.map((member) => (
                    <tr key={member.id} className="hover:bg-[#232948]/50 transition-colors">
                      <td className="px-6 py-4 text-white">#{member.id}</td>
                      <td className="px-6 py-4 font-bold text-white">{member.fullName}</td>
                      <td className="px-6 py-4">{member.email}</td>

                      {/* Şube Bilgisi */}
                      <td className="px-6 py-4">
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs border border-emerald-500/30 font-medium">
                        {member.branch ? member.branch.name : "Merkez"}
                    </span>
                      </td>

                      <td className="px-6 py-4 flex justify-end gap-2">
                        <button onClick={() => handleRecommend(member.id, member.fullName)} className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500 hover:text-white text-purple-400 px-3 py-1.5 rounded transition-all font-medium text-xs border border-purple-500/30">
                          <span className="material-symbols-outlined text-sm">auto_awesome</span>
                          Öneri
                        </button>

                        <button onClick={() => handleDelete(member.id)} className="text-red-400 hover:text-red-200 hover:bg-red-500/20 p-2 rounded transition-colors" title="Üyeyi Sil">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {/* Öneri Modalı - Aynı Kalıyor */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-[#1a1d2d] border border-[#232948] w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-500">auto_awesome</span>
                  {selectedMemberName} İçin Öneriler
                </h3>
                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar mt-4">
                  {recommendations.length > 0 ? (
                      recommendations.map((book) => (
                          <div key={book.id} className="flex items-center gap-4 bg-[#101322] p-3 rounded-lg border border-[#232948]">
                            <div className="bg-[#232948] h-12 w-10 rounded flex items-center justify-center text-xl shadow-lg">📚</div>
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
                <button onClick={() => setShowModal(false)} className="w-full mt-6 bg-[#232948] hover:bg-[#2f365f] text-white py-2 rounded-lg font-bold transition-colors">Kapat</button>
              </div>
            </div>
        )}
      </div>
  );
}