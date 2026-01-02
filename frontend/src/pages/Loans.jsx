import { useState, useEffect } from "react";

export default function Loans() {
  // Veriler için state'ler
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Ödünç Verme Formu
  const [borrowForm, setBorrowForm] = useState({ bookId: "", memberId: "" });
  
  // İade Sonucu (Ceza mesajı)
  const [returnMessage, setReturnMessage] = useState(null);

  // 1. Aktif Ödünçleri Bulmak için Üyeleri Çekiyoruz
  const fetchLoans = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/members")
      .then((res) => res.json())
      .then((data) => {
        // Gelen üye verisinin içinde 'loans' listesi var mı diye bakıp hepsini tek bir listede topluyoruz
        const allLoans = [];
        data.forEach((member) => {
          if (member.loans && member.loans.length > 0) {
            member.loans.forEach((loan) => {
              // Eğer kitap henüz iade edilmemişse (returnDate null ise) listeye ekle
              if (!loan.returnDate) {
                allLoans.push({
                  ...loan,
                  memberName: member.fullName, // Tabloda göstermek için üye adını da ekliyoruz
                  memberId: member.id
                });
              }
            });
          }
        });
        setActiveLoans(allLoans);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hata:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // 2. Kitap Ödünç Ver (Borrow)
  const handleBorrow = (e) => {
    e.preventDefault();
    // Query Parametreleri ile istek atıyoruz: ?bookId=1&memberId=5
    fetch(`http://localhost:8080/api/borrow?bookId=${borrowForm.bookId}&memberId=${borrowForm.memberId}`, {
      method: "POST"
    })
    .then(async (res) => {
      if (res.ok) {
        alert("Kitap başarıyla ödünç verildi! 📖");
        setBorrowForm({ bookId: "", memberId: "" });
        fetchLoans(); // Listeyi güncelle
      } else {
        const errorText = await res.text();
        alert("Hata: " + errorText);
      }
    });
  };

  // 3. Kitap İade Al (Return)
  const handleReturn = (loanId) => {
    if (!window.confirm("Bu kitabı iade almak istediğinize emin misiniz?")) return;

    fetch(`http://localhost:8080/api/return?loanId=${loanId}`, {
      method: "POST"
    })
    .then(async (res) => {
      if (res.ok) {
        const message = await res.text(); // Backend'den dönen mesaj (varsa ceza tutarı)
        setReturnMessage(message); // Mesajı ekrana bas
        fetchLoans(); // Listeyi güncelle
        alert("İade işlemi başarılı! ✅\n" + message);
      } else {
        alert("İade alınırken hata oluştu.");
      }
    });
  };

  return (
    <div className="p-8 w-full text-white">
      <h1 className="text-3xl font-black mb-6">Ödünç & İade İşlemleri</h1>

      {/* Üst Kısım: Ödünç Verme Formu */}
      <div className="bg-[#1a1d2d] p-6 rounded-xl border border-[#232948] mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1132d4]">book</span>
          Kitap Ödünç Ver
        </h2>
        <form onSubmit={handleBorrow} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-sm text-gray-400 mb-1 block">Kitap ID</label>
            <input 
              required
              type="number" 
              className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
              placeholder="Örn: 3"
              value={borrowForm.bookId}
              onChange={(e) => setBorrowForm({...borrowForm, bookId: e.target.value})}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="text-sm text-gray-400 mb-1 block">Üye ID</label>
            <input 
              required
              type="number" 
              className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
              placeholder="Örn: 5"
              value={borrowForm.memberId}
              onChange={(e) => setBorrowForm({...borrowForm, memberId: e.target.value})}
            />
          </div>
          <button type="submit" className="bg-[#1132d4] hover:bg-blue-700 px-6 py-2.5 rounded font-bold transition-colors h-[46px] w-full md:w-auto">
            Ödünç Ver
          </button>
        </form>
      </div>

      {/* Mesaj Alanı (Ceza vb.) */}
      {returnMessage && (
        <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 p-4 rounded mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined">info</span>
          {returnMessage}
        </div>
      )}

      {/* Alt Kısım: Aktif Ödünçler Tablosu */}
      <h2 className="text-xl font-bold mb-4">Aktif Ödünçler (İade Bekleyenler)</h2>
      {loading ? <p>Yükleniyor...</p> : (
        <div className="bg-[#1a1d2d] rounded-xl border border-[#232948] overflow-hidden">
          <table className="w-full text-left text-sm text-[#929bc9]">
            <thead className="bg-[#232948] text-white uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Loan ID</th>
                <th className="px-6 py-4">Üye Adı</th>
                <th className="px-6 py-4">Kitap Adı</th>
                <th className="px-6 py-4">Veriliş Tarihi</th>
                <th className="px-6 py-4">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232948]">
              {activeLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-[#232948]/50">
                  <td className="px-6 py-4 font-mono text-white">#{loan.id}</td>
                  <td className="px-6 py-4 font-bold text-white">{loan.memberName}</td>
                  {/* API kitap adını dönüyorsa loan.book.title, dönmüyorsa ID gösteririz */}
                  <td className="px-6 py-4">{loan.book ? loan.book.title : "Kitap ID: " + loan.bookId}</td>
                  <td className="px-6 py-4">{loan.loanDate || "Tarih Yok"}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleReturn(loan.id)}
                      className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 px-3 py-1.5 rounded transition-all font-medium text-xs border border-red-500/30"
                    >
                      İade Al
                    </button>
                  </td>
                </tr>
              ))}
              {activeLoans.length === 0 && (
                <tr><td colSpan="5" className="text-center py-6">Şu an ödünçte kitap yok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}