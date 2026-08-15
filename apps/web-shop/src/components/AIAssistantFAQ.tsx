'use client';

import React, { useState } from 'react';
import { Bot, Power, Plus, MessageSquare, CheckCircle2 } from 'lucide-react';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const AIAssistantFAQ: React.FC = () => {
  const [isAiEnabled, setIsAiEnabled] = useState<boolean>(true);
  const [faqList, setFaqList] = useState<FAQItem[]>([
    { id: 'FAQ-1', question: 'Quán có giao hàng trong vòng 30 phút không?', answer: 'Dạ quán cam kết chuẩn bị món và giao siêu tốc trong 20-30 phút ạ!' },
    { id: 'FAQ-2', question: 'Thuê váy cưới cần đặt cọc bao nhiêu tiền?', answer: 'Dạ tiền cọc giữ váy là 1.000.000 VNĐ. Shop sẽ hoàn trả lại 100% ngay sau khi nhận lại đồ nguyên vẹn ạ!' }
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const addFAQ = () => {
    if (!newQuestion || !newAnswer) return;
    setFaqList([...faqList, { id: `FAQ-${Date.now()}`, question: newQuestion, answer: newAnswer }]);
    setNewQuestion('');
    setNewAnswer('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Trợ Lý AI Cho Shop (Tự Động Phản Hồi Khách Hàng)</span>
            </h2>
            <span className="text-[11px] text-slate-400">Tự động trả lời tin nhắn từ Kho tri thức FAQ của quán</span>
          </div>
        </div>

        <button
          onClick={() => setIsAiEnabled(!isAiEnabled)}
          className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
            isAiEnabled ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isAiEnabled ? 'Bật AI Tự Động Trả Lời' : 'Đã Tắt AI'}</span>
        </button>
      </div>

      {/* Form Nạp Kho Tri Thức FAQ */}
      <div className="bg-purple-500/5 dark:bg-purple-950/20 p-4 rounded-2xl border border-purple-500/20 mb-4 text-xs space-y-3">
        <strong className="block font-extrabold text-purple-700 dark:text-purple-300">Nạp Kho Tri Thức FAQ Cho AI:</strong>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Câu hỏi thường gặp (VD: Quán mở cửa đến mấy giờ?)..."
          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none"
        />
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Câu trả lời mẫu của Shop..."
          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none h-16"
        />
        <button onClick={addFAQ} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center gap-1">
          <Plus className="w-4 h-4" /> <span>Nạp Vào Kho Tri Thức AI</span>
        </button>
      </div>

      {/* FAQ List */}
      <div className="space-y-2 text-xs">
        {faqList.map(faq => (
          <div key={faq.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
              <span>Q: {faq.question}</span>
            </p>
            <p className="text-slate-600 dark:text-slate-300 font-medium pl-5">A: {faq.answer}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
