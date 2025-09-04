import React from 'react';

export interface Document {
  doc_id: number;
  title: string;
  abstract?: string;
  docnumber: string;
  docname: string;
  date: string;
  thumbnail_url: string;
  media_type: 'image' | 'video' | 'pdf';
}

interface DocumentListProps {
  documents: Document[];
  onDocumentClick: (doc: Document) => void;
  apiURL: string;
  faceRecogURL: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, onDocumentClick, apiURL }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
    {documents.map(doc => (
      <div 
        key={doc.doc_id} 
        onClick={() => onDocumentClick(doc)}
        className="cursor-pointer group"
      >
        <div className="relative aspect-w-16 aspect-h-9 mb-2">
          <img 
            src={`${apiURL}/${doc.thumbnail_url}`}
            alt="Thumbnail" 
            className="w-full h-full object-cover rounded-lg bg-gray-800 group-hover:opacity-80 transition"
            onError={(e) => { (e.target as HTMLImageElement).src = '/no-image.svg'; }}
          />
          {doc.media_type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-40 transition rounded-lg">
              <img 
                src="/play-icon.svg" 
                alt="Play Video" 
                className="w-12 h-12 opacity-80 group-hover:opacity-100 transition-transform group-hover:scale-110" 
              />
            </div>
          )}
          {doc.media_type === 'pdf' && (
            <div className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 pointer-events-none">
              <img 
                src="/file.svg" 
                alt="PDF Icon" 
                className="w-4 h-4" 
              />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-100 text-sm truncate group-hover:text-white transition">{doc.docname}</h3>
          <p 
            className="text-xs text-gray-400 max-h-12 overflow-hidden truncate"
            title={doc.docname || ''}
          >
            {doc.docname || "No title available."}
          </p>
          <p className="text-xs text-gray-400">{doc.doc_id}</p>
          <p className="text-xs text-gray-400">{doc.date}</p>
        </div>
      </div>
    ))}
  </div>
);