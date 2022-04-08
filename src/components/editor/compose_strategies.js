const composeStrategies = (...strategies) =>
  (...args) => strategies.forEach(strategy => strategy(...args));

export default composeStrategies;
