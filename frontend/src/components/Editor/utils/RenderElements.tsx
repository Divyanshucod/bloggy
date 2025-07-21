import type { RenderElementProps } from "slate-react";
import { ImageResizable } from "../../ImageResizable";
import { VideoPlayer } from "../../VideoPlayer";

export const RenderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const style = { textAlign: element.align };

  switch (element.type) {
    case "link":
      return (
        <a
          {...attributes}
          href={element.url}
          className="underline text-blue-600 dark:text-blue-400 cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (e.metaKey) {
              window.open(element.url, "_blank");
            }
          }}
        >
          {children}
        </a>
      );

    case "block-quote":
      return (
        <blockquote
          {...attributes}
          style={style}
          className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400"
        >
          {children}
        </blockquote>
      );

    case "numbered-list":
      return (
        <ol {...attributes} style={style} className="list-decimal list-inside">
          {children}
        </ol>
      );

    case "bulleted-list":
      return (
        <ul {...attributes} style={style} className="list-disc list-inside">
          {children}
        </ul>
      );

    case "list-item":
      return (
        <li {...attributes} style={style}>
          {children}
        </li>
      );

    case "h1":
      return (
        <h1
          {...attributes}
          style={style}
          className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100"
        >
          {children}
        </h1>
      );

    case "h2":
      return (
        <h2
          {...attributes}
          style={style}
          className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100"
        >
          {children}
        </h2>
      );

    case "h3":
      return (
        <h3
          {...attributes}
          style={style}
          className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100"
        >
          {children}
        </h3>
      );

    case "h4":
      return (
        <h4
          {...attributes}
          style={style}
          className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100"
        >
          {children}
        </h4>
      );

    case "h5":
      return (
        <h5
          {...attributes}
          style={style}
          className="text-md font-semibold mb-2 text-gray-900 dark:text-gray-100"
        >
          {children}
        </h5>
      );

    case "h6":
      return (
        <h6
          {...attributes}
          style={style}
          className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100"
        >
          {children}
        </h6>
      );

    case "Image":
      return (
        <ImageResizable children={children} element={element} attributes={attributes} />
      );
    case 'Video':
      return  (
          <VideoPlayer children={children} element={element} attributes={attributes} />
      )
    default:
      return (
        <p
          {...attributes}
          style={style}
          className="text-gray-800 dark:text-gray-200"
        >
          {children}
        </p>
      );
  }
};
