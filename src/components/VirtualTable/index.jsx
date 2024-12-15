import React, { useRef, useEffect, useState } from 'react';
import './VirtualTable.css';

const VirtualTable = ({ 
  data, 
  rowHeight = 40,
  visibleRows = 15,
  renderRow,
  headerHeight = 40,
  renderHeader
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);
    }
  }, []);

  const totalHeight = data.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight));
  const endIndex = Math.min(
    data.length,
    Math.ceil((scrollTop + containerHeight) / rowHeight)
  );

  const visibleData = data.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * rowHeight;

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div 
      className="virtual-table-container"
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: rowHeight * visibleRows + headerHeight }}
    >
      <div 
        className="virtual-table-header"
        style={{ height: headerHeight }}
      >
        {renderHeader()}
      </div>
      <div 
        className="virtual-table-content"
        style={{ height: totalHeight - headerHeight }}
      >
        <div 
          className="virtual-table-rows"
          style={{ 
            transform: `translateY(${offsetY}px)`,
          }}
        >
          {visibleData.map((item, index) => (
            <div 
              key={item._id || startIndex + index}
              style={{ height: rowHeight }}
              className="virtual-table-row"
            >
              {renderRow(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(VirtualTable); 