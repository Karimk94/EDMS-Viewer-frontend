import React from 'react';
import { DocumentItem, Document } from './DocumentItem'; // Import the new component and interface

interface DocumentListProps {
  documents: Document[];
  onDocumentClick: (doc: Document) => void;
  apiURL: string;
  faceRecogURL: string;
  onTagSelect: (tag: string) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ documents, onDocumentClick, apiURL, onTagSelect }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8">
    {documents.map(doc => (
      <DocumentItem 
        key={doc.doc_id} 
        doc={doc} 
        onDocumentClick={onDocumentClick}
        apiURL={apiURL}
        onTagSelect={onTagSelect}
      />
    ))}
  </div>
);

