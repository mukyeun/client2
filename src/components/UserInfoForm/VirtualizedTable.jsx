// src/components/UserInfoForm/VirtualizedTable.jsx
import React from 'react';
import { useVirtualization } from '../../hooks/useVirtualization';

export const VirtualizedTable = ({ data }) => {
  const { visibleItems, onScroll, totalHeight } = useVirtualization(data);

  return (
    <div 
      style={{ height: '400px', overflow: 'auto' }}
      onScroll={onScroll}
    >
      <div style={{ height: totalHeight }}>
        {visibleItems.map((item, index) => (
          <div 
            key={index}
            style={{ height: '40px' }}
          >
            {/* 행 내용 */}
            <span>{item.name}</span>
            <span>{item.ab_ms}</span>
            {/* ... 기타 필드 */}
          </div>
        ))}
      </div>
    </div>
  );
};