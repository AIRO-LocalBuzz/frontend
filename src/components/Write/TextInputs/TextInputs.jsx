import React from 'react';
import './TextInputs.css';

export default function TextInputs({ title, onTitleChange, content, onContentChange }) {
  return (
    <>
      <input
        type="text"
        value={title}
        onChange={onTitleChange}
        placeholder="제목을 입력하세요."
        className="input-title"
      />
      <textarea
        value={content}
        onChange={onContentChange}
        placeholder="내용을 입력하세요. (최대 20,000자)"
        rows={8}
        maxLength={20000}
        className="textarea-content"
      />
    </>
  );
}