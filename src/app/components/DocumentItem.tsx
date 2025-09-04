import React, { useState, useRef, useEffect } from 'react';

// Define the Document interface so it can be used in other components
export interface Document {
  doc_id: number;
  title: string;
  abstract?: string;
  docnumber: string;
  docname: string;
  date: string;
  thumbnail_url: string;
  media_type: 'image' | 'video' | 'pdf';
  tags: string[];
}

interface DocumentItemProps {
    doc: Document;
    onDocumentClick: (doc: Document) => void;
    apiURL: string;
}

// This component renders a single document card
export const DocumentItem: React.FC<DocumentItemProps> = ({ doc, onDocumentClick, apiURL }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Logic to determine how many tags to show before creating a "+ more" button
  const MAX_VISIBLE_TAGS = 4;
  const hasOverflow = doc.tags.length > MAX_VISIBLE_TAGS;

  const visibleTags = hasOverflow
    ? doc.tags.slice(0, MAX_VISIBLE_TAGS) 
    : doc.tags;
  
  const hiddenCount = doc.tags.length - visibleTags.length;

  // Effect to handle clicks outside the popup to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && !popupRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopupVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsPopupVisible(false);
    }, 300); // Closes after 300ms
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };


  return (
    <div 
      onClick={() => onDocumentClick(doc)}
      className="cursor-pointer group flex flex-col"
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
            <img src="/play-icon.svg" alt="Play Video" className="w-12 h-12 opacity-80 group-hover:opacity-100 transition-transform group-hover:scale-110" />
          </div>
        )}
        {doc.media_type === 'pdf' && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-1 pointer-events-none">
            <img src="/file.svg" alt="PDF Icon" className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <h3 className="font-bold text-base text-black truncate group-hover:text-gray-400 transition">{doc.docname || "No title available."}</h3>
        <p className="text-xs text-gray-400">{doc.date}</p>
        
        {doc.tags && doc.tags.length > 0 && (
          <div className="relative mt-1">
            <div className="flex flex-wrap">
              {visibleTags.map((tag, index) => (
                <span key={index} className="bg-gray-200 text-black text-xs font-medium mr-1 mb-1 px-2 py-0.5 rounded-md">
                  {tag}
                </span>
              ))}
              {hasOverflow && (
                <button
                  ref={buttonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPopupVisible(prev => !prev);
                  }}
                  className="bg-gray-300 text-black text-xs font-medium mr-1 mb-1 px-2 py-0.5 rounded-md hover:bg-gray-400 transition-colors"
                >
                  +{hiddenCount}
                </button>
              )}
            </div>
            {isPopupVisible && hasOverflow && (
              <div
                ref={popupRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="absolute top-full left-0 mt-2 w-auto min-w-[150px] max-w-xs bg-white rounded-md shadow-lg p-2 z-10"
              >
                <div className="flex flex-wrap">
                  {doc.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-200 text-black text-xs font-medium mr-1 mb-1 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};