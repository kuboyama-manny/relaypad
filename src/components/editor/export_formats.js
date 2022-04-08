import displayName from "../utils/display_name";
import moment from "moment";

export const downloadHTML = (activeNote, teamSlug) => {
  let displayDate =
    activeNote.status === "PUBLISHED"
      ? moment(activeNote.published_at).format("LL")
      : moment(activeNote.updated_at).format("LL");
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/html;charset=utf-8, <!doctype html><html><head><meta charset='utf-8'>" +
      "<title>" +
      activeNote.title +
      "</title><style type='text/css'>body {font: 1em sans-serif;} h1 {font-size: 1.5em;} h2 {font-size: 1.25em;} img {max-width: 100%; display: block; margin: 0 1em auto;}</style></head><body>" +
      "<p style='font-size: 0.8em;'>" +
      displayName(activeNote.member) +
      "<br />" +
      displayDate +
      "<br /><a href='https://beta.relaypad.com/" +
      teamSlug +
      "/notes/@" +
      activeNote.member.username +
      "/" +
      activeNote.slug +
      "''>https://beta.relaypad.com/" +
      teamSlug +
      "/notes/@" +
      activeNote.member.username +
      "/" +
      activeNote.slug +
      "</a></p>" +
      "<h1 style='font-size:2em;'>" +
      activeNote.title +
      "</h1>" +
      activeNote.content
  );
  element.setAttribute("download", activeNote.slug + ".html");

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};
