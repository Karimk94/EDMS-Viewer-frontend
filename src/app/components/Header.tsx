import React from 'react';
import { AdvancedFilters } from './AdvancedFilters';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  onClearCache: () => void;
  dateFrom: Date | null;
  setDateFrom: (date: Date | null) => void;
  dateTo: Date | null;
  setDateTo: (date: Date | null) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onClearCache, dateFrom, setDateFrom, dateTo, setDateTo }) => (
  <header className="sticky top-0 z-40 bg-[#212121] border-b border-gray-700 px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold text-white">
          EDMS <span className="text-red-500">Media</span> <span className="text-slate-500">POC</span>
        </h1>
      </div>

      <div className="flex-1 flex justify-center px-4 items-center gap-4">
        <div className="w-full max-w-md">
          <SearchBar onSearch={onSearch} />
        </div>
        <AdvancedFilters
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />
      </div>

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