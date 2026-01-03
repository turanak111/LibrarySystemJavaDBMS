import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Loans() {
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const [showHistory, setShowHistory] = useState(false);


  const [borrowForm, setBorrowForm] = useState({ bookId: "", memberId: "" });
  const [returnMessage, setReturnMessage] = useState(null);


  const fetchLoans = () => {
    setLoading(true);

    fetch("http://localhost:8080/api/members")
      .then((res) => res.json())
      .then((data) => {
        const allLoans = [];
        
        if (Array.isArray(data)) {
            data.forEach((member) => {
                if (member.loans && Array.isArray(member.loans)) {
                    member.loans.forEach((loan) => {
                        

                        let bookTitle = "Bilinmeyen Kitap";
                        if (loan.book && loan.book.title) {
                            bookTitle = loan.book.title;
                        } else if (loan.bookId) {
                            bookTitle = `Kitap ID: ${loan.bookId}`;
                        }


                        const isReturned = (loan.returnDate !== null) || (loan.returned === true);

                        allLoans.push({
                            ...loan,
                            memberName: member.fullName, 
                            memberId: member.id,
                            displayBookTitle: bookTitle,
                            isReturned: isReturned 
                        });
                    });
                }
            });
        }
        
        
        allLoans.sort((a, b) => new Date(b.loanDate) - new Date(a.loanDate));

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

  
  const isOverdue = (loanDateString) => {
      if (!loanDateString) return false;
      const loanDate = new Date(loanDateString);
      const today = new Date();
      const diffTime = Math.abs(today - loanDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 15; 
  };

  
  const handleBorrow = (e) => {
    e.preventDefault();
    
    const requestBody = {
      bookId: borrowForm.bookId,
      memberId: borrowForm.memberId
    };

    fetch("http://localhost:8080/api/borrow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    })
    .then(async (res) => {
      if (res.ok) {
        toast.success("Ödünç verme işlemi başarılı! 📖");
        setBorrowForm({ bookId: "", memberId: "" });
        setTimeout(() => fetchLoans(), 500); 
      } else {
        
        const errorText = await res.text();
        
        
        let friendlyMessage = "İşlem başarısız oldu.";

        
        if (errorText.includes("No value present") || errorText.includes("not found")) {
            friendlyMessage = "❌ HATA: Girilen ID'ye sahip Kitap veya Üye bulunamadı.";
        }
        else if (errorText.includes("Stock")) {
            friendlyMessage = "⚠️ STOK YETERSİZ: Bu kitap şu an kütüphanede yok.";
        }
        else if (errorText.includes("timestamp") || errorText.includes("500")) {
             friendlyMessage = "❌ Kayıt bulunamadı! Lütfen Kitap ve Üye ID'lerini kontrol ediniz.";
        } 
        else {
            friendlyMessage = "⚠️ " + errorText;
        }

        toast.error(friendlyMessage, { duration: 4000 });
      }
    })
    .catch((err) => {
        console.error("Fetch Hatası:", err);
        toast.error("Sunucuya bağlanılamadı!");
    });
  };

  
  const handleWaiveFine = (loanId) => {
    if (!window.confirm("Cezayı silmek istiyor musunuz?")) return;
    fetch(`http://localhost:8080/api/loans/${loanId}/waive`, { method: "PUT" })
    .then((res) => {
      if(res.ok) { toast.success("Ceza silindi."); fetchLoans(); } 
      else { toast.error("İşlem başarısız."); }
    });
  };

  
  const handleReturn = (loanId, loanDate) => {
    const overdue = isOverdue(loanDate);
    let msg = "İade almak istiyor musunuz?";
    if (overdue) msg = "⚠️ DİKKAT: Kitap gecikmiş! Cezayı sildiyseniz devam edin.";

    if (!window.confirm(msg)) return;

    fetch(`http://localhost:8080/api/return?loanId=${loanId}`, { method: "POST" })
    .then(async (res) => {
      if (res.ok) {
        const message = await res.text();
        setReturnMessage(message); 
        fetchLoans(); 
        toast.success("İade Alındı!");
      } else {
        toast.error("Hata oluştu.");
      }
    });
  };

  return (
    <div className="p-8 w-full text-white">
      <h1 className="text-3xl font-black mb-6">Ödünç & İade</h1>

      
      <div className="bg-[#1a1d2d] p-6 rounded-xl border border-[#232948] mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1132d4]">book</span>
          Kitap Ödünç Ver
        </h2>
        <form onSubmit={handleBorrow} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-sm text-gray-400 mb-1 block">Kitap ID</label>
            <input required type="number" className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
              placeholder="Örn: 3" value={borrowForm.bookId} onChange={(e) => setBorrowForm({...borrowForm, bookId: e.target.value})} />
          </div>
          <div className="flex-1 w-full">
            <label className="text-sm text-gray-400 mb-1 block">Üye ID</label>
            <input required type="number" className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
              placeholder="Örn: 5" value={borrowForm.memberId} onChange={(e) => setBorrowForm({...borrowForm, memberId: e.target.value})} />
          </div>
          <button type="submit" className="bg-[#1132d4] hover:bg-blue-700 px-6 py-2.5 rounded font-bold transition-colors h-[46px] w-full md:w-auto">
            Ödünç Ver
          </button>
        </form>
      </div>

      {returnMessage && (
        <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 p-4 rounded mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined">info</span>
          {returnMessage}
        </div>
      )}

      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Ödünç Listesi</h2>
        
        
        <label className="flex items-center gap-2 cursor-pointer select-none bg-[#232948] px-4 py-2 rounded-lg border border-[#343b61] hover:bg-[#2f365f] transition-colors">
            <input 
                type="checkbox" 
                checked={showHistory}
                onChange={(e) => setShowHistory(e.target.checked)}
                className="w-4 h-4 accent-[#1132d4]"
            />
            <span className="text-sm text-gray-300">Geçmiş İşlemleri Göster</span>
        </label>
      </div>

      {loading ? <p>Yükleniyor...</p> : (
        <div className="bg-[#1a1d2d] rounded-xl border border-[#232948] overflow-hidden">
          <table className="w-full text-left text-sm text-[#929bc9]">
            <thead className="bg-[#232948] text-white uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Üye</th>
                <th className="px-6 py-4">Kitap</th>
                <th className="px-6 py-4">Veriliş</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232948]">
              {activeLoans
            
                .filter(loan => showHistory || !loan.isReturned) 
                .map((loan) => {
                 const overdue = isOverdue(loan.loanDate);
                 
                 return (
                    <tr key={loan.id} className={`hover:bg-[#232948]/50 ${loan.isReturned ? 'opacity-50 grayscale' : ''}`}>
                        <td className="px-6 py-4 font-mono text-white">#{loan.id}</td>
                        <td className="px-6 py-4 font-bold text-white">{loan.memberName}</td>
                        <td className="px-6 py-4">{loan.displayBookTitle}</td>
                        <td className="px-6 py-4">
                            {loan.loanDate}
                            {overdue && !loan.isReturned && <span className="ml-2 text-red-500 text-xs font-bold border border-red-500 px-1 rounded">GECİKMİŞ</span>}
                        </td>
                        
                       
                        <td className="px-6 py-4">
                            {loan.isReturned ? (
                                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-500/30">
                                    İADE EDİLDİ
                                </span>
                            ) : (
                                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold border border-blue-500/30">
                                    BEKLİYOR
                                </span>
                            )}
                        </td>

                        <td className="px-6 py-4 flex justify-end gap-2">
                           
                            {!loan.isReturned && (
                                <>
                                    <button 
                                        onClick={() => handleWaiveFine(loan.id)} 
                                        disabled={!overdue} 
                                        className={`px-3 py-1.5 rounded transition-all font-medium text-xs border 
                                            ${overdue 
                                                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500 hover:text-black cursor-pointer' 
                                                : 'bg-gray-800 text-gray-600 border-gray-700 opacity-50 cursor-not-allowed'
                                            }`}
                                    >
                                        Cezayı Sil
                                    </button>

                                    <button 
                                        onClick={() => handleReturn(loan.id, loan.loanDate)} 
                                        className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 px-3 py-1.5 rounded transition-all font-medium text-xs border border-red-500/30"
                                    >
                                        İade Al
                                    </button>
                                </>
                            )}
                        </td>
                    </tr>
                 );
              })}
              
              {activeLoans.filter(loan => showHistory || !loan.isReturned).length === 0 && (
                <tr><td colSpan="6" className="text-center py-6 text-gray-400">
                    Görüntülenecek kayıt bulunamadı.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}