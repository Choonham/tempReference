import {useEffect, useState} from "react";

const AlertComp = ({msg, show, temp}) => {
    const [showAlert, setShowAlert] = useState(false);

    useEffect( () => {
        setShowAlert(show);
        console.log(msg + ":" + show);
    }, [show]);

    useEffect(() => {
        if(showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
                temp();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    return showAlert ? (
        <div className="alert">
            {msg}
        </div>
    ) : null;
};

export default AlertComp;