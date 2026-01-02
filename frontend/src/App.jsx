import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Loans from "./pages/Loans";
import Dashboard from "./pages/Dashboard";     



function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#101322] font-sans">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-64 transition-all">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            
            {/* BURAYI KONTROL ET: Members ve Loans doğru bileşeni gösteriyor mu? */}
            <Route path="/members" element={<Members />} />
            <Route path="/loans" element={<Loans />} />
            
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;