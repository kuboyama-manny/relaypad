import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  changeMobileView,
  changeSearchQuery,
  removeSearchQuery
} from "../actions/notebook_actions";
import { toggleBookmark } from "../actions/common_actions";
import { getFilteredNotes } from "../reducers/notebook_reducer";
import NotebookList from "../components/notebook/notebook_list";

class NotebookListContainer extends Component {
  render() {
    const {
      activeNoteSlug,
      activeNotebookSection,
      activeTagFilter,
      activeTeamSlug,
      changeMobileView,
      changeNotebook,
      changeSearchQuery,
      currentMember,
      filteredNotes,
      hideSidebar,
      isNotebookBuilt,
      mobileView,
      notes,
      removeSearchQuery,
      searchQuery,
      setTagFilter,
      toggleBookmark
    } = this.props;
    return (
      <NotebookList
        activeNoteSlug={activeNoteSlug}
        activeNotebookSection={activeNotebookSection}
        activeTagFilter={activeTagFilter}
        activeTeamSlug={activeTeamSlug}
        changeMobileView={changeMobileView}
        changeNotebook={changeNotebook}
        changeSearchQuery={changeSearchQuery}
        currentMember={currentMember}
        filteredNotes={filteredNotes}
        hideSidebar={hideSidebar}
        isNotebookBuilt={isNotebookBuilt}
        mobileView={mobileView}
        notes={notes}
        removeSearchQuery={removeSearchQuery}
        searchQuery={searchQuery}
        setTagFilter={setTagFilter}
        toggleBookmark={toggleBookmark}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  changeMobileView: view => dispatch(changeMobileView(view)),
  changeSearchQuery: query => dispatch(changeSearchQuery(query)),
  removeSearchQuery: () => dispatch(removeSearchQuery()),
  toggleBookmark: activeNote => dispatch(toggleBookmark(activeNote))
});

const mapStateToProps = state => ({
  activeNotebookSection: state.notebook.status.activeNotebookSection,
  filteredNotes: getFilteredNotes(state),
  isNotebookBuilt: state.notebook.status.isNotebookBuilt,
  mobileView: state.notebook.status.mobileView,
  searchQuery: state.notebook.content.searchQuery
});

NotebookListContainer.propTypes = {
  activeNotebookSection: PropTypes.string.isRequired,
  activeNoteSlug: PropTypes.string,
  activeTagFilter: PropTypes.object,
  activeTeamSlug: PropTypes.string.isRequired,
  changeMobileView: PropTypes.func.isRequired,
  changeNotebook: PropTypes.func.isRequired,
  changeSearchQuery: PropTypes.func.isRequired,
  currentMember: PropTypes.object.isRequired,
  filteredNotes: PropTypes.array,
  hideSidebar: PropTypes.bool.isRequired,
  isNotebookBuilt: PropTypes.bool.isRequired,
  mobileView: PropTypes.string,
  notes: PropTypes.array,
  removeSearchQuery: PropTypes.func.isRequired,
  setTagFilter: PropTypes.func.isRequired,
  toggleBookmark: PropTypes.func.isRequired
};

NotebookListContainer.defaultProps = {
  activeNoteSlug: "",
  activeTagFilter: {},
  filteredNotes: [],
  mobileView: "",
  notes: []
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotebookListContainer);
