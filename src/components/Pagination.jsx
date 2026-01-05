import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  siblingCount = 1,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPaginationRange = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - siblingCount);
      const endPage = Math.min(totalPages - 1, currentPage + siblingCount);
      let pages = [];

      if (currentPage <= siblingCount + 1) {
        pages = [...Array(totalNumbers - 1).keys()].map((i) => i + 2);
        return [1, ...pages, '...', totalPages];
      } else if (currentPage >= totalPages - siblingCount) {
        pages = [...Array(totalNumbers - 1).keys()].map(
          (i) => totalPages - totalNumbers + i + 2
        );
        return [1, '...', ...pages, totalPages];
      } else {
        pages = [...Array(endPage - startPage + 1).keys()].map(
          (i) => startPage + i
        );
        return [1, '...', ...pages, '...', totalPages];
      }
    }

    return [...Array(totalPages).keys()].map((i) => i + 1);
  };

  if (totalPages <= 1) {
    return null;
  }

  const pages = getPaginationRange();

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
            </span>{' '}
            to{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{' '}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {pages.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === page
                    ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${
                  page === '...'
                    ? 'cursor-default'
                    : 'hover:bg-gray-50 cursor-pointer'
                }`}
                disabled={page === '...'}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;