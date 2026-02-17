
import React, { useState, useMemo } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const DashboardBuyer = ({ user, credits, orders, onBuy }) => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredCredits = useMemo(() => {
    return credits.filter(credit => {
      if (credit.status !== 'available') return false;
      const matchesSearch = credit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            credit.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            credit.projectType.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || credit.projectType === filterType;
      return matchesSearch && matchesType;
    });
  }, [credits, searchTerm, filterType]);

  const myOrders = useMemo(() => orders.filter(o => o.buyerId === user.id), [orders, user.id]);
  const totalOffset = useMemo(() => myOrders.reduce((acc, o) => acc + o.amount, 0), [myOrders]);
  const totalSpent = useMemo(() => myOrders.reduce((acc, o) => acc + o.totalPrice, 0), [myOrders]);

  const projectTypes = ['All', 'Reforestation', 'Renewable Energy', 'Methane Capture', 'Energy Efficiency'];

  return html`
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Buyer Dashboard</h1>
          <p className="text-slate-500">Welcome back, ${user.ownerName}. Track your offsets and explore new opportunities.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
          <button 
            onClick=${() => setActiveTab('marketplace')}
            className=${`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'marketplace' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Marketplace
          </button>
          <button 
            onClick=${() => setActiveTab('orders')}
            className=${`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'orders' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            My Orders
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-slate-500 font-medium mb-1">Total Carbon Offset</h3>
            <p className="text-4xl font-bold text-slate-900">
                ${totalOffset.toLocaleString()} <span className="text-sm text-slate-400 font-normal">tCO2e</span>
            </p>
            <div className="mt-4 pt-4 border-t border-slate-50">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Total Investment</span>
                    <span className="text-emerald-600 font-bold">$${totalSpent.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[75%]"></div>
                </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          ${activeTab === 'marketplace' ? html`
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value=${searchTerm}
                    onInput=${(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="sm:w-56">
                  <select
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                    value=${filterType}
                    onChange=${(e) => setFilterType(e.target.value)}
                  >
                    ${projectTypes.map(type => html`<option key=${type} value=${type}>${type}</option>`)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${filteredCredits.length > 0 ? filteredCredits.map((credit) => html`
                  <div key=${credit.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col">
                     <div className="h-44 bg-slate-200 relative overflow-hidden">
                        ${credit.imageUrl ? html`<img src=${credit.imageUrl} alt=${credit.projectType} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />` : html`<img src=${`https://picsum.photos/seed/${credit.id}/800/600`} alt=${credit.projectType} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />`}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm uppercase tracking-widest border border-white/20">
                          ${credit.projectType}
                        </div>
                     </div>
                     <div className="p-6 flex flex-col flex-grow">
                        <h4 className="font-bold text-slate-900 text-lg leading-tight mb-2">${credit.description}</h4>
                        <p className="text-slate-500 text-sm flex items-center mb-4">
                          <svg className="w-4 h-4 mr-1 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                          ${credit.location}
                        </p>
                        <div className="flex items-end justify-between mt-auto pt-6 border-t border-slate-50">
                           <div>
                              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Price / tCO2e</span>
                              <span className="text-2xl font-black text-emerald-600">$${credit.pricePerUnit}</span>
                           </div>
                           <div className="text-right">
                              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Stock</span>
                              <span className="text-lg font-bold text-slate-800">${credit.amount.toLocaleString()} t</span>
                           </div>
                        </div>
                        <button 
                          onClick=${() => onBuy(credit.id)}
                          className="w-full mt-6 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all"
                        >
                          Purchase Credits
                        </button>
                     </div>
                  </div>
                `) : html`
                  <div className="col-span-full py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500">No projects found matching your criteria.</p>
                  </div>
                `}
              </div>
            </div>
          ` : html`
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  ${myOrders.length > 0 ? myOrders.map((order) => html`
                    <tr key=${order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-400">#${order.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">${order.amount.toLocaleString()} t</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">$${order.totalPrice.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${order.date}</td>
                    </tr>
                  `) : html`
                    <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No orders yet.</td></tr>
                  `}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
};

export default DashboardBuyer;
