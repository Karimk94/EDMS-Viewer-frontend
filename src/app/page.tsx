"use client";

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DocumentList, Document } from './components/DocumentList';
import { Pagination } from './components/Pagination';
import { ImageModal } from './components/ImageModal';
import { Loader } from './components/Loader';

export default function HomePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const FLASK_API_URL = 'http://127.0.0.1:5000';

  
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = new URL(`${FLASK_API_URL}/api/documents`);
        url.searchParams.append('page', String(currentPage));
        if (searchTerm) url.searchParams.append('search', searchTerm);
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok.');
        
        const data = await response.json();
        setDocuments(data.documents);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError('Failed to fetch documents. Is the Python API running?');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [currentPage, searchTerm]);

  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear the thumbnail cache?')) return;
    try {
      await fetch(`${FLASK_API_URL}/api/clear_cache`, { method: 'POST' });
      alert('Thumbnail cache cleared.');
      setSearchTerm(prev => prev + ' ');
      setSearchTerm(searchTerm);
    } catch (err) {
      alert('Failed to clear cache.');
    }
  };

  return (
    <div>
      <Header onSearch={handleSearch} onClearCache={handleClearCache} />
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && <Loader />}
        {error && <p className="text-center text-red-400">{error}</p>}
        {!isLoading && !error && (
          <>
            {documents.length > 0 ? (
              <DocumentList 
                documents={documents} 
                onDocumentClick={setSelectedDoc} 
                apiURL={FLASK_API_URL} 
              />
            ) : (
              <p className="text-center text-gray-400">No documents found.</p>
            )}
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </>
        )}
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
