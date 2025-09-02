"use client";

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DocumentList, Document } from './components/DocumentList';
import { Pagination } from './components/Pagination';
import { ImageModal } from './components/ImageModal';
import { VideoModal } from './components/VideoModal';
import { Loader } from './components/Loader';

interface PersonOption {
  value: number;
  label: string;
}

const formatToApiDate = (date: Date | null): string => {
  if (!date) return '';
  const pad = (num: number) => num.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default function HomePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<PersonOption[] | null>(null);
  const [personCondition, setPersonCondition] = useState<'any' | 'all'>('any');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Document | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const FLASK_API_URL = 'http://127.0.0.1:5000';
  const FACE_RECOG_URL = 'http://127.0.0.1:5002';

  useEffect(() => {
    if (selectedPerson && selectedPerson.length <= 1 && personCondition !== 'any') {
      setPersonCondition('any');
    }
  }, [selectedPerson, personCondition]);

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
        
        if (selectedPerson && selectedPerson.length > 0) {
            const personNames = selectedPerson.map(p => p.label.split(' - ')[0]).join(',');
            url.searchParams.append('persons', personNames);
            if (selectedPerson.length > 1) {
              url.searchParams.append('person_condition', personCondition);
            }
        }
        
        const formattedDateFrom = formatToApiDate(dateFrom);
        if (formattedDateFrom) url.searchParams.append('date_from', formattedDateFrom);

        const formattedDateTo = formatToApiDate(dateTo);
        if (formattedDateTo) url.searchParams.append('date_to', formattedDateTo);
        
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
  }, [currentPage, searchTerm, dateFrom, dateTo, selectedPerson, personCondition, refreshKey]);

  const handleSearch = (newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setCurrentPage(1);
  };

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear the thumbnail cache?')) return;
    try {
      await fetch(`${FLASK_API_URL}/api/clear_cache`, { method: 'POST' });
      alert('Thumbnail cache cleared.');
      setRefreshKey(prevKey => prevKey + 1);
    } catch (err) {
      alert('Failed to clear cache.');
    }
  };

  const handleUpdateAbstractSuccess = (docId: number, newAbstract: string) => {
    if (selectedDoc) {
      setSelectedDoc({ ...selectedDoc, title: newAbstract, abstract: newAbstract });
    }
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleDocumentClick = (doc: Document) => {
    if (doc.media_type === 'video') {
      setSelectedVideo(doc);
    } else {
      setSelectedDoc(doc);
    }
  };

  return (
    <div>
      <Header 
        onSearch={handleSearch} 
        onClearCache={handleClearCache}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        personCondition={personCondition}
        setPersonCondition={setPersonCondition}
        apiURL={FLASK_API_URL}
      />
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && <Loader />}
        {error && <p className="text-center text-red-400">{error}</p>}
        {!isLoading && !error && (
          <>
            {documents.length > 0 ? (
              <DocumentList 
                documents={documents} 
                onDocumentClick={handleDocumentClick} 
                apiURL={FLASK_API_URL} 
                faceRecogURL={FACE_RECOG_URL} 
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
          faceRecogURL={FACE_RECOG_URL}
          onUpdateAbstractSuccess={handleUpdateAbstractSuccess}
        />
      )}
      {selectedVideo && (
        <VideoModal
          doc={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          apiURL={FLASK_API_URL}
        />
      )}
    </div>
  );
}