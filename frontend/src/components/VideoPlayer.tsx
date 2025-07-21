import React from "react";
import {type RenderElementProps } from "slate-react";
import ReactPlayer from 'react-player'

export const VideoPlayer = React.memo(({
  attributes,
  element
}: RenderElementProps) => {
  return (
    <div contentEditable={false}>
      <ReactPlayer
        src={element.url}
        className="w-full block select-none resize"
        {...  attributes}
      />
      
    </div>
  );
});
