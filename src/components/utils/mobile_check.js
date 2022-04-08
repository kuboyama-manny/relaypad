const isMobile = () => {
  let windowWidth = window.innerWidth;
  const screenSmall = 768;
  if (windowWidth <= screenSmall) {
    return true;
  } else {
    return false;
  }
};

export default isMobile;
