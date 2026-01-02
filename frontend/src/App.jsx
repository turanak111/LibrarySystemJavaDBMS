import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Books from "./pages/Books";


// Geçici Dashboard (İleride dolduracağız)
const Dashboard = () => <div className="p-10 text-white text-2xl">Hoşgeldiniz! Sol menüden işlemleri seçebilirsiniz.</div>;
// Geçici Diğer Sayfalar
const Members = () => <div className="p-10 text-white text-2xl">Üyeler Sayfası (Yapılacak)</div>;
const Loans = () => <div className="p-10 text-white text-2xl">Ödünç İşlemleri (Yapılacak)</div>;

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#101322] font-sans">
        {/* Sabit Sol Menü */}
        <Sidebar />

        {/* İçerik Alanı (Sol menü kadar boşluk bırakıyoruz: ml-64) */}
        <main className="flex-1 ml-0 md:ml-64 transition-all">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/members" element={<Members />} />
            <Route path="/loans" element={<Loans />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;