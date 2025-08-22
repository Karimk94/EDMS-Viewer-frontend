import React from 'react';
import { SearchBar } from './SearchBar';
import { AdvancedFilters } from './AdvancedFilters'; // Import the new component

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  onClearCache: () => void;
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onClearCache, dateFrom, setDateFrom, dateTo, setDateTo }) => (
  <header className="sticky top-0 z-40 bg-[#212121] border-b border-gray-700 px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Left Section: Title */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold text-white">
          EDMS <span className="text-red-500">Media</span> <span className="text-slate-500">POC</span>
        </h1>
      </div>

      {/* Center Section: Search and Filters */}
      <div className="flex-1 flex justify-center px-4 items-center gap-4">
        <div className="w-full max-w-md">
          <SearchBar onSearch={onSearch} />
        </div>
        {/* Replace the old date picker with the new advanced filters button */}
        <AdvancedFilters
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center">
        <button hidden={true}
          onClick={onClearCache}
          className="px-3 py-2 bg-gray-700 text-white text-xs font-medium rounded-md hover:bg-gray-600 transition"
        >
          Clear Cache
        </button>
      </div>
    </div>
  </header>
);
