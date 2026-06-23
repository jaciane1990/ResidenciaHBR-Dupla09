import React, { useEffect } from 'react';
import { FiAlertTriangle, FiX, FiCheck } from 'react-icons/fi';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning'
}: ConfirmationModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Enter') {
        onConfirm();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <FiX className="w-12 h-12 text-red-500" />;
      case 'warning':
        return <FiAlertTriangle className="w-12 h-12 text-amber-500" />;
      case 'info':
        return <FiCheck className="w-12 h-12 text-blue-500" />;
      default:
        return <FiAlertTriangle className="w-12 h-12 text-amber-500" />;
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
      default:
        return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            {getIcon()}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            {title}
          </h3>

          <p className="text-gray-600 text-center mb-6">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 text-white rounded-xl font-medium transition focus:outline-none focus:ring-2 ${getConfirmButtonClass()}`}
            >
              {confirmText}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Pressione Enter para confirmar ou Esc para cancelar
          </p>
        </div>
      </div>
    </div>
  );
}