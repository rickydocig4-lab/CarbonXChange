
import React, { useState, useEffect } from 'react';
import htm from 'htm';
import Layout from './components/Layout.js';
import LandingPage from './components/LandingPage.js';
import DashboardBuyer from './components/DashboardBuyer.js';
import DashboardSeller from './components/DashboardSeller.js';
import ProfileEdit from './components/ProfileEdit.js';
import { UserRole } from './types.js';

const html = htm.bind(React.createElement);

const INITIAL_CREDITS = [
  { id: '1', sellerId: 's1', sellerName: 'GreenForest Ltd', amount: 1500, pricePerUnit: 18, projectType: 'Reforestation', location: 'Amazon Basin, Brazil', description: 'Sustainable reforestation of 500 hectares of degraded land.', status: 'available' },
  { id: '2', sellerId: 's1', sellerName: 'GreenForest Ltd', amount: 800, pricePerUnit: 22, projectType: 'Renewable Energy', location: 'Atacama Desert, Chile', description: 'Solar farm project providing clean energy to local grid.', status: 'available' },
  { id: '3', sellerId: 's2', sellerName: 'EcoCapture', amount: 3000, pricePerUnit: 15, projectType: 'Methane Capture', location: 'Dumpsite, Jakarta', description: 'Capture and conversion of landfill methane into electricity.', status: 'available' }
];

const App = () => {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(INITIAL_CREDITS);
  const [orders, setOrders] = useState([]);
  const [authRole, setAuthRole] = useState(UserRole.BUYER);
  const [authForm, setAuthForm] = useState({ email: '', password: '', companyName: '', ownerName: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('carbon_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    setUser(null);
    setView('home');
    localStorage.removeItem('carbon_user');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: authForm.email,
        role: authRole,
        companyName: authForm.companyName || (authRole === UserRole.BUYER ? 'Acme Corp' : 'EcoSellers'),
        ownerName: authForm.ownerName || 'John Doe',
        address: '123 Climate Way',
        mobile: '+123456789',
        verified: true
    };
    setUser(newUser);
    localStorage.setItem('carbon_user', JSON.stringify(newUser));
    setView('dashboard');
  };

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('carbon_user', JSON.stringify(updatedUser));
    setView('dashboard');
  };

  const handleBuy = (creditId) => {
    if (!user) return;
    const credit = credits.find(c => c.id === creditId);
    if (!credit || credit.status !== 'available') return;

    const newOrder = {
        id: Math.random().toString(36).substr(2, 9),
        creditId,
        buyerId: user.id,
        sellerId: credit.sellerId,
        amount: credit.amount,
        totalPrice: credit.amount * credit.pricePerUnit,
        date: new Date().toLocaleDateString(),
        status: 'completed'
    };

    setOrders(prev => [...prev, newOrder]);
    setCredits(prev => prev.map(c => c.id === creditId ? {...c, status: 'sold'} : c));
    alert('Transaction Complete! Your impact has been logged and the marketplace updated.');
  };

  const handleAddCredit = (newCredit) => {
    const credit = { 
      id: Math.random().toString(36).substr(2, 9), 
      ...newCredit,
      sellerId: user.id,
      sellerName: user.companyName,
      status: 'available'
    };
    setCredits(prev => [credit, ...prev]);
  };

  const renderContent = () => {
    if (view === 'signup' || view === 'login') {
      return html`
        <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-3xl font-bold mb-8 text-slate-900">${view === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
          <form onSubmit=${handleLogin} className="space-y-4">
             <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
               <button 
                 type="button" 
                 onClick=${() => setAuthRole(UserRole.BUYER)}
                 className=${`flex-1 py-2 rounded-lg font-medium ${authRole === UserRole.BUYER ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
               >Buyer</button>
               <button 
                 type="button" 
                 onClick=${() => setAuthRole(UserRole.SELLER)}
                 className=${`flex-1 py-2 rounded-lg font-medium ${authRole === UserRole.SELLER ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
               >Seller</button>
             </div>
             ${view === 'signup' && html`
              <${React.Fragment}>
                <input type="text" placeholder="Company Name" className="w-full px-4 py-3 bg-slate-50 rounded-xl" onInput=${e => setAuthForm({...authForm, companyName: e.target.value})} required />
                <input type="text" placeholder="Full Name" className="w-full px-4 py-3 bg-slate-50 rounded-xl" onInput=${e => setAuthForm({...authForm, ownerName: e.target.value})} required />
              <//>
             `}
             <input type="email" placeholder="Email" required className="w-full px-4 py-3 bg-slate-50 rounded-xl" onInput=${e => setAuthForm({...authForm, email: e.target.value})} />
             <input type="password" placeholder="Password" required className="w-full px-4 py-3 bg-slate-50 rounded-xl" onInput=${e => setAuthForm({...authForm, password: e.target.value})} />
             <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg mt-4 hover:bg-emerald-700 transition-colors">${view === 'signup' ? 'Register' : 'Login'}</button>
          </form>
          <div className="mt-6 text-center">
            <button 
              onClick=${() => setView(view === 'signup' ? 'login' : 'signup')}
              className="text-emerald-600 font-bold hover:underline"
            >
              ${view === 'signup' ? 'Already have an account? Login' : "No account? Sign up"}
            </button>
          </div>
        </div>
      `;
    }

    switch (view) {
      case 'home': 
        return html`<${LandingPage} onStart=${(role) => { if (role) setAuthRole(role); setView('signup'); }} />`;
      case 'dashboard':
        if (!user) return html`<${LandingPage} onStart=${() => setView('signup')} />`;
        return user.role === UserRole.BUYER ? 
          html`<${DashboardBuyer} user=${user} credits=${credits} orders=${orders} onBuy=${handleBuy} />` : 
          html`<${DashboardSeller} user=${user} credits=${credits} orders=${orders} onAddCredit=${handleAddCredit} onBuy=${handleBuy} />`;
      case 'profile':
        if (!user) return html`<${LandingPage} onStart=${() => setView('signup')} />`;
        return html`<${ProfileEdit} user=${user} onUpdate=${handleUpdateProfile} onBack=${() => setView('dashboard')} />`;
      default: 
        return html`<${LandingPage} onStart=${() => setView('signup')} />`;
    }
  };

  return html`<${Layout} user=${user} onLogout=${handleLogout} onNavigate=${setView}>${renderContent()}<//>`;
};

export default App;
