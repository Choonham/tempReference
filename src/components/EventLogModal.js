import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import './Modal.scss';
import EventLogPage from "../pages/EventLogPage";

const EventLogModal = ({show, onClose, simulatorId, eventLogId}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [t, i18n] = useTranslation('common');

    useEffect( () => {
        setIsVisible(show);
    }, [show]);

    const handleClose = () => {
        setIsVisible(false);
        onClose();
    };

    return isVisible ? (
        <div className="modal-overlay">
            <div className="modalEventLog">
                <EventLogPage simulatorId = {simulatorId} eventLogId = {eventLogId} />
                <button className="eventLogModal-close-button" onClick={handleClose}>
                    x
                </button>
            </div>
        </div>
    ) : null;
};

export default EventLogModal;