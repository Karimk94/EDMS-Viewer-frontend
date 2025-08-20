"use client"; // This directive is essential for components with interactivity

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { DocumentList, Document } from './components/DocumentList';
import { Pagination } from './components/Pagination';
import { ImageModal } from './components/ImageModal';
import { Loader } from './components/Loader';

// This is now your main page component
export default function HomePage() {
  // --- State Management (all state remains the same) ---
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // --- API Configuration ---
  const FLASK_API_URL = 'http://127.0.0.1:5000';

  // --- Data Fetching Effect (no changes needed) ---
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = new URL(`${FLASK_API_URL}/api/documents`);
        url.searchParams.append('page', String(currentPage));
        if (searchTerm) {
          url.searchParams.append('search', searchTerm);
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        setDocuments(data.documents);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError('Failed to fetch documents. Is the Python API running?');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [currentPage, searchTerm]);

  // --- Event Handlers (no changes needed) ---
  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear the thumbnail cache?')) return;
    try {
      await fetch(`${FLASK_API_URL}/api/clear_cache`, { method: 'POST' });
      alert('Thumbnail cache cleared successfully.');
      setSearchTerm(prev => prev + ' '); 
      setSearchTerm(searchTerm);
    } catch (err) {
      alert('Failed to clear cache.');
    }
  };

  // --- Render Logic (no changes needed) ---
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <Header onClearCache={handleClearCache} />
      <main>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Documents</h2>
            <SearchBar onSearch={handleSearch} />
          </div>
          {isLoading && <Loader />}
          {error && <p className="text-center p-10 text-red-500">{error}</p>}
          {!isLoading && !error && (
            <>
              {documents.length > 0 ? (
                <DocumentList 
                  documents={documents} 
                  onDocumentClick={setSelectedDoc} 
                  apiURL={FLASK_API_URL} 
                />
              ) : (
                <p className="text-center p-10 text-gray-500">No documents found.</p>
              )}
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </>
          )}
        </div>
      </main>
      {selectedDoc && (
        <ImageModal 
          doc={selectedDoc} 
          onClose={() => setSelectedDoc(null)} 
          apiURL={FLASK_API_URL}
        />
      )}
    </div>
  );
}
