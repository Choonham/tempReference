import MainTabMenuCompo from "../components/MainTabMenuCompo";

const MainTabMenu = ({simulators, onChangeTabMenuSelected}) => {
    return (
        <MainTabMenuCompo
            simulators = {simulators}
            onChangeTabMenuSelected = {onChangeTabMenuSelected}
        />
    )
}

export default MainTabMenu;