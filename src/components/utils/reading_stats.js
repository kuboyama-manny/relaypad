import moment from "moment";
import Pluralize from "pluralize";

const readingStats = (title = "", content = "") => {
  let combinedText = [title, content].filter(val => val).join(" ");
  let charCount = combinedText.length;
  let wordCount =
    combinedText.length === 0
      ? 0
      : combinedText
          .replace(/(^\s*)|(\s*$)/gi, "")
          .replace(/[ ]{2,}/gi, " ")
          .replace(/\n /, "\n")
          .split(" ").length;
  let paragraphCount =
    content.length === 0 ? 0 : content.replace(/\n$/gm, "").split(/\n/).length;
  // NOTE: read time based on Medium model: https://blog.medium.com/read-time-and-you-bc2048ab620c
  let readingTime = moment
    .duration(Math.ceil(wordCount / 275), "minutes")
    .minutes();
  return (
    charCount.toLocaleString() +
    " " +
    Pluralize("Character", charCount) +
    "<br/>" +
    wordCount.toLocaleString() +
    " " +
    Pluralize("Word", wordCount) +
    "<br/>" +
    paragraphCount.toLocaleString() +
    " " +
    Pluralize("Paragraph", paragraphCount) +
    "<br/>" +
    readingTime +
    " Minute reading time"
  );
};

export default readingStats;
