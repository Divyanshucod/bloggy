import type { RenderElementProps } from "slate-react";

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
          className="underline text-blue-600 cursor-pointer"
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
          style={{ ...style }}
          className="border-l-4 border-gray-300 pl-4 italic text-gray-600"
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
        <h1 {...attributes} style={style} className="text-4xl font-bold mb-2">
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 {...attributes} style={style} className="text-3xl font-bold mb-2">
          {children}
        </h2>
      );
    case "h3":
      return (
        <h3 {...attributes} style={style} className="text-2xl font-bold mb-2">
          {children}
        </h3>
      );
    case "h4":
      return (
        <h4 {...attributes} style={style} className="text-xl font-bold mb-2">
          {children}
        </h4>
      );
    case "h5":
      return (
        <h5
          {...attributes}
          style={style}
          className="text-md font-semibold mb-2"
        >
          {children}
        </h5>
      );
    case "h6":
      return (
        <h6
          {...attributes}
          style={style}
          className="text-sm font-semibold mb-2"
        >
          {children}
        </h6>
      );
    case "image":
      return (
        <div
          style={{
            display: "flex",
            justifyContent: element.align,
            width: "100%",
          }}
        >
          <img
            src={element.url}
            alt="uploaded"
            className="h-[300px] w-[300px] rounded"
            {...attributes}
            style={{ textAlign: element.align }}
          />
        </div>
      );
    default:
      return (
        <p {...attributes} style={style}>
          {children}
        </p>
      );
  }
};
