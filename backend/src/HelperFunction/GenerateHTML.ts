import { CustomElementType, TexFormattingtType } from "@dev0000007/medium-web";
import { formattedDate } from "./DateFormatter";

  export const GenerateHTML = (inJson: CustomElementType[],date:string): string => {
    const escapeHtml = (text: string) =>
      text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
  
    const renderLeaf = (leaf: TexFormattingtType): string => {
      let result = escapeHtml(leaf.text);
  
      if (leaf.bold) result = `<strong>${result}</strong>`;
      if (leaf.italic) result = `<em>${result}</em>`;
      if (leaf.underline) result = `<u>${result}</u>`;
      if (leaf.strikethrough) result = `<s>${result}</s>`;
      if (leaf.code) result = `<code>${result}</code>`;
      if (leaf.superscript) result = `<sup>${result}</sup>`;
      if (leaf.subscript) result = `<sub>${result}</sub>`;
      if (leaf.highlight) result = `<mark>${result}</mark>`;
  
      return result;
    };
  
    const renderChildren = (children: any[]): string => {
      return children
        .map((child) => {
          if ("text" in child) {
            return renderLeaf(child);
          } else if (child.type === "link") {
            const linkText = renderChildren(child.children);
            return `<a id="link" href="${child.url}" target="_blank">${linkText}</a>`;
          } else {
            // fallback
            return renderElement(child);
          }
        })
        .join("");
    };
  
    const renderElement = (element: CustomElementType): string => {
      const alignStyle = element.align ? `class="text-${element.align}"` : "";
  
      switch (element.type) {
        case "h1":
          return `<h1 id="headingOne" ${alignStyle}>${renderChildren(element.children)}</h1>`;
        case "h2":
          return `<h2 id="headingTwo" ${alignStyle}>${renderChildren(element.children)}</h2>`;
        case "h3":
          return `<h3 id="headingThree" ${alignStyle}>${renderChildren(element.children)}</h3>`;
        case "h4":
          return `<h4 id="headingFour" ${alignStyle}>${renderChildren(element.children)}</h4>`;
        case "h5":
          return `<h5 id="headingFive" ${alignStyle}>${renderChildren(element.children)}</h5>`;
        case "h6":
          return `<h6 id="headingSix" ${alignStyle}>${renderChildren(element.children)}</h6>`;
        case "paragraph":
          return `<p id="paragraph" ${alignStyle}>${renderChildren(element.children)}</p>`;
        case "block-quote":
          return `<blockquote id="blockQuote" ${alignStyle}>${renderChildren(element.children)}</blockquote>`;
        case "numbered-list":
          return `<ol id="orderedList" ${alignStyle}>${renderChildren(element.children)}</ol>`;
        case "bulleted-list":
          return `<ul id="unorderedList" ${alignStyle}>${renderChildren(element.children)}</ul>`;
        case "list-item":
          return `<li id="listItem" ${alignStyle}>${renderChildren(element.children)}</li>`;
        case "link":
          return `<a id="link" href="${element.url}" target="_blank">${renderChildren(element.children)}</a>`;
        case "code-block":
          return `<div id="codeBlock"><code>${renderChildren(element.children)}</code></div>`;
        case "image":
          return `<img id="image" href="${element.url}" target="_blank"/>`;
        default:
          return `<div${alignStyle}>${renderChildren(element.children)}</div>`;
      }
    };
  
    const html = inJson.map(renderElement).join("\n");
    const formatedDate = formattedDate(date)
    return `<div class="blog-container"><p id="pulishedDate">${formatedDate}</p>${html}</div>`;
  };
  