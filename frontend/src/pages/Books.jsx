import { useState, useEffect } from "react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Arama metni için state
  const [searchTerm, setSearchTerm] = useState("");

  // Kitapları Çekme Fonksiyonu
  const fetchBooks = (query = "") => {
    setLoading(true);
    let url = "http://localhost:8080/api/books";
    
    // Eğer arama metni varsa URL'i değiştir
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
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Form submit (Enter veya Büyüteç Tıklaması)
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    fetchBooks("");
  };

  return (
    <div className="p-8 w-full text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-black">Kitaplar</h1>
        
        <div className="flex gap-2 w-full md:w-auto">
          {/* ARAMA FORMU */}
          <form onSubmit={handleSearch} className="relative flex items-center w-full md:w-80">
            
            {/* GÜNCELLENEN KISIM: Büyüteç artık bir buton */}
            <button 
              type="submit"
              className="absolute left-2 text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer z-10"
              title="Ara"
            >
              <span className="material-symbols-outlined text-xl block">search</span>
            </button>

            <input 
              type="text" 
              className="w-full bg-[#1a1d2d] border border-[#232948] rounded-lg py-2.5 pl-12 pr-10 text-white focus:border-[#1132d4] outline-none transition-colors"
              placeholder="Kitap, yazar veya ISBN ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* Temizleme Butonu (X) */}
            {searchTerm && (
              <button 
                type="button" 
                onClick={handleClear}
                className="absolute right-3 text-gray-400 hover:text-white"
                title="Temizle"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </form>

          <button className="bg-[#1132d4] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold transition-colors whitespace-nowrap">
            + Yeni Kitap
          </button>
        </div>
      </div>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="text-red-500">Hata: {error}</p>}

      {!loading && !error && (
        <div className="bg-[#1a1d2d] rounded-xl border border-[#232948] overflow-hidden">
          <table className="w-full text-left text-sm text-[#929bc9]">
            <thead className="bg-[#232948] text-white uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Kitap Adı</th>
                <th className="px-6 py-4">Yazar</th>
                <th className="px-6 py-4">Tür</th>
                <th className="px-6 py-4">ISBN</th>
                <th className="px-6 py-4">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232948]">
              {books.map((book) => (
                <tr key={book.id} className="hover:bg-[#232948]/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">#{book.id}</td>
                  <td className="px-6 py-4 text-white font-bold">{book.title}</td>
                  <td className="px-6 py-4">{book.author}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded text-xs">
                      {book.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">{book.isbn}</td>
                  <td className="px-6 py-4">
                    {(book.isAvailable || book.available) ? (
                      <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs font-bold border border-green-400/20">
                        RAF
                      </span>
                    ) : (
                      <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs font-bold border border-red-400/20">
                        ÖDÜNÇTE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              
              {books.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    Aradığınız kriterlere uygun kitap bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}