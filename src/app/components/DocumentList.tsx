import React from 'react';

export interface Document {
  doc_id: number;
  title: string;
  abstract?: string; // Abstract is now optional since it might not exist for all documents
  author: string;
  date: string;
  thumbnail_url: string;
}

interface DocumentListProps {
  documents: Document[];
  onDocumentClick: (doc: Document) => void;
  apiURL: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, onDocumentClick, apiURL }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
    {documents.map(doc => (
      <div 
        key={doc.doc_id} 
        onClick={() => onDocumentClick(doc)}
        className="cursor-pointer group"
      >
        <div className="aspect-w-16 aspect-h-9 mb-2">
          <img 
            src={`${apiURL}/${doc.thumbnail_url}`}
            alt="Thumbnail" 
            className="w-full h-full object-cover rounded-lg bg-gray-800 group-hover:opacity-80 transition"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/480x270/1f2937/6b7280?text=No+Image'; }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-100 text-sm truncate group-hover:text-white transition">{doc.title}</h3>
          <p 
            className="text-xs text-gray-400 max-h-12 overflow-hidden truncate"
            title={doc.title || ''}
          >
            {doc.title || "No title available."}
          </p>
          <p className="text-xs text-gray-400">{doc.author}</p>
          <p className="text-xs text-gray-400">{doc.date}</p>
        </div>
      </div>
    ))}
  </div>
);