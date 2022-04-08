import { combineReducers } from "redux";
import common from "./common_reducer";
import tag from "./tag_reducer";
import entities from "./entity_reducer";
import notifications from "./notifications_reducer";
import notebook from "./notebook_reducer";
import settings from "./settings_reducer";

const rootReducer = combineReducers({
  entities,
  common,
  tag,
  notifications,
  notebook,
  settings
});

export default rootReducer;
