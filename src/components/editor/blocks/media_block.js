import Media from "../components/media";

const mediaBlock = {
  component: Media,
  editable: false,
  props: {
    remove: (editor, blockKey) => editor.removeImage(blockKey),
    uploadCompleted: editor => editor.props.handleContentChange()
  }
};

export default mediaBlock;
