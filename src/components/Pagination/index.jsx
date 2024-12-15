import React from 'react';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange 
}) => {
  const pageNumbers = [];
  const maxPageButtons = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <div className="pagination-controls">
        <button 
          onClick={() => onPageChange(1)} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          {'<<'}
        </button>
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="pagination-button"
        >
          {'<'}
        </button>
        
        {startPage > 1 && (
          <>
            <button 
              onClick={() => onPageChange(1)}
              className="pagination-button"
            >
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button 
              onClick={() => onPageChange(totalPages)}
              className="pagination-button"
            >
              {totalPages}
            </button>
          </>
        )}

        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          {'>'}
        </button>
        <button 
          onClick={() => onPageChange(totalPages)} 
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          {'>>'}
        </button>
      </div>
    </div>
  );
};

export default Pagination; 