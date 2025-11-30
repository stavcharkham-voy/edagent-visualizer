import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const DetailModal = ({ isOpen, onClose, title, children, type = 'drawer' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal/Drawer */}
      <div
        className={`fixed z-50 bg-white dark:bg-gray-800 shadow-2xl transition-all duration-300 ${
          type === 'drawer'
            ? 'top-0 right-0 h-full w-full max-w-2xl'
            : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] rounded-lg'
        } ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className={`overflow-y-auto ${type === 'drawer' ? 'h-[calc(100%-73px)]' : 'max-h-[calc(90vh-73px)]'} p-6`}>
          {children}
        </div>
      </div>
    </>
  );
};

export default DetailModal;

