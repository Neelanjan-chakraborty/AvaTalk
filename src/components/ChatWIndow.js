import React from 'react';

const ChatWindow = ({ message, type }) => (
  <div className={`flex items-start space-x-2 ${type === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
    {type === 'assistant' && (
      <div className="shrink-0">
        <Bot className="w-6 h-6 text-blue-500" />
      </div>
    )}
    <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${
      type === 'user'
        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
        : 'bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-lg text-gray-100'
    }`}>
      <p className="text-sm md:text-base">{message}</p>
    </div>
    {type === 'user' && (
      <div className="shrink-0">
        <UserCircle className="w-6 h-6 text-gray-400" />
      </div>
    )}
  </div>
);

export default ChatWindow;
