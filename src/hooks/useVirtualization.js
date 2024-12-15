// src/hooks/useVirtualization.js
import { useState, useEffect, useCallback } from 'react';

export const useVirtualization = (items, rowHeight = 40) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const [scrollTop, setScrollTop] = useState(0);
  
  const updateVisibleItems = useCallback(() => {
    const startIndex = Math.floor(scrollTop / rowHeight);
    const endIndex = startIndex + Math.ceil(window.innerHeight / rowHeight);
    
    setVisibleItems(items.slice(startIndex, endIndex + 1));
  }, [items, rowHeight, scrollTop]);

  useEffect(() => {
    updateVisibleItems();
  }, [updateVisibleItems]);

  return {
    visibleItems,
    onScroll: (e) => setScrollTop(e.target.scrollTop),
    totalHeight: items.length * rowHeight
  };
};