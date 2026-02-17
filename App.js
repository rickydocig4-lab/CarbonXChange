
import React, { useState, useEffect } from 'react';
import htm from 'htm';
import Layout from './components/Layout.js';
import LandingPage from './components/LandingPage.js';
import DashboardBuyer from './components/DashboardBuyer.js';
import DashboardSeller from './components/DashboardSeller.js';
import ProfileEdit from './components/ProfileEdit.js';
import { UserRole } from './types.js';
import { supabase } from './supabase.js';

const html = htm.bind(React.createElement);

const App = () => {
  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState([]);
  const [orders, setOrders] = useState([]);
  const [authRole, setAuthRole] = useState(UserRole.BUYER);
  const [authForm, setAuthForm] = useState({ email: '', password: '', companyName: '', ownerName: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('carbon_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Credits
      const { data: creditsData, error: creditsError } = await supabase
        .from('carbon_credits')
        .select('*')
        .order('created_at', { ascending: false });

      if (creditsData) {
        setCredits(creditsData.map(c => ({
          ...c,
          sellerId: c.seller_id,
          sellerName: c.seller_name,
          pricePerUnit: c.price_per_unit,
          projectType: c.project_type,
          imageUrl: c.image_url,
          videoUrl: c.video_url
        })));
      }

      // Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersData) {
        setOrders(ordersData.map(o => ({
          ...o,
          creditId: o.credit_id,
          buyerId: o.buyer_id,
          sellerId: o.seller_id,
          totalPrice: o.total_price,
          date: new Date(o.created_at).toLocaleDateString()
        })));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
    localStorage.removeItem('carbon_user');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let authResponse;
      if (view === 'signup') {
        authResponse = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
        });
      } else {
        authResponse = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        });
      }

      if (authResponse.error) throw authResponse.error;
      const authUser = authResponse.data.user;

      if (!authUser) throw new Error("Authentication failed. Please check your email for a confirmation link if you just signed up.");

      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: authUser.id,
            email: authForm.email,
            role: authRole,
            company_name: authForm.companyName || (authRole === UserRole.BUYER ? 'Acme Corp' : 'EcoSellers'),
            owner_name: authForm.ownerName || 'John Doe',
            address: '123 Climate Way',
            mobile: '+123456789',
            verified: true
          }])
          .select()
          .single();
        
        if (createError) throw createError;
        profile = newProfile;
      }

      const appUser = {
        ...profile,
        companyName: profile.company_name,
        ownerName: profile.owner_name
      };

      setUser(appUser);
      localStorage.setItem('carbon_user', JSON.stringify(appUser));
      setView('dashboard');
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed: " + err.message);
    }
  };

  const handleUpdateProfile = async (updatedUser) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: updatedUser.companyName,
          owner_name: updatedUser.ownerName,
          address: updatedUser.address
        })
        .eq('id', updatedUser.id);

      if (error) throw error;
      setUser(updatedUser);
      localStorage.setItem('carbon_user', JSON.stringify(updatedUser));
      setView('dashboard');
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  const handleBuy = async (creditId) => {
    if (!user) return;
    const credit = credits.find(c => c.id === creditId);
    if (!credit || credit.status !== 'available') return;

    try {
      const { error: orderError } = await supabase
        .from('orders')
        .insert([{
          credit_id: creditId,
          buyer_id: user.id,
          seller_id: credit.sellerId,
          amount: credit.amount,
          total_price: credit.amount * credit.pricePerUnit,
          status: 'completed'
        }]);

      if (orderError) throw orderError;

      const { error: creditError } = await supabase
        .from('carbon_credits')
        .update({ status: 'sold' })
        .eq('id', creditId);

      if (creditError) throw creditError;

      await fetchData();
      alert('Transaction Complete! Your impact has been logged and the marketplace updated.');
    } catch (err) {
      alert("Transaction failed: " + err.message);
    }
  };

  const handleAddCredit = async (newCredit) => {
    try {
      const { error } = await supabase
        .from('carbon_credits')
        .insert([{
          seller_id: user.id,
          seller_name: user.companyName,
          amount: newCredit.amount,
          price_per_unit: newCredit.pricePerUnit,
          project_type: newCredit.projectType,
          location: newCredit.location,
          description: newCredit.description,
          status: 'available',
          image_url: newCredit.imageUrl,
          video_url: newCredit.videoUrl
        }]);

      if (error) throw error;
      await fetchData();
    } catch (err) {
      alert("Failed to list credit: " + err.message);
    }
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
