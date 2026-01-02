import React from 'react';

export default function Login() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#101322] text-white font-sans overflow-hidden">
      {/* Background Layer: Full Screen Cinematic Image */}
      <div 
        className="fixed inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.8) 100%), url('https://images.unsplash.com/photo-1507842217121-9eac59e749e5?q=80&w=1920&auto=format&fit=crop')" 
        }}
      >
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="w-full px-4 py-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-[#1132d4]">
              {/* Material Icon placeholder */}
              <span className="text-4xl md:text-5xl font-bold">📚</span>
            </div>
            <h1 className="text-[#1132d4] text-2xl md:text-3xl font-black tracking-tighter uppercase drop-shadow-md">
              LibraryUI
            </h1>
          </div>
          <a href="#" className="hidden sm:block text-white text-sm font-medium hover:underline">
            Yardım Merkezi
          </a>
        </header>

        {/* Login Card */}
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-[450px] bg-black/75 p-8 sm:p-12 md:p-16 rounded-lg shadow-2xl backdrop-blur-sm border border-white/5">
            <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">Oturum Aç</h2>
            
            <form className="flex flex-col gap-4">
              {/* Username Input */}
              <div className="relative group">
                <input 
                  type="text" 
                  id="username" 
                  className="block w-full px-5 pt-6 pb-2 text-base text-white bg-[#333333] rounded appearance-none focus:outline-none focus:ring-2 focus:ring-[#1132d4]/50 focus:bg-[#454545] peer border-none transition-colors duration-200" 
                  placeholder=" " 
                />
                <label 
                  htmlFor="username" 
                  className="absolute text-[#8c8c8c] duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 cursor-text"
                >
                  Kullanıcı Adı veya E-posta
                </label>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <input 
                  type="password" 
                  id="password" 
                  className="block w-full px-5 pt-6 pb-2 text-base text-white bg-[#333333] rounded appearance-none focus:outline-none focus:ring-2 focus:ring-[#1132d4]/50 focus:bg-[#454545] peer border-none transition-colors duration-200 pr-12" 
                  placeholder=" " 
                />
                <label 
                  htmlFor="password" 
                  className="absolute text-[#8c8c8c] duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 cursor-text"
                >
                  Parola
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full bg-[#1132d4] hover:bg-[#0e2ab0] text-white font-bold py-3.5 rounded mt-6 transition-all duration-200 text-base shadow-lg shadow-[#1132d4]/20"
              >
                Oturum Aç
              </button>

              {/* Helper Links */}
              <div className="flex justify-between items-center mt-2 text-[#b3b3b3] text-sm">
                <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors select-none">
                  <input type="checkbox" className="w-4 h-4 rounded bg-[#333] border-none text-[#737373] focus:ring-0 focus:ring-offset-0 checked:bg-[#737373] hover:bg-[#444] transition-colors" />
                  <span>Beni hatırla</span>
                </label>
                <a href="#" className="hover:underline hover:text-white transition-colors">Şifremi unuttum</a>
              </div>
            </form>

            <div className="mt-16 text-[#737373]">
              <div className="flex items-start gap-2 text-xs leading-relaxed">
                <span className="text-base text-[#1132d4] pt-0.5">🛡️</span>
                <p>
                  Bu sayfa admin erişimi içindir. Yetkisiz giriş denemeleri kayıt altına alınır. <a href="#" className="text-white hover:underline whitespace-nowrap">Daha fazla bilgi</a>.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-black/80 py-8 px-4 md:px-12 mt-auto border-t border-white/5 relative z-10">
          <div className="max-w-[1000px] mx-auto text-[#737373] text-sm">
            <p className="mb-4">Teknik destek için sistem yöneticisiyle iletişime geçin.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6">
              <a href="#" className="hover:underline">Sistem Durumu</a>
              <a href="#" className="hover:underline">Gizlilik Politikası</a>
              <a href="#" className="hover:underline">Kullanım Şartları</a>
              <a href="#" className="hover:underline">Sürüm 1.4.2</a>
            </div>
            <div className="mt-6 text-xs text-[#555]">
              LibraryUI © 2026
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}