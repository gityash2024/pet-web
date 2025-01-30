import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollUtility';

export const useScrollTop = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
      window.requestAnimationFrame(() => {
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);
      });
    }, [pathname]);
  };