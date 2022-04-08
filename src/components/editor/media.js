import {
  EditorState,
  AtomicBlockUtils,
  Modifier,
  SelectionState
} from "draft-js";
import request from "superagent";
import Variables from "../../variables";

export const insertImageBlock = (editorState, file, team_slug, post_slug) => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithImageEntity = contentState.createEntity(
    "IMAGE",
    "IMMUTABLE",
    {
      upload_pending: true,
      src: URL.createObjectURL(file),
      file: file,
      team_slug: team_slug,
      post_slug: post_slug
    }
  );
  const entityKey = contentStateWithImageEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithImageEntity
  });
  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
};

/*
 * Support for deletion button on images, worth noting that this isn't
 * called if user backspaces to delete image. If draft entity data includes
 * `delete_token` for this image we'll try to delete it.
 */
export const removeImageBlock = (editorState, blockKey) => {
  const currentContentState = editorState.getCurrentContent();
  const block = currentContentState.getBlockForKey(blockKey);
  const entity = currentContentState.getEntity(block.getEntityAt(0));

  if (entity.getData()["delete_token"]) {
    // Entity has a delete token, attempt to delete from cloudinary.
    // Worse case, if this fails we store an extra image on cloudinary.
    // Note: delete tokens only work for 10 mins after upload.
    let deletion = request
      .post(Variables.CLOUDINARY_DELETE_URL)
      .field("public_id", entity.getData()["public_id"])
      .field("token", entity.getData()["delete_token"]);

    deletion.end((err, response) => {
      if (err) {
        console.error(err);
      }
      // Don't care if successful.
    });
  }

  const targetRange = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: block.getLength()
  });

  const contentStateWithoutMedia = Modifier.removeRange(
    currentContentState,
    targetRange,
    "backward"
  );

  const resetBlock = Modifier.setBlockType(
    contentStateWithoutMedia,
    contentStateWithoutMedia.getSelectionAfter(),
    "unstyled"
  );

  const newEditorState = EditorState.push(
    editorState,
    resetBlock,
    "remove-range"
  );
  return EditorState.forceSelection(
    newEditorState,
    resetBlock.getSelectionAfter()
  );
};
