import SideMenuCompo from "../components/SideMenuCompo";
import {useDispatch} from "react-redux";
import {changeMenuSelected, changeTabMenuSelected, MENUS} from "../state_modules/menuState";
import {useCallback} from "react";

const SideMenu = () => {
    const dispatch = useDispatch();
    const onChangeMenu = useCallback(menu => {
        if(menu === MENUS.Main) {
            dispatch(changeTabMenuSelected(0));
        }
        dispatch(changeMenuSelected(menu));
    }, [dispatch]);

    return (
        <SideMenuCompo
            onChangeMenuSelected = {onChangeMenu}
        />
    )
}

export default SideMenu;