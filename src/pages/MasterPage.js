import {useSelector} from "react-redux";
import {MENUS} from "../state_modules/menuState";
import MainPage from "./MainPage";
import EventLogPage from "./EventLogPage";
import TestResultPage from "./TestResultPage";
import SimulatorConfigPage from "./SimulatorConfigPage";
import ChargerConfigPage from "./ChargerConfigPage";
import {useEffect} from "react";
import $ from "jquery";
import StatisticsPage from "./StatisticsPage";

const MasterPage = () => {
    const menu = useSelector(state => state.menuState.menu);
    const pageForMenu =  (menu) => {
        switch (menu) {
            case MENUS.Main:
                return (<MainPage/>);
            case MENUS.TestResult:
                return (<TestResultPage/>);
            case MENUS.SimulatorConfig:
                return (<SimulatorConfigPage/>);
            case MENUS.ManageCharger:
                return (<ChargerConfigPage/>);
            case MENUS.Statistics:
                return (<StatisticsPage />);
        }
    }

    useEffect(() => {
        /* gnb */
        $('.gnb_item').mouseover(function () {
            $(this).addClass('on');
        });
        $('.gnb_item').mouseout(function () {
            $(this).removeClass('on');
        });
        /* gnb end */
    }, []);

    return (
        <div className={"masterContainer"}>
            {pageForMenu(menu)}
        </div>
    )
}

export default MasterPage;
