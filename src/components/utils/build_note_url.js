const buildNoteURL = (teamSlug, notebookSection, noteSlug = null) => {
  if (
    notebookSection !== "starred" &&
    notebookSection !== "team" &&
    notebookSection !== "tags" &&
    notebookSection !== "new"
  ) {
    // make sure "@" is prepended to usernames
    notebookSection = `@${notebookSection}`;
  }
  return `/${teamSlug}/notes/${notebookSection}/${noteSlug ? noteSlug : ""}`;
};

export default buildNoteURL;
