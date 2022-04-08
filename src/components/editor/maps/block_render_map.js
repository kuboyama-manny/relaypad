import Immutable from "immutable";
import { DefaultDraftBlockRenderMap } from "draft-js";

const blockRenderMap = Immutable.Map({ p: { element: "p" } });

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

export default extendedBlockRenderMap;
