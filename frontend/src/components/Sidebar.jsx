import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  
  const activeClass = "bg-[#1132d4]/10 text-[#1132d4] border-l-4 border-[#1132d4]";
  
  const inactiveClass = "text-[#929bc9] hover:bg-[#232948] hover:text-white border-l-4 border-transparent";

  return (
    <aside className="flex w-64 flex-col border-r border-[#232948] bg-[#101322] hidden md:flex shrink-0 h-screen fixed left-0 top-0">
      <div className="flex h-full flex-col p-4">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="bg-[#1132d4]/20 p-2 rounded-lg">
            <span className="material-symbols-outlined text-[#1132d4] text-2xl">local_library</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold leading-none">NetLibrary</h1>
            <p className="text-[#929bc9] text-xs font-normal mt-1">Admin Paneli</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <Link to="/" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${location.pathname === "/" ? activeClass : inactiveClass}`}>
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <p className="text-sm font-medium">Dashboard</p>
          </Link>

          <Link to="/books" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${location.pathname === "/books" ? activeClass : inactiveClass}`}>
            <span className="material-symbols-outlined text-xl">menu_book</span>
            <p className="text-sm font-medium">Kitaplar</p>
          </Link>

          <Link to="/members" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${location.pathname === "/members" ? activeClass : inactiveClass}`}>
            <span className="material-symbols-outlined text-xl">group</span>
            <p className="text-sm font-medium">Üyeler</p>
          </Link>

          <Link to="/loans" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${location.pathname === "/loans" ? activeClass : inactiveClass}`}>
            <span className="material-symbols-outlined text-xl">sync_alt</span>
            <p className="text-sm font-medium">Ödünç / İade</p>
          </Link>
        </nav>
      </div>
    </aside>
  );
}