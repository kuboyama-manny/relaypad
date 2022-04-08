import truncate from "lodash/truncate";

const textSnippet = (text, snippetLength = 900) => {
  let newString = text
    .replace(/(<\/h1>|<\/p>|<\/ul>|<\/li>)/gi, " ")
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/(\s|\n|\r|\r\n)/gm, " ");
  return truncate(newString, {
    length: snippetLength,
    separator: " "
  });
};

export default textSnippet;
