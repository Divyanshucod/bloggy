import { Tooltip } from '@mui/material'
import {SmilePlus} from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
export const Emojis = ()=>{
    const [displayEmojiPicker,setDisplayEmojiPicker] = useState(false)
    const theme = useSelector((state:RootState) => state.ThemeSlice);
    return <div className='relative'>
        <button onClick={() => setDisplayEmojiPicker((prev) => !prev)}>
        <Tooltip title='Emoji'><SmilePlus size={23}/></Tooltip>
        </button>
        {displayEmojiPicker ?  <div className='absolute  right-0 h-full w-full'>
        <EmojiPicker width={400} height={300} theme={theme}/>
        </div> : null}
    </div>
}