import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import './Modal.scss';
import SimulatorSettingComp from "./SimulatorSettingComp";
import ChargerSettingComp from "./ChargerSettingComp";

const Modal = ({ show, onClose, status, simulator}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect( () => {
        setIsVisible(show);
    }, [show]);

    const handleClose = () => {
        setIsVisible(false);
        onClose();
    };

    const childContent = () => {
        if(status === 0) {
            return <SimulatorSettingComp simulator={simulator} handleClose={handleClose}/>;
        } else if(status === 1) {
            return <ChargerSettingComp simulator={simulator} handleClose={handleClose} />;
        }
    }

    return isVisible ? (
        <div className="modal-overlay">
            <div className="modalCls">
                <button className="close-button" onClick={handleClose}>
                    &times;
                </button>
                {childContent()}
            </div>
        </div>
    ) : null;
};

export default Modal;
