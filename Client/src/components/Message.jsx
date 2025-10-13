import React, { useEffect } from 'react';
import { assets } from '../assets/assets';
import moment from 'moment';
import Markdown from 'react-markdown';
import Prism from 'prismjs';

const Message = ({ message }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div className="my-4">
      {message.role === 'user' ? (
        // USER MESSAGE (Right side)
        <div className="flex justify-end items-end gap-2">
          <div className="flex flex-col items-end">
            <div className="bg-purple-700 text-white px-4 py-2 rounded-lg rounded-br-none max-w-[75%] break-words">
              <Markdown>{message.content}</Markdown>
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          <img src={assets.user_icon} alt="User" className="w-8 h-8 rounded-full" />
        </div>
      ) : (
        // AI MESSAGE (Left side)
        <div className="flex justify-start items-end gap-2">
          <img src={assets.logo} alt="ai" className="w-8 h-8 rounded-full" />
          <div className="flex flex-col items-start">
            <div className="bg-[#2A1A3B] text-white px-4 py-2 rounded-lg rounded-bl-none max-w-[75%] break-words">
              {message.isImage ? (
                <img
                  src={message.content}
                  alt="AI response"
                  className="w-full max-w-md rounded-md"
                />
              ) : (
                <Markdown>{message.content}</Markdown>
              )}
            </div>
            <span className="text-xs text-gray-400 mt-1">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
