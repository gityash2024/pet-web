export const scrollToTop = () => {
    try {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } catch (error) {
      // For older browsers
      window.scrollTo(0, 0);
    }
  };