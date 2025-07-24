import React, { useState, useRef, useEffect } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Smile,
  Heart,
  Lightbulb,
  Meh,
  SmilePlus,
} from 'lucide-react';

const emojis = [
  { id: 'smile', icon: Smile, color: 'yellow' },
  { id: 'heart', icon: Heart, color: 'pink' },
  { id: 'idea', icon: Lightbulb, color: 'amber' },
  { id: 'meh', icon: Meh, color: 'yellow' },
];

const EmojiReactionToggler = () => {
  const [mainOpen, setMainOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [reaction, setReaction] = useState({ type: 'none', emoji: 'none' });

  const refs = {
    mainMenu: useRef(null),
    emojiMenu: useRef(null),
    toggler: useRef(null),
  };

  const iconMap = {
    like: <ThumbsUp className="w-4 h-4 text-blue-500" fill="currentColor" />,
    dislike: <ThumbsDown className="w-4 h-4 text-red-500" fill="currentColor" />,
  };

  const getEmojiIcon = (id) => {
    const emoji = emojis.find((e) => e.id === id);
    if (!emoji) return null;
    return React.createElement(emoji.icon, {
      className: `w-4 h-4 text-${emoji.color}-500`,
      fill: 'currentColor',
    });
  };

  const getDisplayIcon = () => {
    const { type, emoji } = reaction;
    if (type !== 'none' && emoji !== 'none') {
      return (
        <div className="flex flex-col items-center justify-center space-y-0.5">
          {iconMap[type]}
          {getEmojiIcon(emoji)}
        </div>
      );
    }
    if (type !== 'none') return iconMap[type];
    if (emoji !== 'none') return getEmojiIcon(emoji);
    return (
       <SmilePlus className="w-5 h-5 text-gray-400 dark:text-gray-500" />
    );
  };

  useEffect(() => {
    const handler = (e) => {
      if (!refs.mainMenu.current?.contains(e.target) && !refs.toggler.current?.contains(e.target)) {
        setMainOpen(false);
      }
      if (!refs.emojiMenu.current?.contains(e.target)) {
        setEmojiOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <button
          ref={refs.toggler}
          onClick={() => {
            setMainOpen(!mainOpen);
            setEmojiOpen(false);
          }}
          className={`w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center dark:border-1 transform hover:scale-105 active:scale-95 ${mainOpen ? 'ring-2 ring-blue-300 dark:ring-blue-600' : ''}`}
        >
          {getDisplayIcon()}
        </button>

        {/* Main Menu */}
        <div
          ref={refs.mainMenu}
          className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border transition-all duration-300 origin-bottom ${mainOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
          <div className="flex flex-col p-2 space-y-1">
            {['like', 'dislike'].map((type) => {
              const isActive = reaction.type === type;
              const color = type === 'like' ? 'blue' : 'red';
              const Icon = type === 'like' ? ThumbsUp : ThumbsDown;
              return (
                <button
                  key={type}
                  onClick={() => setReaction({ ...reaction, type: isActive ? 'none' : type }) || setMainOpen(false)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${isActive ? `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400` : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                >
                  <Icon className="w-5 h-5" fill={isActive ? 'currentColor' : 'none'} />
                </button>
              );
            })}
            <button
              onClick={() => {
                setEmojiOpen(!emojiOpen);
                setMainOpen(false);
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${reaction.emoji !== 'none' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              {reaction.emoji !== 'none' ? getEmojiIcon(reaction.emoji) : <Smile className="w-5 h-5 text-gray-400 dark:text-gray-500" />}
            </button>
          </div>
        </div>

        {/* Emoji Menu */}
        <div
          ref={refs.emojiMenu}
          className={`absolute top-0 right-full mr-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border transition-all duration-300 origin-right ${emojiOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
          <div className="flex p-2 space-x-1">
            {emojis.map(({ id, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setReaction({ ...reaction, emoji: reaction.emoji === id ? 'none' : id }) || setEmojiOpen(false)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all transform hover:scale-105 active:scale-95 ${reaction.emoji === id ? `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-500` : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <Icon className="w-5 h-5" fill={reaction.emoji === id ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmojiReactionToggler;
