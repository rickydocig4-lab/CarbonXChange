
import React, { useState } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const Layout = ({ children, user, onLogout, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return html`
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick=${() => onNavigate('home')}>
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">Carbon<span className="text-emerald-600">Xchange</span></span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              ${!user ? html`
                <${React.Fragment}>
                  <button onClick=${() => onNavigate('home')} className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Home</button>
                  <a href="#how-it-works" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">How It Works</a>
                  <button onClick=${() => onNavigate('login')} className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Login</button>
                  <button 
                    onClick=${() => onNavigate('signup')} 
                    className="bg-emerald-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                  >
                    Join Now
                  </button>
                <//>
              ` : html`
                <${React.Fragment}>
                  <button onClick=${() => onNavigate('dashboard')} className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Dashboard</button>
                  <div className="flex items-center space-x-3 border-l pl-8 ml-4">
                    <button 
                      onClick=${() => onNavigate('profile')}
                      className="flex items-center group space-x-3 text-left hover:opacity-80 transition-opacity"
                    >
                      <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors overflow-hidden">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      </div>
                      <div className="hidden lg:block text-right">
                        <p className="text-sm font-semibold text-slate-800 leading-none">${user.companyName}</p>
                        <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider mt-1">${user.role}</p>
                      </div>
                    </button>
                    <button 
                      onClick=${onLogout}
                      className="text-slate-400 hover:text-red-500 transition-colors ml-4"
                      title="Logout"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                <//>
              `}
            </div>
            
            <div className="md:hidden">
                <button onClick=${() => setMenuOpen(!menuOpen)} className="p-2 text-slate-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d=${menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>
          </div>
        </div>
        
        ${menuOpen && html`
            <div className="md:hidden bg-white border-b px-4 py-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                <button onClick=${() => {onNavigate('home'); setMenuOpen(false);}} className="block w-full text-left py-2 text-slate-600 font-medium">Home</button>
                ${!user ? html`
                    <${React.Fragment}>
                        <button onClick=${() => {onNavigate('login'); setMenuOpen(false);}} className="block w-full text-left py-2 text-slate-600 font-medium">Login</button>
                        <button onClick=${() => {onNavigate('signup'); setMenuOpen(false);}} className="block w-full text-left py-2 text-emerald-600 font-bold">Sign Up</button>
                    <//>
                ` : html`
                    <${React.Fragment}>
                        <button onClick=${() => {onNavigate('dashboard'); setMenuOpen(false);}} className="block w-full text-left py-2 text-slate-600 font-medium">Dashboard</button>
                        <button onClick=${() => {onNavigate('profile'); setMenuOpen(false);}} className="block w-full text-left py-2 text-slate-600 font-medium">Edit Profile</button>
                        <button onClick=${() => {onLogout(); setMenuOpen(false);}} className="block w-full text-left py-2 text-red-500 font-medium">Logout</button>
                    <//>
                `}
            </div>
        `}
      </nav>

      <main className="flex-grow">
        ${children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-2">
                <span className="text-slate-900 font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-white">CarbonXchange</span>
            </div>
            <p className="max-w-xs text-slate-400">
              Accelerating the global transition to net-zero through transparent, reliable, and accessible carbon credit trading for businesses worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick=${() => onNavigate('home')} className="hover:text-emerald-400">Home</button></li>
              <li><button className="hover:text-emerald-400">About Credits</button></li>
              <li><a href="#" className="hover:text-emerald-400">How It Works</a></li>
              <li><a href="#" className="hover:text-emerald-400">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>support@carbonxchange.io</li>
              <li>+1 (555) 123-4567</li>
              <li>San Francisco, CA</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          &copy; ${new Date().getFullYear()} CarbonXchange. All rights reserved.
        </div>
      </footer>
    </div>
  `;
};

export default Layout;
