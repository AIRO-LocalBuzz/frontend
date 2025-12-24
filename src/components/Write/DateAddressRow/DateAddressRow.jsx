import React from 'react';
import prevIcon from '../../../assets/icons/common/icon-prev.svg';
import './DateAddressRow.css';

export default function DateAddressRow({travelDate, formatFullDate, onDateClick, onAddressClick, address}) {
  return (
    <div className="row date-address-row">
      {/* 날짜 버튼 */}
      <button
        type="button"
        className="input-button date-button"
        onClick={onDateClick}
      >
        <div className="label-group">
          <span className="label">날짜</span>
          <img src={prevIcon} alt="화살표" className="icon-arrow-down"/>
        </div>
        <span className="date-select">{formatFullDate(travelDate)}</span>
      </button>

      {/* 주소 버튼 */}
      <button
        type="button"
        className="input-button address-button"
        onClick={onAddressClick}
      >
        <div className="label-group">
          <span className="label">위치</span>
          <img src={prevIcon} alt="화살표" className="icon-arrow-down"/>
        </div>
        <span className="address-text">{address?.place_name}</span>
      </button>
    </div>
  );
}
