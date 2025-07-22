import React, { useState, useRef, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Smile, 
  Heart, 
  Lightbulb,
  Meh
} from 'lucide-react';

const EmojiReactionToggler = () => {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false);
  const [likeDislikeReaction, setLikeDislikeReaction] = useState('none'); // 'none', 'like', 'dislike'
  const [emojiReaction, setEmojiReaction] = useState('none'); // 'none', 'smile', 'heart', 'idea', 'meh'
  
  const mainMenuRef = useRef(null);
  const emojiMenuRef = useRef(null);
  const togglerRef = useRef(null);

  const emojis = [
    { id: 'smile', icon: Smile, label: 'Smile' },
    { id: 'heart', icon: Heart, label: 'Heart' },
    { id: 'idea', icon: Lightbulb, label: 'Idea' },
    { id: 'meh', icon: Meh, label: 'Meh' }
  ];

  const getEmojiIcon = () => {
    if (emojiReaction !== 'none') {
      return getEmojiReactionIcon();
    }
    return (
      <div className="w-6 h-6 rounded-full border-2 border-gray-400 dark:border-gray-500 bg-transparent relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Smile className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    );
  };
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mainMenuRef.current && !mainMenuRef.current.contains(event.target) &&
          togglerRef.current && !togglerRef.current.contains(event.target)) {
        setIsMainMenuOpen(false);
      }
      if (emojiMenuRef.current && !emojiMenuRef.current.contains(event.target)) {
        setIsEmojiMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

  return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTogglerClick = () => {
    setIsMainMenuOpen(!isMainMenuOpen);
    setIsEmojiMenuOpen(false);
  };

  const handleLikeClick = () => {
    setLikeDislikeReaction(likeDislikeReaction === 'like' ? 'none' : 'like');
    setIsMainMenuOpen(false);
  };

  const handleDislikeClick = () => {
    setLikeDislikeReaction(likeDislikeReaction === 'dislike' ? 'none' : 'dislike');
    setIsMainMenuOpen(false);
  };

  const handleEmojiIconClick = () => {
    setIsEmojiMenuOpen(!isEmojiMenuOpen);
    setIsMainMenuOpen(false);
  };

  const handleEmojiSelect = (emojiId) => {
    setEmojiReaction(emojiReaction === emojiId ? 'none' : emojiId);
    setIsEmojiMenuOpen(false);
  };

  const getCurrentIcon = () => {
    const hasLikeDislike = likeDislikeReaction !== 'none';
    const hasEmoji = emojiReaction !== 'none';
    
    // If both are selected, show them stacked
    if (hasLikeDislike && hasEmoji) {
      return (
        <div className="flex flex-col items-center justify-center space-y-0.5">
          {getLikeDislikeIcon()}
          {getEmojiReactionIcon()}
        </div>
      );
    }
    
    // If only like/dislike is selected
    if (hasLikeDislike) {
      return getLikeDislikeIcon();
    }
    
    // If only emoji is selected
    if (hasEmoji) {
      return getEmojiReactionIcon();
    }
    
    // Default no reaction icon
    return (
      <div className="w-6 h-6 rounded-full border-2 border-gray-400 dark:border-gray-500 bg-transparent relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
        </div>
      </div>
    );
  };

  const getLikeDislikeIcon = () => {
    switch (likeDislikeReaction) {
      case 'like':
        return <ThumbsUp className="w-4 h-4 text-blue-500" fill="currentColor" />;
      case 'dislike':
        return <ThumbsDown className="w-4 h-4 text-red-500" fill="currentColor" />;
      default:
        return null;
    }
  };

  const getEmojiReactionIcon = () => {
    switch (emojiReaction) {
      case 'smile':
        return <Smile className="w-4 h-4 text-yellow-500" fill="currentColor" />;
      case 'heart':
        return <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />;
      case 'idea':
        return <Lightbulb className="w-4 h-4 text-amber-500" fill="currentColor" />;
      case 'meh':
        return <Meh className="w-4 h-4 text-gray-500" fill="currentColor" />;
      default:
        return null;
    }
  };

  const getEmojiButtonStyle = (emojiId) => {
    switch (emojiId) {
      case 'smile':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500';
      case 'heart':
        return 'bg-pink-100 dark:bg-pink-900/30 text-pink-500';
      case 'idea':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-500';
      case 'meh':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-500';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getEmojiIconStyle = (emojiId, isSelected) => {
    if (!isSelected) return '';
    
    switch (emojiId) {
      case 'smile':
        return 'text-yellow-500';
      case 'heart':
        return 'text-pink-500';
      case 'idea':
        return 'text-amber-500';
      case 'meh':
        return 'text-gray-500';
      default:
        return '';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="relative">
          {/* Main Toggler Button */}
          <button
            ref={togglerRef}
            onClick={handleTogglerClick}
            className={`
              w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
              flex items-center justify-center border-2 transform hover:scale-105 active:scale-95
              ${(likeDislikeReaction !== 'none' || emojiReaction !== 'none')
                ? 'bg-[url(smile-plus.png)]' 
                : 'bg-[url(smile-plus.png)]'
              }
              ${isMainMenuOpen ? 'ring-2 ring-blue-300 dark:ring-blue-600' : ''}
            `}
          >
            {getCurrentIcon()}
          </button>

          {/* Main Menu (appears above) */}
          <div
            ref={mainMenuRef}
            className={`
              absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
              bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700
              transition-all duration-300 origin-bottom
              ${isMainMenuOpen 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
              }
            `}
          >
            <div className="flex flex-col p-2 space-y-1">
              {/* Like Button */}
              <button
                onClick={handleLikeClick}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
                  ${likeDislikeReaction === 'like' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }
                `}
              >
                <ThumbsUp className="w-5 h-5" fill={likeDislikeReaction === 'like' ? 'currentColor' : 'none'} />
              </button>

              {/* Dislike Button */}
              <button
                onClick={handleDislikeClick}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
                  ${likeDislikeReaction === 'dislike' 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }
                `}
              >
                <ThumbsDown className="w-5 h-5" fill={likeDislikeReaction === 'dislike' ? 'currentColor' : 'none'} />
              </button>

              {/* Emoji Button */}
              <button
                onClick={handleEmojiIconClick}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200
                  ${emojiReaction !== 'none'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {getEmojiIcon()}
              </button>
            </div>
          </div>

          {/* Emoji Menu (appears to the left) */}
          <div
            ref={emojiMenuRef}
            className={`
              absolute top-0 right-full mr-2 
              bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700
              transition-all duration-300 origin-right
              ${isEmojiMenuOpen 
                ? 'opacity-100 scale-100 translate-x-0' 
                : 'opacity-0 scale-95 translate-x-2 pointer-events-none'
              }
            `}
          >
            <div className="flex p-2 space-x-1">
              {emojis.map((emoji) => {
                const IconComponent = emoji.icon;
                const isSelected = emojiReaction === emoji.id;
                
                return (
                  <button
                    key={emoji.id}
                    onClick={() => handleEmojiSelect(emoji.id)}
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95
                      ${isSelected 
                        ? getEmojiButtonStyle(emoji.id)
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }
                    `}
                  >
                    <IconComponent 
                      className={`w-5 h-5 ${getEmojiIconStyle(emoji.id, isSelected)}`}
                      fill={isSelected ? 'currentColor' : 'none'} 
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmojiReactionToggler;