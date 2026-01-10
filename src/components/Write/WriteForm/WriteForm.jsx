import React from 'react';
import DateAddressRow from '../DateAddressRow/DateAddressRow';
import CategorySelectRow from '../CategorySelectRow/CategorySelectRow';
import TagSelector from '../TagSelector/TagSelector';
import PhotoUploader from '../PhotoUploader/PhotoUploader';
import TextInputs from '../TextInputs/TextInputs';
import './WriteForm.css';

const withWhoTags = ['혼자', '친구', '가족', '연인'];
const forWhatTags = ['업무', '세미나', '학교', '힐링', '공부', '식도락'];
const emotionTagsList = ['행복', '설렘', '만족감', '충만함', '평온함', '여유로움', '감동', '벅차오름', '친근함', '따듯함'];

export default function WriteForm(props) {
  const {
    // Date & Address
    travelDate, formatFullDate, setModalOpen, navigate, address,
    // Category
    category,
    // Tags
    withWhoTag, setWithWhoTag, forWhatTag, setForWhatTag, emotionTags, handleEmotionTagClick,
    // Photos
    previewUrls,
    // Text
    title, setTitle, content, setContent,
    // State for navigation
    date, selectedPhotos
  } = props;

  const currentWriteState = {
    title, content, date, category, address, withWhoTag, forWhatTag, emotionTags, selectedPhotos
  };


  return (
    <div className="write-form">
      <DateAddressRow
        travelDate={travelDate}
        formatFullDate={formatFullDate}
        onDateClick={() => setModalOpen('date')}
        onAddressClick={() => navigate('/search', {
          state: {
            fromWrite: true,
            currentWriteState
          }
        })}
        address={address}
      />
      <CategorySelectRow
        category={category}
        onCategoryClick={() => setModalOpen('category')}
      />
      <TagSelector
        label="누구와 갔나요?"
        tags={withWhoTags}
        selectedTags={withWhoTag}
        onTagClick={setWithWhoTag}
        isMultiSelect={false}
      />
      <TagSelector
        label="왜 갔나요?"
        tags={forWhatTags}
        selectedTags={forWhatTag}
        onTagClick={setForWhatTag}
        isMultiSelect={false}
      />
      <TagSelector
        label="어떤 감정이었나요?"
        tags={emotionTagsList}
        selectedTags={emotionTags}
        onTagClick={handleEmotionTagClick}
        isMultiSelect={true}
      />
      <PhotoUploader
        previewUrls={previewUrls}
        onPhotoClick={() => navigate('/upload-photo', {
          state: {
            fromWrite: true,
            currentWriteState
          }
        })}
      />
      <TextInputs
        title={title}
        onTitleChange={(e) => setTitle(e.target.value)}
        content={content}
        onContentChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}
