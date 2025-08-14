import React from 'react';
import './TagSelector.css';

export default function TagSelector({ label, tags, selectedTags, onTagClick, isMultiSelect }) {
  const isSelected = (tag) => {
    return isMultiSelect ? selectedTags.includes(tag) : selectedTags === tag;
  };

  return (
    <div className="row label-tag-row">
      <p className="label">{label}</p>
      <div className="tag-group">
        {tags.map((tag, i) => (
          <button
            key={i}
            className={`tag-button ${isSelected(tag) ? 'selected' : ''}`}
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}