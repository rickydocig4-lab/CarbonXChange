
import React from 'react';
import htm from 'htm';
import { UserRole } from '../types.js';

const html = htm.bind(React.createElement);

const LandingPage = ({ onStart }) => {
  return html`
    <div className="overflow-hidden">
      <section className="relative py-24 lg:py-40 bg-emerald-50 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-8">
              Trade Carbon <span className="text-emerald-600">Credits</span> with Confidence.
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto">
              The premier B2B marketplace for companies to buy and sell verified carbon offsets. Accelerate your sustainability goals with transparent climate financing.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
              <button 
                onClick=${() => onStart(UserRole.BUYER)}
                className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center transform hover:-translate-y-1"
              >
                Become a Buyer
                <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
              <button 
                onClick=${() => onStart(UserRole.SELLER)}
                className="bg-white text-emerald-700 border-2 border-emerald-100 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-emerald-50 transition-all flex items-center justify-center transform hover:-translate-y-1"
              >
                Start Selling Credits
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-1000"></div>
        </div>
      </section>

      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-emerald-600">500+</p>
            <p className="text-slate-500 font-medium">Companies Traded</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-emerald-600">1.2M</p>
            <p className="text-slate-500 font-medium">Tonnes CO2 Offset</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-emerald-600">$45M</p>
            <p className="text-slate-500 font-medium">Total Volume</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-emerald-600">100%</p>
            <p className="text-slate-500 font-medium">Verified Projects</p>
          </div>
        </div>
      </section>
    </div>
  `;
};

export default LandingPage;
