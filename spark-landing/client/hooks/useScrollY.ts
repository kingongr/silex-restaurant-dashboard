import { useState, useEffect } from 'react';

export const useScrollY = () => {
  const [scrollY, setScrollY] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

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
          let currentPageHeight = 0;
          let currentContainerHeight = 0;
          
          if (scrollContainer) {
            currentScrollY = scrollContainer.scrollTop;
            currentPageHeight = scrollContainer.scrollHeight;
            currentContainerHeight = scrollContainer.clientHeight;
          } else if (mainElement) {
            currentScrollY = mainElement.scrollTop;
            currentPageHeight = mainElement.scrollHeight;
            currentContainerHeight = mainElement.clientHeight;
          } else if (overflowElement) {
            currentScrollY = overflowElement.scrollTop;
            currentPageHeight = overflowElement.scrollHeight;
            currentContainerHeight = overflowElement.clientHeight;
          } else {
            currentScrollY = window.scrollY;
            currentPageHeight = document.documentElement.scrollHeight;
            currentContainerHeight = window.innerHeight;
          }
          
          setScrollY(currentScrollY);
          setPageHeight(currentPageHeight);
          setContainerHeight(currentContainerHeight);
          ticking = false;
        });
        ticking = true;
      }
    };

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

    // Initial call to set position
    handleScroll();

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

  // Calculate adaptive scroll movement
  const getAdaptiveScrollTransform = () => {
    if (pageHeight <= containerHeight) {
      return 0; // No scroll needed
    }
    
    const scrollableHeight = pageHeight - containerHeight;
    const scrollProgress = scrollY / scrollableHeight;
    
    // Move the bell up by a percentage of its original position
    // This creates a natural "following" effect that adapts to page size
    const maxMovement = Math.min(200, containerHeight * 0.3); // Adaptive max movement
    const movement = scrollProgress * maxMovement;
    
    return Math.min(movement, maxMovement);
  };

  return {
    scrollY,
    pageHeight,
    containerHeight,
    getAdaptiveScrollTransform
  };
};
