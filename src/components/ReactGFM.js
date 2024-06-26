import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownComponent = ({ content }) => {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
};

export default MarkdownComponent;
