import React from 'react';
import { MessageCircle, Signal, Battery, Wifi } from 'lucide-react';
import { MockSms } from '../types';

interface MockPhoneProps {
  messages: MockSms[];
}

const MockPhone: React.FC<MockPhoneProps> = ({ messages }) => {
  return (
    <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[500px] w-[300px] shadow-xl">
      <div className="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-10"></div>
      <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
      
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-slate-100 flex flex-col relative">
        {/* Status Bar */}
        <div className="bg-slate-900 text-white px-4 py-2 pt-3 flex justify-between items-center text-xs">
          <span>09:41</span>
          <div className="flex gap-1">
             <Signal size={12} />
             <Wifi size={12} />
             <Battery size={12} />
          </div>
        </div>

        {/* Header */}
        <div className="bg-gray-200 px-4 py-3 flex items-center gap-3 border-b border-gray-300">
           <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">SA</div>
           <div>
             <p className="font-bold text-sm text-gray-800">SassaAlert</p>
             <p className="text-[10px] text-gray-500">Official Notification</p>
           </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
               <MessageCircle size={32} />
               <p className="text-xs mt-2">No messages yet</p>
             </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col items-start animate-fade-in-up">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[90%]">
                 <p className="text-xs text-gray-700 leading-relaxed">{msg.message}</p>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 ml-2">{msg.timestamp}</span>
            </div>
          ))}
        </div>
        
        {/* Input Mock */}
        <div className="p-3 bg-gray-200">
           <div className="h-8 bg-white rounded-full w-full opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default MockPhone;