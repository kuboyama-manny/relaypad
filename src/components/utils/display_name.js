const displayName = user => {
  return user.first_name || user.last_name
    ? [user.first_name, user.last_name].join(" ")
    : "@" + user.username;
};

export default displayName;
