import moment from "moment";

// TODO: localize this

const relativeDate = (dateTime, displayStyle = "capitalize") => {
  let currTime = moment();
  let noteTime = moment(dateTime);
  if (noteTime.isSameOrAfter(currTime.subtract(10, "minutes"), "minute")) {
    return displayStyle === "lowercase" ? "just now" : "Just now";
  } else if (noteTime.isSameOrAfter(currTime, "day")) {
    return noteTime.format("LT");
  } else if (noteTime.isSameOrAfter(currTime.subtract(1, "day"), "day")) {
    return displayStyle === "lowercase" ? "yesterday" : "Yesterday";
  } else if (noteTime.isSameOrAfter(currTime.subtract(1, "week"), "day")) {
    return noteTime.format("dddd");
  } else if (noteTime.isSameOrAfter(currTime, "year")) {
    return noteTime.format("MMMM D");
  } else {
    return noteTime.format("ll");
  }
};

export default relativeDate;
