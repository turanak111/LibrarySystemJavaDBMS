import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import Loans from "./pages/Loans";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#101322] font-sans">
        
        <Toaster position="top-right" reverseOrder={false} />
        
        <Sidebar />
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