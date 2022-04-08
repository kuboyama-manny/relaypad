import React from "react";
import PropTypes from "prop-types";
import PostByline from "../post/post_byline";
import LoadingSpinner from "../utils/loading_spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import classnames from "classnames";
import relativeDate from "../utils/relativeDate";
import TitleField from "../editor/components/title_field";
import InlineToolbar from "../editor/components/inline_toolbar";
import SidebarToggle from "./sidebar_toggle";
import SideToolbar from "../editor/components/side_toolbar";
import MobileToolbar from "../editor/components/mobile_toolbar";
import NoteControls from "./note_controls";
import DeleteDialog from "../editor/components/delete_dialog";
import PublishConfirmation from "./publish_confirmation";
import Reactions from "../reactions";
import enhanceWithClickOutside from "react-click-outside";
import TagList from "../tag_list";
import CommentList from "../comments/list";
import EmptyNotebookMsg from "./empty_notebook_messaging";
import { insertImageBlock, removeImageBlock } from "../editor/media";
import {
  ContentState,
  convertFromHTML,
  Editor as DraftEditor,
  EditorState,
  Modifier,
  RichUtils
} from "draft-js";
import {
  getSelectedBlockElement,
  getSelectionRange,
  hasShiftModifier
} from "../editor/utils";
import cloneDeep from "lodash/cloneDeep";
import { convertToHTML } from "draft-convert";
import { MULTILINE_BLOCK_TYPES, PLACEHOLDER_TEXT } from "../editor/constants";
import blockRenderMap from "../editor/maps/block_render_map";
import customStyleMap from "../editor/maps/custom_style_map";
import EditorDevTools from "../editor/components/editor_devtools.js";
import configureBlockRenderer from "../editor/configure_block_renderer";
import compositeDecorator from "../editor/composite_decorator";
import isMobile from "../utils/mobile_check";

const TagListWithBlur = enhanceWithClickOutside(TagList);

class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addLinkField: { show: false },
      autoSaveTimeout: null,
      editorState: EditorState.createEmpty(compositeDecorator),
      inlineToolbar: { show: false },
      selectedBlock: null
    };
    this.addImage = this.addImage.bind(this);
    this.addLink = this.addLink.bind(this);
    this.getScreenCoordinates = this.getScreenCoordinates.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleFileSelection = this.handleFileSelection.bind(this);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.handlePastedText = this.handlePastedText.bind(this);
    this.handlePublishClick = this.handlePublishClick.bind(this);
    this.handleReturn = this.handleReturn.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.prepareTitleChange = this.prepareTitleChange.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.removeLink = this.removeLink.bind(this);
    this.retrieveSavableNote = this.retrieveSavableNote.bind(this);
    this.shouldInsertSoftNewline = this.shouldInsertSoftNewline.bind(this);
    this.showFileSelectionDialog = this.showFileSelectionDialog.bind(this);
    this.toggleBlockType = this.toggleBlockType.bind(this);
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this);
    this.toggleLinkField = this.toggleLinkField.bind(this);
    this.triggerAutoSave = this.triggerAutoSave.bind(this);
    this.updateSelection = this.updateSelection.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // Handle population of editor if editing existing note.
    if (
      (!this.props.notebookStatus.isNoteLoaded &&
        nextProps.notebookStatus.isNoteLoaded) ||
      (nextProps.notebookStatus.persistenceAlert !== "New note saved" &&
        this.props.activeNote.slug !== nextProps.activeNote.slug)
    ) {
      // Save any changes and reset the triggerAutoSave timer when switching notes
      this.props.notebookStatus.isNoteChangePending &&
        this.props.autoSaveNote(this.retrieveSavableNote());
      clearTimeout(this.autoSaveTimer);

      if (
        nextProps.activeNote.content &&
        nextProps.activeNote.content !== "<p></p>" // empty note content
      ) {
        const blocksFromHTML = convertFromHTML(nextProps.activeNote.content);
        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        this.setState({
          editorState: EditorState.createWithContent(state, compositeDecorator)
        });
      } else {
        this.setState({
          editorState: EditorState.createEmpty(compositeDecorator)
        });
      }
    }

    // Set link target for external links in notes to new window
    let anchors = document.querySelectorAll("#editor a");
    for (let i = 0; i < anchors.length; i++) {
      anchors[i].hostname !== window.location.hostname &&
        anchors[i].setAttribute("target", "_blank");
    }

    // Handle triggering of auto save.
    if (
      !this.props.notebookStatus.isNoteChangePending &&
      nextProps.notebookStatus.isNoteChangePending
    ) {
      this.triggerAutoSave();
    }
  }

  getScreenCoordinates = obj => {
    let p = {
      x: obj.offsetLeft,
      y: obj.offsetTop
    };
    while (obj.offsetParent) {
      p.x = p.x + obj.offsetParent.offsetLeft;
      p.y = p.y + obj.offsetParent.offsetTop;
      if (obj === document.getElementsByTagName("body")[0]) {
        break;
      } else {
        obj = obj.offsetParent;
      }
    }
    return p;
  };

  /**
   * Callback that draft.js calls whenever anything changes.
   */
  onEditorChange = editorState => {
    const currentContentState = this.state.editorState.getCurrentContent();
    const newContentState = editorState.getCurrentContent();
    if (
      editorState.getSelection().hasFocus &&
      !editorState.getSelection().isCollapsed()
    ) {
      if (!getSelectionRange()) {
        this.setState({
          inlineToolbar: { show: false },
          addLinkField: { show: false }
        });
      } else {
        this.setState({
          inlineToolbar: {
            show: true,
            position: {
              top:
                // NOTE: should probably eventually compute the hardcoded values here
                getSelectionRange().getBoundingClientRect().top - 42, // height of toolbar is 42px
              left:
                getSelectionRange().getBoundingClientRect().left -
                165 +
                getSelectionRange().getBoundingClientRect().width / 2 //subtract 165px for half the toolbar width and the column padding
            }
          }
        });
      }
    } else if (!this.state.addLinkField.show) {
      this.setState({
        inlineToolbar: { show: false }
      });
    }
    this.setState({ editorState });
    setTimeout(this.updateSelection, 0);

    if (
      currentContentState !== newContentState &&
      !this.props.notebookStatus.isNoteChangePending &&
      (!this.props.activeNote.member.username ||
        this.props.activeNote.member.username ===
          this.props.currentMember.username)
    ) {
      // Actual change in content registered. Ignore other change events (focus + selection).
      this.props.handleContentChange();
    }
  };

  addImage = file => {
    this.setState({
      editorState: insertImageBlock(
        this.state.editorState,
        file,
        this.props.currentMember.team.slug,
        this.props.activeNote.slug
      )
    });
  };

  addLink = (urlFieldValue, selection) => {
    const { editorState } = this.state;
    if (selection) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithLinkEntity = contentState.createEntity(
        "LINK",
        "MUTABLE",
        { url: urlFieldValue }
      );
      const entityKey = contentStateWithLinkEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithLinkEntity
      });
      this.setState(
        {
          editorState: RichUtils.toggleLink(
            newEditorState,
            editorState.getSelection(),
            entityKey
          )
        },
        () => {
          setTimeout(() => this.focus(), 0);
        }
      );
    }
    this.toggleLinkField();
  };

  removeImage = blockKey => {
    this.setState({
      editorState: removeImageBlock(this.state.editorState, blockKey)
    });
  };

  removeLink = () => {
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null)
      });
    }
  };

  blockRenderer = configureBlockRenderer(this);

  focus = () => this.editor && this.editor.focus();

  /**
   * For performance reasons, this.props.activeNote isn't always up-to-date with latest editor changes,
   * since we'd have to dispatch actions on each key stroke. This method returns a post object reflecting
   * very latest content, prior to persistence operations.
   */
  retrieveSavableNote = () => {
    const editorState = this.state.editorState;
    const contentState = editorState.getCurrentContent();
    let postClone = cloneDeep(this.props.activeNote);
    if (!postClone.title) {
      postClone.title = document.getElementById("noteTitleInput").value;
    }
    postClone.content = convertToHTML({
      styleToHTML: style => {
        if (style === "STRIKETHROUGH") {
          return {
            start: "<strike>",
            end: "</strike>",
            empty: ""
          };
        }
      },
      blockToHTML: b => {
        if (b.type === "atomic") {
          return {
            start: "<figure>",
            end: "</figure>",
            empty: ""
          };
        } else if (b.type === "code-block") {
          return {
            start: "<pre>",
            end: "</pre>",
            empty: ""
          };
        }
        return;
      },
      entityToHTML: (entity, originalText) => {
        if (entity.type === "LINK") {
          return <a href={entity.data["url"]}>{originalText}</a>;
        }
        if (entity.type === "IMAGE") {
          return `<img role='presentation' src='${
            entity.data["src"]
          }' class='img-fluid center-block' />`;
        }
        return originalText;
      }
    })(contentState);
    return postClone;
  };

  handleDeleteClick = () => {
    this.props.deleteNote(this.retrieveSavableNote());
  };

  handleFileSelection = e => {
    const file = e.target.files[0];
    this.addImage(file);
  };

  handleKeyCommand = command => {
    const { editorState } = this.state;
    let newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onEditorChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  handlePastedText = text => {
    const { editorState } = this.state;
    const startKey = editorState.getSelection().getStartKey();
    const selectedBlockType = editorState
      .getCurrentContent()
      .getBlockForKey(startKey)
      .getType();

    // keep all text pasted into a code-block in the same block
    if (selectedBlockType === "code-block") {
      const blockMap = ContentState.createFromText(
        text,
        "Hcjdz3ApFxyxgfx3cmedjTDrNPzn"
      ).getBlockMap(); // the 'Hcjdz3ApFxyxgfx3cmedjTDrNPzn' is to change the block deliminator from '\n' to something that shouldn't likely ever appear in pasted text
      const newState = Modifier.replaceWithFragment(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        blockMap
      );
      this.onEditorChange(
        EditorState.push(editorState, newState, "insert-fragment")
      );
      return true;
    } else {
      return false;
    }
  };

  handlePublishClick = () => {
    this.props.publishNote(this.retrieveSavableNote());
  };

  handleReturn = event => {
    const editorState = this.state.editorState;
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const startKey = selectionState.getStartKey();
    const block = contentState.getBlockForKey(startKey);
    const blockType = block.getType();
    if (this.shouldInsertSoftNewline(event, blockType)) {
      this.setState({ editorState: RichUtils.insertSoftNewline(editorState) });
      return "handled";
    }
    const afterRemoval = Modifier.removeRange(
      contentState,
      selectionState,
      "backward"
    );
    const targetSelection = afterRemoval.getSelectionAfter();
    const afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);
    const insertionTarget = afterSplit.getSelectionAfter();
    const asNewBlockType = Modifier.setBlockType(
      afterSplit,
      insertionTarget,
      blockType.match("list-item") ? blockType : "unstyled"
    );
    const editorStateAfterSplit = EditorState.push(
      editorState,
      asNewBlockType,
      "split-block"
    );
    this.setState({ editorState: editorStateAfterSplit });
    setTimeout(this.updateSelection, 0);
    return "handled";
  };

  shouldInsertSoftNewline = (event, blockType) =>
    hasShiftModifier(event) &&
    MULTILINE_BLOCK_TYPES.some(
      multilineBlockType => multilineBlockType === blockType
    );

  showFileSelectionDialog = () => this.fileInput && this.fileInput.click();

  toggleBlockType = blockType => {
    this.onEditorChange(
      RichUtils.toggleBlockType(this.state.editorState, blockType)
    );
  };

  toggleInlineStyle = inlineStyle => {
    this.onEditorChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  };

  toggleLinkField = () => {
    this.state.addLinkField.show
      ? this.setState({ addLinkField: { show: false } })
      : this.setState({ addLinkField: { show: true } });
  };

  triggerAutoSave() {
    // setTimeout is used to prevent note from saving every time a character is entered. 5 seconds was chosen fairly arbitrarily, might need to be optimized.
    this.autoSaveTimer = setTimeout(() => {
      this.props.autoSaveNote(this.retrieveSavableNote());
    }, 5000);
  }

  prepareTitleChange = newTitle => {
    newTitle !== this.props.title &&
      this.props.handleTitleChange(this.props.activeNote.slug, newTitle);
  };

  updateSelection = () => {
    const selectionRange = getSelectionRange();
    let selectedBlock;
    if (selectionRange) {
      selectedBlock = getSelectedBlockElement(selectionRange);
    }
    this.setState({
      selectedBlock,
      selectionRange
    });
  };

  render() {
    const {
      activeNote,
      activeNoteComments,
      addTag,
      changeDraftComment,
      changeMobileView,
      changeProfileModalUser,
      changeSelectedTagSuggestion,
      currentMember,
      deleteComment,
      draftComment,
      handleTagInputChange,
      notebookContent,
      notebookStatus,
      removeTag,
      setTagFilter,
      submitComment,
      teamTags,
      toggleBookmark,
      toggleCommentReaction,
      togglePostReaction,
      toggleSidebar,
      toggleTagInput
    } = this.props;

    // If the user changes block type before entering any text, hide the placeholder text via CSS.
    let className = "";
    let sideToolbarOffsetTop = 0;

    if (this.state.selectedBlock && document.getElementById("editor")) {
      const editorBounds = document
        .getElementById("editor")
        .getBoundingClientRect();
      const blockBounds = this.state.selectedBlock.getBoundingClientRect();

      sideToolbarOffsetTop = blockBounds.bottom - editorBounds.top - 31; // height of side toolbar
    }

    let contentState = this.state.editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getFirstBlock().getType() !== "unstyled") {
        className = "hidePlaceholder";
      }
    }

    let isNoteEditable = false;
    if (
      activeNote.slug !== `welcome-to-relaypad-${activeNote.member.username}` &&
      activeNote.member.username === currentMember.username
    ) {
      isNoteEditable = true;
    } else {
      isNoteEditable = false;
    }

    return notebookStatus.isNoteLoaded ? (
      <div
        className={classnames("notebook-note", !isNoteEditable && "read-only")}
      >
        {isMobile() &&
          isNoteEditable && (
            <MobileToolbar
              addLink={this.addLink}
              editorState={this.state.editorState}
              linkFieldStatus={this.state.addLinkField.show}
              onToggleBlock={this.toggleBlockType}
              onToggleInline={this.toggleInlineStyle}
              removeLink={this.removeLink}
              showFileSelectionDialog={this.showFileSelectionDialog}
              toggleLinkField={this.toggleLinkField}
            />
          )}
        {!isMobile() &&
          notebookStatus.hideSidebar && (
            <SidebarToggle
              toggleSidebar={toggleSidebar}
              tooltipText="Show sidebar"
            />
          )}
        {notebookStatus.showPublishConfirmation && (
          <PublishConfirmation
            noteURL={
              window.location.protocol +
              "//" +
              window.location.host +
              activeNote.detail_uri
            }
          />
        )}
        <div className="note-header">
          <div className="note-metadata">
            {notebookStatus.activeNotebookSection === "member" ? ( // show different note header depending on the notebook view
              <span className="pub-date">
                {moment(
                  activeNote.created_at ? activeNote.created_at : Date.now()
                ).format("LL")}
                {activeNote.created_at &&
                  !moment(activeNote.created_at).isSame(
                    moment(activeNote.updated_at),
                    "day"
                  ) &&
                  ` (Updated ${relativeDate(
                    activeNote.updated_at,
                    "lowercase"
                  )})`}
                {notebookStatus.persistenceAlert === "Pending changes" && (
                  <FontAwesomeIcon
                    icon={["fal", "cloud-upload"]}
                    fixedWidth
                    title={notebookStatus.persistenceAlert}
                    data-tip={notebookStatus.persistenceAlert}
                    className="pending-changes"
                  />
                )}
              </span>
            ) : (
              <PostByline
                activeNotebookSection={notebookStatus.activeNotebookSection}
                changeProfileModalUser={changeProfileModalUser}
                editorStatus={notebookStatus.persistenceAlert}
                post={activeNote}
              />
            )}
            <NoteControls
              activeNote={activeNote}
              activeNotebookSection={notebookStatus.activeNotebookSection}
              changeMobileView={changeMobileView}
              currentMember={currentMember}
              editorPlainText={this.state.editorState
                .getCurrentContent()
                .getPlainText("")}
              handlePublishClick={this.handlePublishClick}
              isNoteEditable={isNoteEditable}
              toggleBookmark={toggleBookmark}
            />
          </div>

          <div className="note-title">
            {!activeNote.member.username || isNoteEditable ? (
              <TitleField
                handleEdit={this.prepareTitleChange}
                title={activeNote.title}
              />
            ) : (
              <h1 className="title-h1">{activeNote.title}</h1>
            )}
          </div>
        </div>
        <div
          id="editor"
          className={classnames(className, !isNoteEditable && "read-only")}
          onClick={this.focus}
        >
          {this.state.selectedBlock &&
          this.state.editorState
            .getCurrentContent()
            .getBlockForKey(this.state.editorState.getSelection().getStartKey())
            .getLength() <= 0 ? (
            <SideToolbar
              editorState={this.state.editorState}
              onToggleBlock={this.toggleBlockType}
              style={{
                top:
                  sideToolbarOffsetTop +
                  this.getScreenCoordinates(document.getElementById("editor")).y
              }}
              showFileSelectionDialog={this.showFileSelectionDialog}
            />
          ) : null}
          {this.state.inlineToolbar.show &&
            !isMobile() && (
              <InlineToolbar
                addLink={this.addLink}
                editorState={this.state.editorState}
                linkFieldStatus={this.state.addLinkField.show}
                onToggleBlock={this.toggleBlockType}
                onToggleInline={this.toggleInlineStyle}
                position={this.state.inlineToolbar.position}
                removeLink={this.removeLink}
                toggleLinkField={this.toggleLinkField}
              />
            )}
          <DraftEditor
            blockRendererFn={this.blockRenderer}
            blockRenderMap={blockRenderMap}
            customStyleMap={customStyleMap}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            handlePastedText={this.handlePastedText}
            handleReturn={this.handleReturn}
            onChange={this.onEditorChange}
            placeholder={PLACEHOLDER_TEXT}
            readOnly={!activeNote.member || isNoteEditable ? false : true}
            ref={ref => (this.editor = ref)}
            spellCheck={true}
          />
        </div>
        <div id="noteTagsContainer">
          <TagListWithBlur
            activeTagFilter={notebookContent.tagFilter}
            addTag={addTag}
            changeSelectedTagSuggestion={changeSelectedTagSuggestion}
            editorStatus={notebookStatus}
            handleTagInputChange={handleTagInputChange}
            isEditable={isNoteEditable ? true : false}
            isSidebarHidden={notebookStatus.hideSidebar}
            note_slug={activeNote.slug}
            removeTag={removeTag}
            setTagFilter={setTagFilter}
            tagForm={notebookContent.tagForm}
            tags={activeNote.tags}
            teamTags={teamTags}
            toggleTagInput={toggleTagInput}
          />
        </div>
        {activeNote.slug &&
          activeNote.status === "PUBLISHED" && (
            <Reactions
              content={activeNote}
              toggleReaction={togglePostReaction}
            />
          )}
        {(activeNoteComments.length > 0 ||
          activeNote.status === "PUBLISHED") && (
          <div id="commentsContainer">
            <CommentList
              changeDraftComment={changeDraftComment}
              changeProfileModalUser={changeProfileModalUser}
              commentCount={activeNote.comment_count}
              comments={activeNoteComments}
              currentMember={currentMember}
              deleteComment={deleteComment}
              draftComment={draftComment}
              isLoading={notebookStatus.isCommentsLoading}
              postSlug={activeNote.slug || ""}
              submitComment={submitComment}
              toggleCommentReaction={toggleCommentReaction}
            />
          </div>
        )}

        <input
          onChange={this.handleFileSelection}
          ref={ref => (this.fileInput = ref)}
          style={{ display: "none" }}
          type="file"
        />
        <DeleteDialog handleDeleteClick={this.handleDeleteClick} />
        <ReactTooltip effect="solid" place="bottom" />
        {process.env.NODE_ENV !== "production" &&
          !isMobile && (
            // Place to throw some useful dev short cuts.
            <EditorDevTools editorState={this.state.editorState} />
          )}
      </div>
    ) : notebookStatus.isNotebookBuilt &&
    notebookContent[`${notebookStatus.activeNotebookSection}Notes`].length ===
      0 ? (
      <EmptyNotebookMsg
        activeNotebookSection={notebookStatus.activeNotebookSection}
        currentMember={currentMember}
        hideSidebar={notebookStatus.hideSidebar}
        toggleSidebar={toggleSidebar}
      />
    ) : (
      <LoadingSpinner />
    );
  }
}

Note.propTypes = {
  activeNote: PropTypes.object.isRequired,
  activeNoteComments: PropTypes.array.isRequired,
  addTag: PropTypes.func.isRequired,
  autoSaveNote: PropTypes.func.isRequired,
  changeDraftComment: PropTypes.func.isRequired,
  changeMobileView: PropTypes.func.isRequired,
  changeProfileModalUser: PropTypes.func.isRequired,
  changeSelectedTagSuggestion: PropTypes.func.isRequired,
  currentMember: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  draftComment: PropTypes.string.isRequired,
  handleContentChange: PropTypes.func.isRequired,
  handleTagInputChange: PropTypes.func.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  notebookContent: PropTypes.object.isRequired,
  notebookStatus: PropTypes.object.isRequired,
  publishNote: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
  setTagFilter: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,
  teamTags: PropTypes.array.isRequired,
  toggleBookmark: PropTypes.func.isRequired,
  toggleCommentReaction: PropTypes.func.isRequired,
  togglePostReaction: PropTypes.func.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  toggleTagInput: PropTypes.func.isRequired,
  unloadNoteEditor: PropTypes.func.isRequired
};

export default Note;
