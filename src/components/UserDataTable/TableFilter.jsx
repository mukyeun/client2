import React from 'react';

const TableFilter = ({ onFilterChange, onResetFilters, filters }) => {
  return (
    <div className="table-filters">
      <div className="filter-group">
        <label>등록일자</label>
        <input 
          type="date" 
          name="startDate"
          value={filters.startDate}
          onChange={(e) => onFilterChange('startDate', e.target.value)}
        />
        <span>~</span>
        <input 
          type="date" 
          name="endDate"
          value={filters.endDate}
          onChange={(e) => onFilterChange('endDate', e.target.value)}
        />
      </div>
      
      <div className="filter-group">
        <label>주민등록번호</label>
        <input 
          type="text" 
          placeholder="주민등록번호 앞자리"
          value={filters.residentNumberPrefix}
          onChange={(e) => onFilterChange('residentNumberPrefix', e.target.value)}
        />
      </div>

      <button 
        className="reset-filter-button"
        onClick={onResetFilters}
      >
        필터 초기화
      </button>
    </div>
  );
};

export default TableFilter; 