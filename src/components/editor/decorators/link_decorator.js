import composeStrategies from "../compose_strategies";
import entityTypeStrategy from "../strategies/entity_type_strategy";
import regexStrategy from "../strategies/regex_strategy";
import { URL_REGEX, EMAIL_REGEX } from "../constants";
import Link from "../components/link";

const linkDecorator = {
  strategy: composeStrategies(
    entityTypeStrategy("LINK"),
    regexStrategy(URL_REGEX),
    regexStrategy(EMAIL_REGEX)
  ),
  component: Link
};

export default linkDecorator;
