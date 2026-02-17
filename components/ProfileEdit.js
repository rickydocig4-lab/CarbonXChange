
import React, { useState } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const ProfileEdit = ({ user, onUpdate, onBack }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return html`
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-8 py-6 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
          <button onClick=${onBack} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form onSubmit=${handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Company Name</label>
              <input 
                type="text" 
                value=${formData.companyName}
                onInput=${(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Owner Name</label>
              <input 
                type="text" 
                value=${formData.ownerName}
                onInput=${(e) => setFormData({...formData, ownerName: e.target.value})}
                className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Address</label>
            <textarea 
              value=${formData.address}
              onInput=${(e) => setFormData({...formData, address: e.target.value})}
              className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 h-24 resize-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-4">
            <button type="button" onClick=${onBack} className="flex-1 py-4 border rounded-xl font-bold">Cancel</button>
            <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;
};

export default ProfileEdit;
