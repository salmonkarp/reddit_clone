import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const preprocessContent = (content) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return content.replace(urlRegex, (url) => {
    if (/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/.test(url)) {
      return `![Image](${url})`;
    }
    return `[${url}](${url})`;
  });
};

const MarkdownComponent = ({ content }) => {
  if (!content) {
    return "";
  }
  const preprocessedContent = preprocessContent(content);

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {preprocessedContent}
    </ReactMarkdown>
  );
};

export default MarkdownComponent;
