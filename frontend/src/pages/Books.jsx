import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

 
  const [showAddModal, setShowAddModal] = useState(false);

  
  const [newBook, setNewBook] = useState({
    title: "", author: "", genre: "", isbn: "", isAvailable: true 
  });

  
  const fetchBooks = (query = "") => {
    setLoading(true);
    let url = "http://localhost:8080/api/books";
    if (query.length > 0) {
      url = `http://localhost:8080/api/books/search?query=${query}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Veri çekilemedi!");
        return res.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Hata:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    fetchBooks("");
  };

  
  const handleSaveBook = (e) => {
    e.preventDefault();

    
    if (!newBook.title || !newBook.isbn) {
        toast.error("Lütfen Kitap Adı ve ISBN alanlarını doldurun.");
        return;
    }

    // Backend 'stock' bekliyorsa diye gizli olarak 1 gönderiyoruz ki 'Mevcut Değil' hatası almayalım.
    // Ama kullanıcı bunu görmüyor ve yönetmiyor.
    const payload = {
        ...newBook,
        stock: 5 // Varsayılan olarak her eklenen kitaptan 5 tane varmış gibi davranalım.
    };

    fetch("http://localhost:8080/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    .then((res) => {
        if (res.ok) {
            toast.success("Kitap başarıyla eklendi! 📚");
            setShowAddModal(false);
            setNewBook({ title: "", author: "", genre: "", isbn: "", isAvailable: true });
            fetchBooks();
        } else {
            toast.error("Kitap eklenirken hata oluştu.");
        }
    })
    .catch((err) => console.error(err));
  };

  
  const handleDelete = (id) => {
    if(!window.confirm("Bu kitabı silmek istediğinize emin misiniz?")) return;
    
    fetch(`http://localhost:8080/api/books/${id}`, { method: "DELETE" })
    .then(res => {
      if(res.ok) { toast.success("Kitap silindi."); fetchBooks(); } 
      else { toast.error("Silinemedi (Kitap şu an ödünçte olabilir)."); }
    });
  };

  return (
    <div className="p-8 w-full text-white relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-black">Kitaplar</h1> 
        
        <div className="flex gap-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex items-center w-full md:w-80">
            <button type="submit" className="absolute left-2 text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer z-10">
              <span className="material-symbols-outlined text-xl block">search</span>
            </button>
            <input 
              type="text" 
              className="w-full bg-[#1a1d2d] border border-[#232948] rounded-lg py-2.5 pl-12 pr-10 text-white focus:border-[#1132d4] outline-none transition-colors"
              placeholder="Kitap, Yazar veya ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" onClick={handleClear} className="absolute right-3 text-gray-400 hover:text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </form>

          <button onClick={() => setShowAddModal(true)} className="bg-[#1132d4] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold transition-colors whitespace-nowrap flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            Yeni Kitap
          </button>
        </div>
      </div>

      {!loading && (
        <div className="bg-[#1a1d2d] rounded-xl border border-[#232948] overflow-hidden">
          <table className="w-full text-left text-sm text-[#929bc9]">
            <thead className="bg-[#232948] text-white uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Kitap Adı</th>
                <th className="px-6 py-4">Yazar</th>
                <th className="px-6 py-4">Tür</th>
                <th className="px-6 py-4">ISBN</th>
                
                <th className="px-6 py-4 text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232948]">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-[#232948]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">#{book.id}</td>
                  <td className="px-6 py-4 text-white font-bold">{book.title}</td>
                  <td className="px-6 py-4">{book.author}</td>
                  <td className="px-6 py-4"><span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs">{book.genre}</span></td>
                  <td className="px-6 py-4 font-mono">{book.isbn}</td>
                  
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleDelete(book.id)} className="text-red-400 hover:text-red-200 hover:bg-red-500/20 p-2 rounded transition-colors" title="Kitabı Sil">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1a1d2d] border border-[#232948] w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1132d4]">book</span>
              Kitap Ekle
            </h2>
            
            <form onSubmit={handleSaveBook} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block uppercase font-bold">Kitap Adı</label>
                <input required type="text" className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
                  value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} />
              </div>
              
              <div>
                <label className="text-xs text-gray-400 mb-1 block uppercase font-bold">Yazar</label>
                <input required type="text" className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
                  value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block uppercase font-bold">ISBN</label>
                <input required type="text" className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none font-mono"
                  value={newBook.isbn} onChange={(e) => setNewBook({...newBook, isbn: e.target.value})} />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block uppercase font-bold">Tür</label>
                <input required type="text" className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
                  value={newBook.genre} onChange={(e) => setNewBook({...newBook, genre: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-[#1132d4] hover:bg-blue-700 text-white font-bold py-3 rounded-lg mt-2 transition-colors">
                Kaydet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}