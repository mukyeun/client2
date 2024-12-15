import React, { useEffect, useRef, useState } from 'react';
import './VirtualScroll.css';

const VirtualScroll = ({ items, rowHeight, visibleRows, renderRow }) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  const totalHeight = items.length * rowHeight;
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(
    startIndex + visibleRows + 2,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * rowHeight;

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      className="virtual-scroll-container"
      onScroll={handleScroll}
      style={{ height: visibleRows * rowHeight }}
    >
      <div
        className="virtual-scroll-content"
        style={{ height: totalHeight }}
      >
        <div
          className="virtual-scroll-items"
          style={{ transform: `translateY(${offsetY}px)` }}
        >
          {visibleItems.map((item, index) =>
            renderRow(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualScroll; 