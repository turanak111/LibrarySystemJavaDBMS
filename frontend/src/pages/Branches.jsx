import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Branches() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newBranch, setNewBranch] = useState({ name: "", address: "" });

    const fetchBranches = () => {
        setLoading(true);
        fetch("http://localhost:8080/api/branches")
            .then((res) => res.json())
            .then((data) => {
                setBranches(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Hata:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleSaveBranch = (e) => {
        e.preventDefault();

        if (!newBranch.name || !newBranch.address) {
            toast.error("Lütfen tüm alanları doldurun.");
            return;
        }

        fetch("http://localhost:8080/api/branches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newBranch),
        })
            .then((res) => {
                if (res.ok) {
                    toast.success("Şube başarıyla eklendi! 🏢");
                    setNewBranch({ name: "", address: "" });
                    fetchBranches();
                } else {
                    toast.error("Şube eklenirken hata oluştu.");
                }
            })
            .catch((err) => console.error(err));
    };

    // --- YENİ EKLENEN SİLME FONKSİYONU ---
    const handleDelete = async (id) => {
        if (!window.confirm("Bu şubeyi silmek istediğinize emin misiniz?")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/branches/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                toast.success("Şube silindi.");
                fetchBranches(); // Listeyi güncelle
            } else {
                // Backend'den gelen hata mesajını okuyalım
                const errorMsg = await response.text();
                toast.error(errorMsg || "Şube silinemedi! (İçinde kitap/üye olabilir)", {
                    style: { border: '1px solid #EF4444', color: '#EF4444' },
                    duration: 5000
                });
            }
        } catch (error) {
            console.error("Silme hatası:", error);
            toast.error("Bağlantı hatası oluştu.");
        }
    };

    return (
        <div className="p-8 w-full text-white relative">
            <h1 className="text-3xl font-black mb-6">Şube Yönetimi</h1>

            {/* Yeni Şube Ekleme Formu */}
            <div className="bg-[#1a1d2d] p-6 rounded-xl border border-[#232948] mb-8 shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1132d4]">add_location_alt</span>
                    Yeni Şube Ekle
                </h2>
                <form onSubmit={handleSaveBranch} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-sm text-gray-400 mb-1 block uppercase font-bold">Şube Adı</label>
                        <input required type="text" className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
                               placeholder="Örn: Kadıköy Şubesi" value={newBranch.name} onChange={(e) => setNewBranch({...newBranch, name: e.target.value})} />
                    </div>
                    <div className="flex-[2] w-full">
                        <label className="text-sm text-gray-400 mb-1 block uppercase font-bold">Adres</label>
                        <input required type="text" className="w-full bg-[#101322] border border-[#232948] rounded p-2.5 text-white focus:border-[#1132d4] outline-none"
                               placeholder="Örn: Caferağa Mah. Moda Cad..." value={newBranch.address} onChange={(e) => setNewBranch({...newBranch, address: e.target.value})} />
                    </div>
                    <button type="submit" className="bg-[#1132d4] hover:bg-blue-700 px-6 py-2.5 rounded font-bold transition-colors h-[46px] w-full md:w-auto text-white whitespace-nowrap">
                        Kaydet
                    </button>
                </form>
            </div>

            {/* Şube Listesi Tablosu */}
            {!loading && (
                <div className="bg-[#1a1d2d] rounded-xl border border-[#232948] overflow-hidden shadow-2xl">
                    <table className="w-full text-left text-sm text-[#929bc9]">
                        <thead className="bg-[#232948] text-white uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Şube Adı</th>
                            <th className="px-6 py-4">Adres</th>
                            <th className="px-6 py-4 text-right">İşlem</th> {/* YENİ SÜTUN */}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-[#232948]">
                        {branches.map((branch) => (
                            <tr key={branch.id} className="hover:bg-[#232948]/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-white">#{branch.id}</td>
                                <td className="px-6 py-4 text-white font-bold text-lg">{branch.name}</td>
                                <td className="px-6 py-4 text-gray-300">{branch.address}</td>

                                {/* SİLME BUTONU */}
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(branch.id)}
                                        className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded transition-colors"
                                        title="Şubeyi Sil"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {branches.length === 0 && <tr><td colSpan="4" className="text-center py-6">Henüz kayıtlı şube yok.</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

    );
}