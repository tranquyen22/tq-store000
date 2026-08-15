'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Bot, ShieldCheck } from 'lucide-react';
import { maskPhoneNumber } from '@tq-platform/utils';

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: 'CUSTOMER' | 'SHOP' | 'DRIVER' | 'CSKH';
  content: string;
  isAiGenerated?: boolean;
  timestamp: string;
}

export const RealtimeChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'M-1', senderName: 'Trợ lý AI Shop', senderRole: 'SHOP', content: 'Dạ shop chào bạn! Shop đang chuẩn bị món ăn siêu tốc cho bạn ạ.', isAiGenerated: true, timestamp: '14:30' },
    { id: 'M-2', senderName: 'Tài xế Nguyễn Văn Hùng', senderRole: 'DRIVER', content: 'Tôi đang đến điểm đón. SĐT liên hệ: 098*1234**', timestamp: '14:32' }
  ]);

  const [inputMsg, setInputMsg] = useState('');

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputMsg;
    if (!textToSend.trim()) return;

    // Mask phone numbers strictly matching spec format
    const phoneRegex = /(0[3|5|7|8|9]\d{8})/g;
    const sanitizedText = textToSend.replace(phoneRegex, (match) => maskPhoneNumber(match));

    const newMsg: ChatMessage = {
      id: `M-${Date.now()}`,
      senderName: 'Bạn (Khách hàng)',
      senderRole: 'CUSTOMER',
      content: sanitizedText,
      timestamp: '14:35'
    };

    setMessages([...messages, newMsg]);
    if (!customText) setInputMsg('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6 max-w-xl mx-auto">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-sky-500" />
          <strong className="text-sm font-extrabold text-slate-900 dark:text-white">Kênh Chat Bảo Mật PII (Ẩn SĐT)</strong>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" /> Bảo vệ quyền riêng tư
        </span>
      </div>

      {/* Messages Stream */}
      <div className="space-y-3 max-h-64 overflow-y-auto mb-4 p-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
        {messages.map(msg => (
          <div key={msg.id} className={`p-2.5 rounded-xl ${msg.senderRole === 'CUSTOMER' ? 'bg-sky-500 text-white ml-8' : 'bg-white dark:bg-slate-800 border text-slate-800 dark:text-slate-200 mr-8'}`}>
            <div className="flex justify-between items-center text-[10px] font-bold opacity-80 mb-1">
              <span className="flex items-center gap-1">
                {msg.senderName}
                {msg.isAiGenerated && <span className="bg-purple-500 text-white px-1.5 py-0.2 rounded text-[9px] flex items-center gap-0.5"><Bot className="w-2.5 h-2.5" /> AI</span>}
              </span>
              <span>{msg.timestamp}</span>
            </div>
            <p className="font-medium">{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Driver Quick Preset Message Buttons */}
      <div className="flex gap-2 mb-3 overflow-x-auto text-[11px]">
        <button onClick={() => handleSendMessage('Tôi đang đến điểm đón')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-lg shrink-0">
          "Tôi đang đến điểm đón"
        </button>
        <button onClick={() => handleSendMessage('Vui lòng đợi tôi 2 phút')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold rounded-lg shrink-0">
          "Vui lòng đợi tôi 2 phút"
        </button>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Nhập tin nhắn (SĐT sẽ tự động ẩn dạng 098*1234**)..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs outline-none"
        />
        <button onClick={() => handleSendMessage()} className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl">
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
