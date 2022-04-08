import { CompositeDecorator } from "draft-js";
import linkDecorator from "./decorators/link_decorator";

const compositeDecorator = new CompositeDecorator([linkDecorator]);

export default compositeDecorator;
