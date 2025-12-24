import React from 'react';
import exitIcon from '../../../../assets/icons/common/icon-exit.svg'
import './ModalWrapper.css';

export default function ModalWrapper({children, onClose, onConfirm, confirmText = '설정'}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-inner">
          <div className="modal-header">
            <button className="modal-close-x" onClick={onClose}>
              <img src={exitIcon} alt="닫기"/>
            </button>
          </div>
          {children}
          <button className="modal-close-btn" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
