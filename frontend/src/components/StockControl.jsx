import React, { useState } from 'react';

const StockControl = ({ book, onOpenModal }) => {
    const [stock, setStock] = useState(book.stock || 0);
    const [loading, setLoading] = useState(false);

    const updateStock = async (newVal) => {
        if (newVal < 0) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/books/${book.id}/stock?newStock=${newVal}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                setStock(newVal);
            }
        } catch (error) {
            console.error("Hata:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2 bg-[#1a1f36] p-1 rounded-lg border border-gray-700/50">
            {/* Azalt Butonu */}
            <button
                onClick={(e) => { e.stopPropagation(); updateStock(stock - 1); }}
                disabled={loading || stock <= 0}
                className="w-8 h-8 flex items-center justify-center rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-30 font-bold"
            >
                -
            </button>

            {/* Stok Sayısı (Tıklanabilir - Modalı Açar) */}
            <div
                onClick={() => onOpenModal(book)}
                className="min-w-[40px] text-center font-mono text-white font-bold cursor-pointer hover:text-blue-400 hover:underline select-none"
                title="Şube detayını görmek için tıkla"
            >
                {loading ? "..." : stock}
            </div>

            {/* Arttır Butonu */}
            <button
                onClick={(e) => { e.stopPropagation(); updateStock(stock + 1); }}
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-30 font-bold"
            >
                +
            </button>
        </div>
    );
};

export default StockControl;