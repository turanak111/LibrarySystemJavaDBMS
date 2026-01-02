import { useState, useEffect } from "react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa yüklendiğinde Backend'den kitapları çek
  useEffect(() => {
    fetch("http://localhost:8080/api/books")
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
  }, []);

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-white">Kitaplar</h1>
        <button className="bg-[#1132d4] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold transition-colors">
          + Yeni Kitap
        </button>
      </div>

      {loading && <p className="text-white">Yükleniyor...</p>}
      {error && <p className="text-red-500">Hata: {error}. Backend çalışıyor mu?</p>}

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
                    {book.isAvailable ? (
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
                    Henüz hiç kitap yok.
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