import React from 'react';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  onClearCache: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onClearCache }) => (
  <header className="sticky top-0 z-40 bg-[#212121] border-b border-gray-700 px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Left Section: Title */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold text-white">
          EDMS <span className="text-red-500">Media</span> <span className="text-slate-500">POC</span>
        </h1>
      </div>

      {/* Center Section: Search Bar */}
      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-md">
          <SearchBar onSearch={onSearch}  />
        </div>
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
