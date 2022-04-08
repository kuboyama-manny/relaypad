import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  buildStarredNotebook,
  changeMobileView,
  changeNote,
  changeNotebook,
  changeProfileModalUser,
  initializeNotebook,
  loadMemberPrivateNotes,
  loadNewNoteEditor,
  loadTeamPublishedNotes,
  setTagFilter,
  toggleSidebar,
  unloadNotebook
} from "../actions/notebook_actions";
import { getNotes } from "../reducers/notebook_reducer";
import { loadTeamTags } from "../actions/common_actions";
import {
  getCurrentMember,
  getNotebookTags,
  getTeamTags
} from "../reducers/common_reducer";
import Notebook from "../components/notebook/notebook";
import buildNoteURL from "../components/utils/build_note_url";
import isMobile from "../components/utils/mobile_check";
import orderBy from "lodash/orderBy";
import createHistory from "history/createBrowserHistory";

const history = createHistory();
class NotebookContainer extends Component {
  constructor(props) {
    super(props);
    this.activeNotebookNotes = [];
    this.getNotebookDefaultNote = this.getNotebookDefaultNote.bind(this);
    this.getNotebookDefaultNoteSlug = this.getNotebookDefaultNoteSlug.bind(
      this
    );
  }

  componentWillMount() {
    if (this.props.match.params.username && this.props.currentMember) {
      this.props.match.params.username === this.props.currentMember.username
        ? this.props.initializeNotebook("member")
        : this.props.initializeNotebook("team");
    } else if (this.props.match.params.notebook_section) {
      this.props.initializeNotebook(
        this.props.match.params.notebook_section === "new"
          ? "member"
          : this.props.match.params.notebook_section
      );
    } else {
      // No notebook/note defined
      this.props.initializeNotebook("member");
    }
    this.props.loadMemberPrivateNotes(0);
    this.props.loadTeamPublishedNotes(0);
    this.props.loadTeamTags();
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.notebookStatus.isMemberNotebookLoading &&
      !nextProps.notebookStatus.isMemberNotebookLoading &&
      nextProps.notebookContent.memberNotes.length <
        nextProps.notebookStatus.memberNotebookSize
    ) {
      // Member Notebook needs to continue loading
      this.props.loadMemberPrivateNotes(
        nextProps.notebookContent.memberNotes.length
      );
    }
    if (
      this.props.notebookStatus.isTeamNotebookLoading &&
      !nextProps.notebookStatus.isTeamNotebookLoading &&
      nextProps.notebookContent.teamNotes.length <
        nextProps.notebookStatus.teamNotebookSize
    ) {
      // Team Notebook needs to continue loading
      this.props.loadTeamPublishedNotes(
        nextProps.notebookContent.teamNotes.length
      );
    }

    if (
      !nextProps.notebookStatus.isNotebookBuilt &&
      nextProps.notebookContent.teamNotes.length ===
        nextProps.notebookStatus.teamNotebookSize &&
      nextProps.notebookContent.memberNotes.length ===
        nextProps.notebookStatus.memberNotebookSize
    ) {
      // Starred notebook needs to be built
      this.props.buildStarredNotebook(
        nextProps.notes
          .filter(note => note.bookmarked === true)
          .map(note => note.slug)
      );
    }

    if (
      this.props.notebookStatus.activeNotebookSection !==
        nextProps.notebookStatus.activeNotebookSection ||
      this.props.notes !== nextProps.notes
    ) {
      // Build active notebook
      this.activeNotebookNotes = nextProps.notes.filter(note =>
        nextProps.notebookContent[
          `${nextProps.notebookStatus.activeNotebookSection}Notes`
        ].includes(note.slug)
      );
    }

    if (
      nextProps.notebookStatus.persistenceAlert !== "New note" &&
      this.props.notebookStatus.activeNotebookSection ===
        nextProps.notebookStatus.activeNotebookSection &&
      this.props.notebookStatus.activeNoteSlug &&
      !nextProps.notebookStatus.activeNoteSlug &&
      nextProps.notebookStatus.mobileView === "content"
    ) {
      // You've done something to remove the current note from your active notebook
      history.push(
        this.getNotebookDefaultNote(
          nextProps.notes,
          nextProps.notebookContent,
          nextProps.notebookStatus.activeNotebookSection
        )
      );
      this.props.changeNote(
        this.getNotebookDefaultNoteSlug(
          nextProps.notebookContent,
          nextProps.notebookStatus.activeNotebookSection
        )
      );
    } else if (
      (this.props.match.params.note_slug !== nextProps.match.params.note_slug ||
        !nextProps.notebookStatus.isNoteLoaded) &&
      nextProps.match.params.note_slug &&
      nextProps.notes.filter(
        note => note.slug === nextProps.match.params.note_slug
      ).length // load note if it's in already in the notes array
    ) {
      // Active note needs to change
      this.props.changeNote(nextProps.match.params.note_slug);
    }

    if (
      nextProps.notebookStatus.isNotebookBuilt &&
      nextProps.match.params.notebook_section === "new" &&
      !nextProps.notebookStatus.isNoteLoaded
    ) {
      // User navigated to /new
      this.props.loadNewNoteEditor();
    }

    if (
      isMobile() &&
      !nextProps.match.params.note_slug &&
      !nextProps.notebookStatus.mobileView &&
      nextProps.notebookStatus.isNotebookBuilt
    ) {
      // No active note set on mobile - default to list view
      this.props.changeMobileView(
        "list",
        nextProps.notebookStatus.activeNotebookSection
          ? nextProps.notebookStatus.activeNotebookSection
          : "member"
      );
    } else if (
      !isMobile() &&
      !nextProps.match.params.note_slug &&
      nextProps.notebookStatus.isNotebookBuilt &&
      nextProps.notebookStatus.activeNotebookSection &&
      nextProps.match.params.notebook_section !== "new" &&
      !nextProps.notebookStatus.isNoteLoaded &&
      nextProps.notebookContent[
        `${nextProps.notebookStatus.activeNotebookSection}Notes`
      ].length > 0
    ) {
      // No active note set on desktop - replace the old URL (e.g. "/notes/starred/") with a note's URL without adding an extra history entry
      history.replace(
        this.getNotebookDefaultNote(
          nextProps.notes,
          nextProps.notebookContent,
          nextProps.notebookStatus.activeNotebookSection
        )
      );
      this.props.changeNote(
        this.getNotebookDefaultNoteSlug(
          nextProps.notebookContent,
          nextProps.notebookStatus.activeNotebookSection
        )
      );
    }
    if (
      isMobile() &&
      nextProps.notebookStatus.activeNoteSlug !== "" &&
      this.props.notebookStatus.mobileView === "content" &&
      nextProps.notebookStatus.mobileView === "list"
    ) {
      // Update URL if user goes from content view to list view in mobile
      history.replace(
        buildNoteURL(
          this.props.currentMember.team.slug,
          this.props.currentMember.username,
          nextProps.notebookStatus.activeNoteSlug
        )
      );
    }

    // Updates based on editor actions
    switch (nextProps.notebookStatus.persistenceAlert) {
      case "New note saved":
        if (
          this.props.notebookStatus.activeNoteSlug !==
          nextProps.notebookStatus.activeNoteSlug
        ) {
          // update URL for a new note
          history.replace(
            buildNoteURL(
              this.props.currentMember.team.slug,
              this.props.currentMember.username,
              nextProps.notebookStatus.activeNoteSlug
            )
          );
        }
        break;
      case "Note published":
        // this.props.changeNote(decodeURIComponent(this.props.match.params.note_slug));
        break;
      default:
        break;
    }
  }

  componentWillUnmount() {
    this.props.unloadNotebook();
  }

  getNotebookDefaultNote(notes, notebookContent, activeNotebookSection) {
    return notebookContent[`${activeNotebookSection}Notes`].length > 0
      ? notes.filter(
          note =>
            note.slug === notebookContent[`${activeNotebookSection}Notes`][0]
        )[0].detail_uri
      : null;
  }

  getNotebookDefaultNoteSlug(notebookContent, activeNotebookSection) {
    return notebookContent[`${activeNotebookSection}Notes`][0];
  }

  render() {
    return (
      <Notebook
        changeNotebook={this.props.changeNotebook}
        changeProfileModalUser={this.props.changeProfileModalUser}
        currentMember={this.props.currentMember}
        loadNewNoteEditor={this.props.loadNewNoteEditor}
        notebookContent={this.props.notebookContent}
        notebookStatus={this.props.notebookStatus}
        notebookTags={this.props.notebookTags}
        notes={this.activeNotebookNotes}
        setTagFilter={this.props.setTagFilter}
        teamTags={this.props.teamTags}
        toggleSidebar={this.props.toggleSidebar}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changeMobileView: (view, notebook) =>
    dispatch(changeMobileView(view, notebook)),
  changeNote: newNoteSlug => dispatch(changeNote(newNoteSlug)),
  changeNotebook: newNotebook => dispatch(changeNotebook(newNotebook)),
  changeProfileModalUser: username =>
    dispatch(changeProfileModalUser(username)),
  buildStarredNotebook: notes => dispatch(buildStarredNotebook(notes)),
  initializeNotebook: activeNotebookSection =>
    dispatch(initializeNotebook(activeNotebookSection)),
  loadMemberPrivateNotes: offset => dispatch(loadMemberPrivateNotes(offset)),
  loadNewNoteEditor: () => dispatch(loadNewNoteEditor()),
  loadTeamPublishedNotes: offset => dispatch(loadTeamPublishedNotes(offset)),
  loadTeamTags: () => dispatch(loadTeamTags()),
  setTagFilter: tag_slug => dispatch(setTagFilter(tag_slug)),
  toggleSidebar: () => dispatch(toggleSidebar()),
  unloadNotebook: () => dispatch(unloadNotebook())
});

const mapStateToProps = state => ({
  currentMember: getCurrentMember(state),
  notebookContent: state.notebook.content,
  notebookStatus: state.notebook.status,
  notebookTags: getNotebookTags(state),
  notes: orderBy(
    getNotes(state),
    state.notebook.status.activeNotebookSection === "team"
      ? "published_at"
      : "updated_at",
    "desc"
  ),
  teamTags: getTeamTags(state)
});

NotebookContainer.propTypes = {
  buildStarredNotebook: PropTypes.func.isRequired,
  changeMobileView: PropTypes.func.isRequired,
  changeNote: PropTypes.func.isRequired,
  changeNotebook: PropTypes.func.isRequired,
  changeProfileModalUser: PropTypes.func.isRequired,
  currentMember: PropTypes.object.isRequired,
  initializeNotebook: PropTypes.func.isRequired,
  loadMemberPrivateNotes: PropTypes.func.isRequired,
  loadNewNoteEditor: PropTypes.func.isRequired,
  loadTeamPublishedNotes: PropTypes.func.isRequired,
  loadTeamTags: PropTypes.func.isRequired,
  notebookContent: PropTypes.object.isRequired,
  notebookStatus: PropTypes.object.isRequired,
  notes: PropTypes.array.isRequired,
  setTagFilter: PropTypes.func.isRequired,
  teamTags: PropTypes.array.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  unloadNotebook: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotebookContainer);
