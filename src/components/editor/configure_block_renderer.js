import customBlockMap from "./maps/custom_block_map";

const injectEditorIntoBlockProps = (editor, block) => ({
  ...block,
  props: Object.keys(block.props).reduce(
    (result, propName) => {
      const propValue = block.props[propName];
      return {
        ...result,
        [propName]: typeof propValue === "function"
          ? propValue.bind(null, editor)
          : propValue
      };
    },
    {}
  )
});

const configureBlockRenderer = editor => {
  const blockRenderer = block => {
    const blockType = block.getType();
    const customBlockType = Object.keys(customBlockMap).find(
      customBlockType => customBlockType === blockType
    );
    if (customBlockType) {
      return injectEditorIntoBlockProps(
        editor,
        customBlockMap[customBlockType]
      );
    }
  };
  return blockRenderer;
};

export default configureBlockRenderer;
