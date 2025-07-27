import React from 'react';
import { ThumbsDown,ThumbsUp } from 'lucide-react';

interface LikeDislikeUIProps {
    reaction?: 'like' | 'dislike' | 'none';
}

const LikeDislikeUI: React.FC<LikeDislikeUIProps> = ({ reaction = 'none' }) => {
    const [likeDislike,setLikeDislike] = React.useState(reaction);
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ThumbsUp
                name="thumb"
                style={{
                    cursor: 'pointer',
                    color: likeDislike === 'like' ? 'blue' : 'gray',
                }}
                onClick={() => {
                    setLikeDislike(prev => prev === 'like' ? 'none' : 'like');
                }}
            />
            <ThumbsDown
                name="thumbDown"
                style={{
                    cursor: 'pointer',
                    color: likeDislike === 'dislike' ? 'red' : 'gray',
                }}
                onClick={() => {
                    setLikeDislike(prev => prev === 'dislike' ? 'none' : 'dislike');
                }}
            />
        </div>
    );
};

export default LikeDislikeUI;