import findWithRegex from "find-with-regex";
import { URL_REGEX, EMAIL_REGEX } from "../constants";
import { SelectionState, Modifier, EditorState } from "draft-js";

const applyLinkEntities = editorState => {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();
  let contentStateWithEntitiesApplied = contentState;
  blockMap.forEach(block => {
    const blockKey = block.getKey();
    const blockText = block.getText();
    findWithRegex(URL_REGEX, block, (start, end) => {
      if (block.getEntityAt(start)) {
        return;
      }
      let url = blockText.substring(start, end);
      url = url.match(/^http/i) ? url : `http://${url}`;
      const contentStateWithEntity = contentState.createEntity(
        "LINK",
        "MUTABLE",
        {
          url
        }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const selectionState = SelectionState.createEmpty(blockKey);
      const updatedSelectionState = selectionState.merge({
        anchorOffset: start,
        focusOffset: end
      });
      contentStateWithEntitiesApplied = Modifier.applyEntity(
        contentStateWithEntitiesApplied,
        updatedSelectionState,
        entityKey
      );
    });
    findWithRegex(EMAIL_REGEX, block, (start, end) => {
      if (block.getEntityAt(start)) {
        return;
      }
      let url = blockText.substring(start, end);
      url = url.match(/^mailto/i) ? url : `mailto:${url}`;
      const contentStateWithEntity = contentState.createEntity(
        "LINK",
        "MUTABLE",
        {
          url
        }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const selectionState = SelectionState.createEmpty(blockKey);
      const updatedSelectionState = selectionState.merge({
        anchorOffset: start,
        focusOffset: end
      });
      contentStateWithEntitiesApplied = Modifier.applyEntity(
        contentStateWithEntitiesApplied,
        updatedSelectionState,
        entityKey
      );
    });
  });
  return EditorState.set(editorState, {
    currentContent: contentStateWithEntitiesApplied
  });
};

export default applyLinkEntities;
