import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/*
  custom pagination hook synced with URL.
  paramName: allows multiple paginations in one app
*/

const usePagination = (items, itemsPerPage = 10, options = {}) => {
  const { 
    paramName = 'page', 
    scrollToTop = true 
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  // get current page from URL (single source of truth)
  const currentPage = useMemo(() => {
    const pageParam = searchParams.get(paramName);
    const page = parseInt(pageParam, 10);
    // fallback to 1 if invalid or less than 1
    return (isNaN(page) || page < 1) ? 1 : page;
  }, [searchParams, paramName]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  // self-healing: adjust page if it exceeds total pages after filtering
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setSearchParams(prev => {
        prev.set(paramName, '1');
        return prev;
      }, { replace: true }); // replace history entry
    }
  }, [items.length, totalPages, currentPage, paramName, setSearchParams]);

  // function to navigate to specific page (updates URL)
  const goToPage = (pageNumber) => {
    const targetPage = Math.max(1, Math.min(pageNumber, Math.max(1, totalPages)));

    setSearchParams(prev => {
      prev.set(paramName, targetPage.toString());
      return prev;
    });

    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // slice data for current page
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage: () => goToPage(currentPage + 1),
    prevPage: () => goToPage(currentPage - 1),
    itemsPerPage,
    totalItems: items.length,
  };
};

export default usePagination;