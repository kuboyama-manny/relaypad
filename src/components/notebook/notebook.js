import React, { Component } from "react";
import PropTypes from "prop-types";
import NotebookListContainer from "../../containers/notebook_list_container";
import NotebookNav from "./notebook_nav";
import NoteContainer from "../../containers/note_container";
import ProfileModalContainer from "../../containers/profile_modal_container";

class Notebook extends Component {
  render() {
    const {
      changeNotebook,
      changeProfileModalUser,
      currentMember,
      loadNewNoteEditor,
      notebookContent,
      notebookStatus,
      notebookTags,
      notes,
      setTagFilter,
      teamTags,
      toggleSidebar
    } = this.props;
    return (
      <div id="notebookContainer" className="container-fluid">
        <div className="row">
          <NotebookNav
            activeNotebookSection={notebookStatus.activeNotebookSection}
            activeTagFilter={notebookContent.tagFilter}
            changeNotebook={changeNotebook}
            changeProfileModalUser={changeProfileModalUser}
            currentMember={currentMember}
            hideSidebar={notebookStatus.hideSidebar}
            loadNewNoteEditor={loadNewNoteEditor}
            mobileView={notebookStatus.mobileView}
            notebookContent={notebookContent}
            notebookTags={notebookTags}
            setTagFilter={setTagFilter}
            toggleSidebar={toggleSidebar}
          />
          <NotebookListContainer
            activeNoteSlug={notebookStatus.activeNoteSlug}
            activeTagFilter={
              notebookContent.tagFilter
                ? teamTags[
                    teamTags.findIndex(
                      tag => tag.slug === notebookContent.tagFilter
                    )
                  ]
                : null
            }
            activeTeamSlug={currentMember.team.slug}
            changeNotebook={changeNotebook}
            currentMember={currentMember}
            hideSidebar={notebookStatus.hideSidebar}
            notes={notes}
            setTagFilter={setTagFilter}
          />
          <NoteContainer
            changeProfileModalUser={changeProfileModalUser}
            currentMember={currentMember}
            notebookContent={notebookContent}
            notebookStatus={notebookStatus}
            setTagFilter={setTagFilter}
            teamTags={teamTags}
          />
        </div>
        <ProfileModalContainer
          changeProfileModalUser={changeProfileModalUser}
        />
      </div>
    );
  }
}

Notebook.propTypes = {
  changeNotebook: PropTypes.func.isRequired,
  changeProfileModalUser: PropTypes.func.isRequired,
  currentMember: PropTypes.object.isRequired,
  loadNewNoteEditor: PropTypes.func.isRequired,
  notebookContent: PropTypes.object.isRequired,
  notebookStatus: PropTypes.object.isRequired,
  notebookTags: PropTypes.array.isRequired,
  notes: PropTypes.array,
  setTagFilter: PropTypes.func.isRequired,
  teamTags: PropTypes.array.isRequired,
  toggleSidebar: PropTypes.func.isRequired
};

Notebook.defaultProps = {
  notes: []
};

export default Notebook;
