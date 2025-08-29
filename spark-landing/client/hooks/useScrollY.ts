import { useState, useEffect } from 'react';

export const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Priority order: data-scroll-container > main > .overflow-y-auto > window
          const scrollContainer = document.querySelector('[data-scroll-container]') as HTMLElement;
          const mainElement = document.querySelector('main') as HTMLElement;
          const overflowElement = document.querySelector('.overflow-y-auto') as HTMLElement;
          
          let currentScrollY = 0;
          
          if (scrollContainer) {
            currentScrollY = scrollContainer.scrollTop;
          } else if (mainElement) {
            currentScrollY = mainElement.scrollTop;
          } else if (overflowElement) {
            currentScrollY = overflowElement.scrollTop;
          } else {
            currentScrollY = window.scrollY;
          }
          
          setScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial call to set position
    handleScroll();

    // Add listeners to all potential scroll sources
    const scrollContainer = document.querySelector('[data-scroll-container]');
    const mainElement = document.querySelector('main');
    const overflowElement = document.querySelector('.overflow-y-auto');

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
    }
    if (overflowElement) {
      overflowElement.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
      if (overflowElement) {
        overflowElement.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollY;
};
