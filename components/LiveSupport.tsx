import React from 'react';
import { MessageCircle, Send } from 'lucide-react';

export const LiveSupport: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">Live Support Center</h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Need assistance with your reseller panel? Our support team is available 24/7 to help you with account issues, API integration, or general inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* WhatsApp Card */}
        <a 
          href="https://api.whatsapp.com/send/?phone=15755549046&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 hover:border-[#25D366]/40 rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full bg-[#25D366]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <MessageCircle size={40} className="text-[#25D366]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">WhatsApp Support</h3>
          <p className="text-gray-400 mb-6">Chat directly with our support team on WhatsApp.</p>
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-lg group-hover:bg-[#20bd5a] transition-colors">
            Chat on WhatsApp
          </span>
        </a>

        {/* Telegram Card */}
        <a 
          href="https://telegram.me/accountbotshop"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-[#0088cc]/10 border border-[#0088cc]/20 hover:bg-[#0088cc]/20 hover:border-[#0088cc]/40 rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer"
        >
          <div className="w-20 h-20 rounded-full bg-[#0088cc]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Send size={40} className="text-[#0088cc]" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Telegram Support</h3>
          <p className="text-gray-400 mb-6">Join our channel or message us on Telegram.</p>
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#0088cc] text-white font-bold rounded-lg group-hover:bg-[#0077b5] transition-colors">
            Chat on Telegram
          </span>
        </a>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-500">
          Typical response time: <span className="text-white font-medium">Under 5 minutes</span>
        </p>
      </div>
    </div>
  );
};