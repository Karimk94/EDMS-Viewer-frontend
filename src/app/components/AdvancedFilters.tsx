"use client";

import React, { useState, useRef, useEffect } from 'react';

// Interface for the DateRangePicker's props
interface DateRangePickerProps {
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
}

// The DateRangePicker component is now defined inside this file
const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateFrom, setDateFrom, dateTo, setDateTo }) => {
  const handleClear = () => {
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label htmlFor="dateFrom" className="text-sm text-gray-400 w-12">From:</label>
        <input
          id="dateFrom"
          type="datetime-local"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="w-full px-3 py-2 bg-[#121212] text-gray-200 border border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="dateTo" className="text-sm text-gray-400 w-12">To:</label>
        <input
          id="dateTo"
          type="datetime-local"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="w-full px-3 py-2 bg-[#121212] text-gray-200 border border-gray-600 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
        />
      </div>
       {(dateFrom || dateTo) && (
        <button
          onClick={handleClear}
          className="w-full mt-2 text-center text-sm text-red-400 hover:text-red-300"
          aria-label="Clear date range"
        >
          Clear Dates
        </button>
      )}
    </div>
  );
};


// Interface for the AdvancedFilters component's props
interface AdvancedFiltersProps {
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ dateFrom, setDateFrom, dateTo, setDateTo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Effect to handle clicks outside the component to close the popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  // Calculate the number of active filters to show in the badge
  const activeFilterCount = [dateFrom, dateTo].filter(Boolean).length;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16.051V12.414L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
        </svg>
        Filters
        {/* Badge to show the count of active filters */}
        {activeFilterCount > 0 && (
            <span className="ml-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
            </span>
        )}
      </button>

      {/* The popover that appears when the button is clicked */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-[#282828] border border-gray-600 rounded-lg shadow-lg z-50 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Advanced Filters</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date Range</label>
              <DateRangePicker
                dateFrom={dateFrom}
                setDateFrom={setDateFrom}
                dateTo={dateTo}
                setDateTo={setDateTo}
              />
            </div>
            
            {/* Placeholder for your upcoming tags filter */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
                <div className="px-3 py-2 bg-[#121212] text-gray-500 border border-gray-600 rounded-md">
                    Tag filter coming soon...
                </div>
            </div>

          </div>

          <div className="mt-6 text-right">
             <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition"
             >
                Apply
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
