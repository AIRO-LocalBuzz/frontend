import React from 'react';
import { categoryOptions } from '../../../hooks/useWriteForm';
import prevIcon from '../../../assets/icons/common/icon-prev.svg';
import './CategorySelectRow.css';

export default function CategorySelectRow({ category, onCategoryClick }) {
  const selectedLabel = categoryOptions.find(opt => opt.key === category)?.label || '';
  return (
    <div className="row category-row">
      <button type="button" className={`input-button ${category ? '' : 'placeholder'}`} onClick={onCategoryClick}>
        <div className="label-group">
          <span className="label">카테고리</span>
          <img src={prevIcon} alt="화살표" className="icon-arrow-down"/>
        </div>
        <span className="category-select">{selectedLabel}</span>
      </button>
    </div>
  );
}
