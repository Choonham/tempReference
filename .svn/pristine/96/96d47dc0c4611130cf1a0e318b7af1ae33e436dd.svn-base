import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {useEffect, useState} from "react";
import { ko } from 'date-fns/locale';
import {useTranslation} from "react-i18next";

const DatePickerComp = (props) => {
    const [t, i18n] = useTranslation('common');
    const handleChange = props.handleChange;

    useEffect(() => {
        setSelectedDate(props.dateSet);
    }, [props.dateSet]);

    const [selectedDate, setSelectedDate] = useState(new Date());

    return <DatePicker
        selected={selectedDate}
        //onChange={(date) => setSelectedDate(date)}
        onChange={(date) => {
            handleChange(date);
            setSelectedDate(date);
        }}
        locale={ko}
        dateFormat="yyyy-MM-dd"
        autoComplete="off"
        {...props}
    />;
}

export default DatePickerComp;
