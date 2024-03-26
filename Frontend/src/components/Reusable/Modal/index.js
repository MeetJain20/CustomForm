import React from 'react';
import classes from './Modal.module.css';
import { IoMdClose } from "react-icons/io";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.modalContent}>
                <button className={classes.closeButton} onClick={onClose}>
                    <IoMdClose size={27}/>
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
