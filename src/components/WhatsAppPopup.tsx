"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function WhatsAppPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("whatsapp_popup_seen");
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("whatsapp_popup_seen", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 animate-fade-in">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="text-5xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-[#0a2e1c] mb-2">
            Join Our WhatsApp Channel
          </h2>
          <p className="text-gray-600 mb-6">
            Stay updated with the latest news, offers, and support from AlBarkah Invest.
          </p>
          <a
            href="https://whatsapp.com/channel/0029VbDW0RYJJhzahCh6uR26"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="inline-block bg-[#25D366] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#128C7E] transition-colors"
          >
            Join Now 🚀
          </a>
          <button
            onClick={handleClose}
            className="block mt-3 text-sm text-gray-400 hover:text-gray-600 mx-auto"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}