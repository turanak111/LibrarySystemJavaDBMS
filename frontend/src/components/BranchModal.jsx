import React from 'react';

const BranchModal = ({ isOpen, onClose, data, title }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-[#1e2337] border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100"
                onClick={e => e.stopPropagation()} // İçeriye tıklayınca kapanmasın
            >
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="bg-[#2a304a] p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Şube Adı</p>
                        <p className="text-lg font-semibold text-blue-400">
                            {data.branch ? data.branch.name : "Merkez Depo"}
                        </p>
                    </div>

                    <div className="bg-[#2a304a] p-4 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Adres</p>
                        <p className="text-white">
                            {data.branch ? data.branch.address : "Adres bilgisi yok"}
                        </p>
                    </div>

                    {/* Eğer bu bir kitap ise stok bilgisini de vurgulayalım */}
                    {data.stock !== undefined && (
                        <div className="bg-[#2a304a] p-4 rounded-lg flex justify-between items-center">
                            <p className="text-sm text-gray-400">Bu Şubedeki Stok</p>
                            <span className="text-2xl font-bold text-green-400">{data.stock} Adet</span>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
                    >
                        Tamam
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BranchModal;