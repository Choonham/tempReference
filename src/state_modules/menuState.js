import {createAction, handleActions} from 'redux-actions';

const CHANGE_MENU_SELECTED = 'menuState/CHANGE_MENU_SELECTED';
const CHANGE_TAB_MENU_SELECTED = 'menuState/CHANGE_TAB_MENU_SELECTED';

export const MENUS = {
    Main: '메인',
    TestResult: '시험결과',
    EventLogs: '이벤트 로그',
    SimulatorConfig: '시뮬레이터 설정',
    ManageCharger: '충전기 관리',
    Statistics: '통계 페이지'
}

Object.freeze(MENUS);
export const changeMenuSelected = createAction(CHANGE_MENU_SELECTED, selected => ({menu: selected}));
export const changeTabMenuSelected = createAction(CHANGE_TAB_MENU_SELECTED, selected => ({tabMenu: selected}));

const initialMenuState = {
    menu: MENUS.Main,
    tabMenu: 0
}

const menuState = handleActions(
    {
        [CHANGE_MENU_SELECTED]: (state, action) => {
            return {
                ...state,
                menu: action.payload.menu,
            }
        },
        [CHANGE_TAB_MENU_SELECTED]: (state, action) => {
            return {
                ...state,
                tabMenu: action.payload.tabMenu,
            }
        }
    },
    initialMenuState
)

export default menuState;
