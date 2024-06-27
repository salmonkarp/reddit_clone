import React from "react";

const HtmlContentRenderer = ({ htmlString }) => {
  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const replaceLinksWithImages = (html) => {
    // Regular expression to match image URLs
    const imageLinkRegex =
      /<a href="(https:\/\/[^\s]+?\.(jpg|jpeg|png|gif|webp)[^\s]*)">[^<]*<\/a>/gi;
    return html.replace(imageLinkRegex, (match, url) => {
      return `<img src="${url}" alt="Image" style="max-width: 100%;" />`;
    });
  };

  const decodedHtmlString = decodeHtml(htmlString);
  const modifiedHtmlString = replaceLinksWithImages(decodedHtmlString);

  return <div dangerouslySetInnerHTML={{ __html: modifiedHtmlString }} />;
};

export default HtmlContentRenderer;
