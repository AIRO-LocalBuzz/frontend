import React from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DateModal.css';

export default function DateModal({travelDate, onDateChange}) {
  const displayedDate = travelDate || new Date();
  return (
    <>
      <div className="modal-custom-date-header">
        <span className="date-title">날짜 : </span>
        {travelDate ? (
          <>
            <span className="year">{travelDate.getFullYear()}년</span>
            <span className="month">{travelDate.getMonth() + 1}월</span>
            <span className="date">{travelDate.getDate()}일</span>
          </>
        ) : (
          <span>선택된 날짜가 없습니다</span>
        )}
      </div>
      <ReactCalendar
        onChange={onDateChange}
        value={displayedDate}
        showNeighboringMonth={false}
        prev2Label={null}
        next2Label={null}
      />
    </>
  );
}
