import { CustomElementType } from "@dev0000007/medium-web";

export const ExtractSmart = (node: CustomElementType) => {
  let preview = "";

  function extractor(node: CustomElementType) {
    if (node.text && node.type !== "h1" && node.type !== "h2") {
      preview += node.text;
    }
    if (node.children) {
      node.children.forEach(extractor);
    }
  }
  node.forEach(extractor);

  preview =
    preview.length === 0
      ? "[no preview exist of this blog]"
      : preview.length > 200
      ? preview.slice(0, 300) + "..."
      : preview;
  return { preview };
};
