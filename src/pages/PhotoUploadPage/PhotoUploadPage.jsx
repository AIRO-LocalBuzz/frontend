import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePhoto } from '../../contexts/PhotoContext'
import './PhotoUploadPage.css'

export default function PhotoUploadPage() {
  const navigate = useNavigate()

  const { selectedPhotos, setSelectedPhotos } = usePhoto()
  const [allFiles, setAllFiles] = useState([])
  const [selectedIndexes, setSelectedIndexes] = useState([])
  const [initialPhotos, setInitialPhotos] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])

  // 1. 마운트 시 기존 selectedPhotos 반영
  useEffect(() => {
    if (selectedPhotos.length > 0) {
      setAllFiles(selectedPhotos)
      setSelectedIndexes(selectedPhotos.map((_, i) => i))
      setInitialPhotos(selectedPhotos)
    }
  }, [selectedPhotos])


  useEffect(() => {
    if (!allFiles.length) return

    const urls = allFiles.map(file => URL.createObjectURL(file))
    setPreviewUrls(urls)

    console.log('✅ Blob URLs:', urls)

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [allFiles])


  // 2. 새로 선택된 파일 추가
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)

    // 이미지 파일만 필터링
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    // allFiles 에 그냥 추가
    const newFiles = [...allFiles, ...imageFiles]

    // 중복 제거
    const fileNames = new Set(newFiles.map(f => f.name))
    const uniqueFiles = [...fileNames].map(name => newFiles.find(f => f.name === name))

    setAllFiles(uniqueFiles)

    console.log(allFiles)


    // 선택 상태는 자동 추가 X (사용자가 클릭해서 고르게 해야 함)
  }

  const isChanged = () => {
    const selected = selectedIndexes.map(i => allFiles[i])
    if (selected.length !== initialPhotos.length) return true

    for (let i = 0; i < selected.length; i++) {
      if (selected[i].name !== initialPhotos[i].name) return true
    }
    return false
  }

  const toggleSelect = (index) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(prev => prev.filter(i => i !== index))
    } else {
      if (selectedIndexes.length >= 10) {
        alert('사진은 최대 10장까지 선택할 수 있어요!')
        return
      }
      setSelectedIndexes(prev => [...prev, index])
    }
  }

  const handleComplete = () => {
    const selected = selectedIndexes.map(i => allFiles[i])
    setSelectedPhotos(selected)
    navigate('/write')
  }

  const handleCancel = () => {
    navigate('/write')
  }

  return (
    <div className="upload-page">
      {/* 헤더 */}
      <div className="upload-header">
        <button className="header-btn" onClick={handleCancel}>✕</button>
        <div className="header-title">
            {selectedIndexes.length > 0 ? `${selectedIndexes.length}장 선택됨 (최대 10장)` : '사진 선택'}
        </div>
      <button
        className={`header-btn complete ${isChanged() ? 'active' : ''}`}
        onClick={handleComplete}
        disabled={!isChanged()}
      >
        <span>완료</span>
      </button>
      </div>

      {/* 사진 업로드 버튼 */}
      <div className="file-upload-container">
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor="fileInput" className="custom-upload-button">
          <span className="upload-text">
              {selectedIndexes.length > 0 ? `사진 추가하기` : '사진 고르기'}
          </span>
        </label>
        {selectedIndexes.length > 0 && (
          <button className="custom-cancel-button" onClick={() => setSelectedIndexes([])}>
            전체 선택 취소
          </button>
        )}
      </div>

      {/* 사진 프리뷰 */}
      <div className="preview-grid">
        {previewUrls.map((url, idx) => {
          const selectedOrder = selectedIndexes.indexOf(idx)
          return (
            <div
              key={idx}
              className={`preview-item ${selectedOrder !== -1 ? 'selected' : ''}`}
              onClick={() => toggleSelect(idx)}
            >
              <img
                src={url}
                alt={`preview-${idx}`}
                className='preview-image'
              />
              {selectedOrder !== -1 && (
                <div className="selected-overlay">{selectedOrder + 1}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}