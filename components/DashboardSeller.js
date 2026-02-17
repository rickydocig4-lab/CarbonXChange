
import React, { useState, useMemo } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const DashboardSeller = ({ user, credits, orders, onAddCredit, onBuy }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  const [formData, setFormData] = useState({
    projectType: 'Reforestation',
    amount: '',
    pricePerUnit: '',
    location: '',
    description: '',
    imageUrl: '',
    videoUrl: ''
  });

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [type]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCredit({
      ...formData,
      amount: Number(formData.amount),
      pricePerUnit: Number(formData.pricePerUnit),
      status: 'available',
      sellerId: user.id,
      sellerName: user.companyName
    });
    setShowAddForm(false);
    setFormData({ projectType: 'Reforestation', amount: '', pricePerUnit: '', location: '', description: '', imageUrl: '', videoUrl: '' });
  };

  const filteredMarketplace = useMemo(() => {
    return credits.filter(c => {
      if (c.status !== 'available') return false;
      const matchesSearch = c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || c.projectType === filterType;
      return matchesSearch && matchesType;
    });
  }, [credits, searchTerm, filterType]);

  const mySales = useMemo(() => orders.filter(o => o.sellerId === user.id), [orders, user.id]);
  const myPurchases = useMemo(() => orders.filter(o => o.buyerId === user.id), [orders, user.id]);
  
  const allDeals = useMemo(() => {
    return [...mySales.map(s => ({ ...s, type: 'SALE' })), ...myPurchases.map(p => ({ ...p, type: 'PURCHASE' }))]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [mySales, myPurchases]);

  const totalRevenue = useMemo(() => mySales.reduce((acc, o) => acc + o.totalPrice, 0), [mySales]);
  const tonnesDelivered = useMemo(() => mySales.reduce((acc, o) => acc + o.amount, 0), [mySales]);

  const projectTypes = ['All', 'Reforestation', 'Renewable Energy', 'Methane Capture', 'Energy Efficiency'];

  return html`
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Seller Dashboard</h1>
          <p className="text-slate-500">Managing global carbon assets for ${user.companyName}.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
            <button 
              onClick=${() => setActiveTab('marketplace')}
              className=${`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'marketplace' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Marketplace
            </button>
            <button 
              onClick=${() => setActiveTab('deals')}
              className=${`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'deals' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Deals
            </button>
          </div>
          
          <button 
            onClick=${() => setShowAddForm(true)}
            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            List New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group">
            <h3 className="text-slate-500 font-medium mb-1">Total Sales Revenue</h3>
            <p className="text-4xl font-black text-slate-900">$${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group">
            <h3 className="text-slate-500 font-medium mb-1">Impact Delivered</h3>
            <p className="text-4xl font-black text-slate-900">${tonnesDelivered.toLocaleString()} <span className="text-lg font-normal text-slate-400">tCO2e</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group">
            <h3 className="text-slate-500 font-medium mb-1">Market Activity</h3>
            <p className="text-4xl font-black text-slate-900">${filteredMarketplace.length}</p>
        </div>
      </div>

      <div className="w-full">
        ${activeTab === 'marketplace' ? html`
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-bold text-slate-900">Global Marketplace</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search market..."
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all w-full sm:w-64"
                  value=${searchTerm}
                  onInput=${(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all w-full sm:w-48 bg-white"
                  value=${filterType}
                  onChange=${(e) => setFilterType(e.target.value)}
                >
                  ${projectTypes.map(type => html`<option key=${type} value=${type}>${type}</option>`)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${filteredMarketplace.length > 0 ? filteredMarketplace.map(credit => html`
                <div key=${credit.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col overflow-hidden group">
                  <div className="h-44 bg-slate-200 relative">
                    ${credit.imageUrl ? html`<img src=${credit.imageUrl} className="w-full h-full object-cover" />` : html`<img src=${`https://picsum.photos/seed/${credit.id}/800/600`} className="w-full h-full object-cover" />`}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm uppercase tracking-widest">
                      ${credit.projectType}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-2">${credit.description}</h4>
                      <p className="text-xs text-slate-500 mt-2 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                        ${credit.location}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-tight">Provider: ${credit.sellerName}</p>
                    </div>
                    <div>
                      <div className="flex items-end justify-between mt-8 pt-6 border-t border-slate-50">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Price / t</p>
                          <p className="font-black text-2xl text-emerald-600">$${credit.pricePerUnit}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Available</p>
                          <span className="text-sm font-bold text-slate-800">${credit.amount.toLocaleString()} t</span>
                        </div>
                      </div>
                      ${credit.sellerId !== user.id ? html`
                        <button 
                          onClick=${() => onBuy(credit.id)}
                          className="w-full mt-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md active:scale-95"
                        >
                          Buy Now
                        </button>
                      ` : html`
                        <div className="w-full mt-6 py-3 bg-slate-50 text-slate-400 font-bold rounded-xl text-center cursor-default">
                          Active Listing
                        </div>
                      `}
                    </div>
                  </div>
                </div>
              `) : html`<div className="col-span-full py-20 text-center text-slate-400">No market data matches your search.</div>`}
            </div>
          </div>
        ` : html`
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Deal History (Sales & Purchases)</h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Volume</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  ${allDeals.length > 0 ? allDeals.map(deal => html`
                    <tr key=${deal.id + deal.type} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className=${`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest ${deal.type === 'SALE' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>
                          ${deal.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">${deal.amount.toLocaleString()} t</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">$${deal.totalPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${deal.date}</td>
                    </tr>
                  `) : html`<tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No deals recorded yet.</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        `}
      </div>

      ${showAddForm && html`
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl h-[90vh] overflow-y-auto p-8 shadow-2xl custom-scrollbar">
             <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-4 border-b">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">List Carbon Credits</h3>
                  <p className="text-slate-500 text-sm">Fill in the project details and provide proof documentation.</p>
                </div>
                <button onClick=${() => setShowAddForm(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
             </div>
             
             <form onSubmit=${handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Type</label>
                        <select 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            value=${formData.projectType}
                            onChange=${(e) => setFormData({...formData, projectType: e.target.value})}
                        >
                            <option>Reforestation</option>
                            <option>Renewable Energy</option>
                            <option>Methane Capture</option>
                            <option>Energy Efficiency</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                        <input 
                            type="text" required placeholder="City, Country"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            value=${formData.location}
                            onInput=${(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Volume (Tonnes CO2e)</label>
                        <input 
                            type="number" required placeholder="0" min="1"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            value=${formData.amount}
                            onInput=${(e) => setFormData({...formData, amount: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price per Unit ($)</label>
                        <input 
                            type="number" required placeholder="0.00" min="0.1" step="0.01"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            value=${formData.pricePerUnit}
                            onInput=${(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Description</label>
                    <textarea 
                        required placeholder="Detail the environmental impact and verification standards..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-32 resize-none focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        value=${formData.description}
                        onInput=${(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Image</label>
                    <div className="relative group">
                      <div className=${`w-full h-40 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden transition-all ${formData.imageUrl ? 'border-emerald-300' : 'hover:border-emerald-400'}`}>
                        ${formData.imageUrl ? html`<img src=${formData.imageUrl} className="w-full h-full object-cover" />` : html`
                          <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          <span className="text-xs text-slate-500">Click to upload image</span>
                        `}
                        <input 
                          type="file" 
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange=${(e) => handleFileUpload(e, 'imageUrl')}
                        />
                      </div>
                      ${formData.imageUrl && html`
                        <button type="button" onClick=${() => setFormData({...formData, imageUrl: ''})} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      `}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Project Video (Optional)</label>
                    <div className="relative group">
                      <div className=${`w-full h-40 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden transition-all ${formData.videoUrl ? 'border-emerald-300' : 'hover:border-emerald-400'}`}>
                        ${formData.videoUrl ? html`
                          <div className="flex flex-col items-center justify-center">
                            <svg className="w-10 h-10 text-emerald-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                            <span className="text-xs text-emerald-600 font-bold">Video uploaded</span>
                          </div>
                        ` : html`
                          <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                          <span className="text-xs text-slate-500">Click to upload video</span>
                        `}
                        <input 
                          type="file" 
                          accept="video/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange=${(e) => handleFileUpload(e, 'videoUrl')}
                        />
                      </div>
                      ${formData.videoUrl && html`
                        <button type="button" onClick=${() => setFormData({...formData, videoUrl: ''})} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      `}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <button type="submit" className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-[0.98] transition-all">
                      Publish Carbon Listing
                  </button>
                </div>
             </form>
          </div>
        </div>
      `}
      <style>
        {\`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        \`}
      </style>
    </div>
  `;
};

export default DashboardSeller;
