"use client";

import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';

interface DateRangePickerProps {
    dateFrom: Date | null;
    setDateFrom: (date: Date | null) => void;
    dateTo: Date | null;
    setDateTo: (date: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateFrom, setDateFrom, dateTo, setDateTo }) => {
    const handleClear = () => {
        setDateFrom(null);
        setDateTo(null);
    };

    const handleDateFromChange = (date: Date | null) => {
        if (date) {
            date.setHours(0, 0, 0, 0);
        }
        setDateFrom(date);
    };

    const handleDateToChange = (date: Date | null) => {
        if (date) {
            date.setHours(23, 59, 59, 999);
        }
        setDateTo(date);
    };


    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <label htmlFor="dateFrom" className="text-sm text-gray-400 w-12">From:</label>
                <DatePicker
                    id="dateFrom"
                    selected={dateFrom}
                    onChange={handleDateFromChange}
                    selectsStart
                    startDate={dateFrom}
                    endDate={dateTo}
                    isClearable
                    dateFormat="MMMM d, yyyy"
                    className="w-full"
                />
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="dateTo" className="text-sm text-gray-400 w-12">To:</label>
                <DatePicker
                    id="dateTo"
                    selected={dateTo}
                    onChange={handleDateToChange}
                    selectsEnd
                    startDate={dateFrom}
                    endDate={dateTo}
                    minDate={dateFrom ?? undefined}
                    isClearable
                    dateFormat="MMMM d, yyyy"
                    className="w-full"
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

interface AdvancedFiltersProps {
    dateFrom: Date | null;
    setDateFrom: (date: Date | null) => void;
    dateTo: Date | null;
    setDateTo: (date: Date | null) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ dateFrom, setDateFrom, dateTo, setDateTo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

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
                {activeFilterCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {activeFilterCount}
                    </span>
                )}
            </button>

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