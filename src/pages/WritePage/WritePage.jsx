import React, { useState } from 'react';
import { useWriteForm } from '../../hooks/useWriteForm';

import Statusbar from '../../components/Statusbar/Statusbar';
import WriteHeader from '../../components/Write/WriteHeader/WriteHeader';
import WriteForm from '../../components/Write/WriteForm/WriteForm';
import BottomActions from '../../components/Write/BottomActions/BottomActions';
import ModalWrapper from '../../components/Write/modals/ModalWrapper/ModalWrapper';
import DateModal from '../../components/Write/modals/DateModal/DateModal';
import CategoryModal from '../../components/Write/modals/CategoryModal/CategoryModal';

import './WritePage.css';

export default function WritePage() {
  const form = useWriteForm();

  // 카테고리 모달은 '선택' 후 '설정' 버튼을 누르므로 임시 상태가 필요
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(form.category);
  
  // 모달 닫기 로직
  const closeModal = () => form.setModalOpen(null);

  // 카테고리 모달 '설정' 버튼 핸들러
  const handleCategoryConfirm = () => {
    form.setCategory(selectedCategoryKey);
    closeModal();
  };
  
  // 날짜 변경 핸들러
  const handleDateChange = (value) => {
    form.setTravelDate(value);
    form.setDate(form.formatDateToLocalISO(value));
  };
  
  // 현재 폼 상태를 객체로 만들어 다른 페이지로 이동 시 전달
  const currentWriteState = {
    title: form.title, content: form.content, date: form.date, category: form.category,
    address: form.address, withWhoTag: form.withWhoTag, forWhatTag: form.forWhatTag,
    emotionTags: form.emotionTags
  };

  return (
    <div className="write-page">
      <Statusbar />
      <WriteHeader
        onBack={() => form.navigate('/review')}
        onSubmit={form.handleSubmit}
        isActive={form.isActive}
        loading={form.loading}
      />
      
      <WriteForm
        {...form} // 폼에 필요한 모든 props를 한번에 전달
        onCategoryModalOpen={() => {
          setSelectedCategoryKey(form.category);
          form.setModalOpen('category');
        }}
        currentWriteState={currentWriteState}
      />

      <BottomActions
        onCameraClick={() => form.navigate('/upload-photo', {
          state: { fromWrite: true, currentWriteState }
        })}
      />

      {/* 모달 렌더링 로직 */}
      {form.modalOpen && (
        <ModalWrapper
          onClose={closeModal}
          onConfirm={form.modalOpen === 'category' ? handleCategoryConfirm : closeModal}
        >
          {form.modalOpen === 'date' && (
            <DateModal 
              travelDate={form.travelDate}
              onDateChange={handleDateChange}
            />
          )}
          {form.modalOpen === 'category' && (
            <CategoryModal
              selectedKey={selectedCategoryKey}
              onSelect={setSelectedCategoryKey}
            />
          )}
        </ModalWrapper>
      )}
    </div>
  );
}