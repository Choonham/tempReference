import MainTabMenu from "../containers/MainTabMenu";
import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {changeTabMenuSelected} from "../state_modules/menuState";
import DashboardPage from "./DashboardPage";
import ControlPanelPage from "./ControlPanelPage";
import {addEventLog} from "../state_modules/eventLogState";
import {getChargerInfo} from "../state_modules/chargerInfoState";

const MainPage = () => {
    const dispatch = useDispatch();
    const simulators = useSelector(state => state.simulatorInfoState.simulators);

    const onGetChargerInfo = id => dispatch(getChargerInfo(id));
    const tab = useSelector(state => state.menuState.tabMenu);
    const onChangeTabMenuSelected = useCallback(menu => dispatch(changeTabMenuSelected(menu)), [dispatch]);

    const getPageForTab = (_tab) => {
        if(_tab.tab === 0) {
            return (<DashboardPage simulators = {simulators} onGetChargerInfo={(id)=>onGetChargerInfo(id)}/>)
        } else {
            return (<ControlPanelPage key={_tab.tab} i={_tab.tab - 1}/>)
        }
    }

    return (
        <div className="masterContainer container">
            <MainTabMenu
                simulators={simulators}
                onChangeTabMenuSelected={onChangeTabMenuSelected}
            />
            {getPageForTab({tab})}
        </div>
    )
}

export default MainPage;