import {useTranslation} from "react-i18next";
import {useState} from "react";
import "./MainTabMenuCompo.scss";
import {useSelector} from "react-redux";
import authState from "../state_modules/authState";
const MainTabMenuCompo = ({simulators, onChangeTabMenuSelected}) => {
    const [t, i18n] = useTranslation('common');
    const [menuState, setMenuState] = useState(Array(simulators.length+1).fill(false));

    const toggleMenu = (index) => {
        const updatedMenuState = Array(simulators.length+1).fill(false);
        updatedMenuState[index] = true;
        setMenuState(updatedMenuState);
    };

    const [selected, setSelected] = useState(10);
    const [simulSubSelected, setSimulSubSelected] = useState(false);

    const authState = JSON.parse(localStorage.getItem('user'));
    const userGrade = authState === null ? "M" : authState.Grade;

    return (
        <div className="side_bar">
            <div className="side_bar_box">
                <div className="side_bar_con">
                    <div className="scroll_box scrollbar_custom">
                        <ul className="simulator_list">
                            {userGrade === "S" ? (
                                <li className={selected === 10 ? "simulator_item active" : "simulator_item"}>
                                    <a
                                        className={"icon_dashboard"}
                                        onClick={() => {
                                            onChangeTabMenuSelected(0);
                                            setSelected(10);
                                        }}
                                        >{t('tabBar.DashBoard')}
                                    </a>
                                </li>) :
                                null
                            }
                            <li className={simulSubSelected ? "simulator_item_gnb on" : "simulator_item_gnb"}>
                                <a className="icon_folder_arrow"
                                   onClick={() => {
                                    setSimulSubSelected(!simulSubSelected);
                                }}>
                                    <span className="icon_simultor_management">{t('tabBar.simulators')}</span>
                                </a>
                                <ul className="simulator_sub_list">
                                    {
                                        simulators.map((simulator, index) =>
                                            <li className={selected === index ? "simulator_item simulator_item_sub active" : "simulator_item simulator_item_sub"} key = {simulator.id}>
                                                <a onClick={() => {
                                                    onChangeTabMenuSelected(index+1);
                                                    setSelected(index);
                                                }} title={`${index + 1}`}>{simulator.simulatorName}</a>
                                            </li>)
                                    }
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainTabMenuCompo;
