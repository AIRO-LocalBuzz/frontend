import React from 'react';
import './CategorySelect.css';

const CategorySelect = ({ activeCategory, onCategoryClick }) => {
    const categories = ['체험', '음식점', '카페', '숙소', '기타'];

    return (
        <div className="choice">
            {categories.map((category) => (
                <button
                    key={category}
                    className={activeCategory === category ? 'active' : ''}
                    onClick={() => onCategoryClick(category)}
                >
                    <p>{category}</p>
                </button>
            ))}
        </div>
    );
};

export default CategorySelect;
