'use client';

import React, { useState } from 'react';
import { Bot, Send, Plus, Sparkles, MessageSquare } from 'lucide-react';
import { AIFAQItem } from '../types';

const mockFAQs: AIFAQItem[] = [
  { id: '1', question: 'Quán có hỗ trợ ship đêm không?', answer: 'Dạ quán mở cửa giao đồ ăn từ 08:00 sáng tới 23:00 đêm hàng ngày ạ.' },
  { id: '2', question: 'Tiền cọc thuê váy đầm tính như thế nào?', answer: 'Dạ tiền cọc đầm dạ hội là 1.000.000đ/bộ, quán sẽ hoàn lại 100% khi nhận lại váy nguyên vẹn.' }
];

export const AIAssistantFAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<AIFAQItem[]>(mockFAQs);
  const [qInput, setQInput] = useState('');
  const [aInput, setAInput] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [simulating, setSimulating] = useState(false);

  const handleAddFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qInput || !aInput) return;
    setFaqs(prev => [...prev, { id: Date.now().toString(), question: qInput, answer: aInput }]);
    setQInput('');
    setAInput('');
  };

  const handleSimulateWebhook = () => {
    if (!customerMessage) return;
    setSimulating(true);
    setAiReply('');
    setTimeout(() => {
      const match = faqs.find(f => customerMessage.toLowerCase().includes('cọc') || customerMessage.toLowerCase().includes('thuê') ? f.id === '2' : f.id === '1');
      setAiReply(match ? match.answer : `[AI Webhook Auto-Reply]: Dạ chào bạn! Cảm ơn bạn đã nhắn tin cho shop. Shop sẽ tư vấn ngay ạ!`);
      setSimulating(false);
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Bot className="w-5 h-5 text-sky-500" />
        <span>Trợ Lý AI Tự Động Trả Lời Tin Nhắn Khách Hàng (LLM Webhook)</span>
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Knowledge Base Uploader */}
        <div>
          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase mb-3">1. Nạp Kho Tri Thức FAQ Quán</h4>
          <form onSubmit={handleAddFAQ} className="space-y-2 mb-4">
            <input type="text" value={qInput} onChange={(e) => setQInput(e.target.value)} placeholder="Câu hỏi thường gặp (vd: Phí cọc bao nhiêu?)..." className="w-full px-3 py-2 text-xs rounded-xl border outline-none bg-slate-50 dark:bg-slate-900" />
            <textarea rows={2} value={aInput} onChange={(e) => setAInput(e.target.value)} placeholder="Câu trả lời chuẩn của quán..." className="w-full px-3 py-2 text-xs rounded-xl border outline-none bg-slate-50 dark:bg-slate-900" />
            <button type="submit" className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl flex items-center gap-1">
              <Plus className="w-4 h-4" /> <span>Nạp câu trả lời AI</span>
            </button>
          </form>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {faqs.map(item => (
              <div key={item.id} className="p-2.5 rounded-xl border text-xs bg-slate-50 dark:bg-slate-900">
                <strong className="text-sky-600 dark:text-sky-400 block">Q: {item.question}</strong>
                <span className="text-slate-600 dark:text-slate-300">A: {item.answer}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Webhook Auto-Reply Simulator */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border flex flex-col">
          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase mb-3 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-sky-500" />
            <span>2. Mô Phỏng AI Auto-Reply Khi Khách Nhắn</span>
          </h4>

          <div className="flex-1 space-y-3 mb-4 min-h-[120px]">
            {customerMessage && (
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs self-end ml-8">
                <strong>Khách:</strong> {customerMessage}
              </div>
            )}
            {simulating && <div className="text-xs text-slate-400 font-semibold animate-pulse flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI đang suy nghĩ câu trả lời...</div>}
            {aiReply && (
              <div className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs mr-8 border">
                <strong className="text-emerald-500 flex items-center gap-1"><Bot className="w-3.5 h-3.5" /> AI Auto-Bot:</strong> {aiReply}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="Nhập tin nhắn giả lập của khách..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border bg-white dark:bg-slate-800 outline-none"
            />
            <button onClick={handleSimulateWebhook} className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1">
              <Send className="w-3.5 h-3.5" /> <span>Gửi tin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
