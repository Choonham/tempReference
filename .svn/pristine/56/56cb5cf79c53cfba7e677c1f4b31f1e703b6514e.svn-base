import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

const ConfirmComp = ({msg, isOpen, onYes, onNo}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [t, i18n] = useTranslation('common');

    useEffect( () => {
        setIsVisible(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        onNo();
    };

    if (!isVisible) return null;

    return  (
        <div className="confirm-overlay">
            <div className="confirm-content">
                <p>{msg}</p>
                <button onClick={() => {
                    onYes();
                    handleClose();
                }}>{t('common.yes')}</button>
                <button onClick={() => {
                    onNo();
                    handleClose();
                }}>{t('common.no')}</button>
            </div>
        </div>
    );
};

export default ConfirmComp;