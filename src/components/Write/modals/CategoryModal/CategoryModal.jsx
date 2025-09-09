import React from 'react';
import { categoryOptions } from '../../../../hooks/useWriteForm';
import './CategoryModal.css';

export default function CategoryModal({ selectedKey, onSelect }) {
  return (
    <div className="modal-category-list custom-grid">
      {categoryOptions.map(({ key, label }) => (
        <button
          key={key}
          className={`modal-category-item ${selectedKey === key ? 'selected' : ''}`}
          onClick={() => onSelect(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}