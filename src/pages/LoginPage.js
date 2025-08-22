import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {changeField, login} from "../state_modules/authState";
import {useTranslation} from "react-i18next";
import {v4 as uuidv4} from "uuid";

const LoginPage = () => {
    const dispatch = useDispatch();
    const [t, i18n] = useTranslation('common');
    const [lan, setLan] = useState("한국어");
    const [lanSelected, setLanSelected] = useState(false);

    useEffect(() => {
        if(!localStorage.getItem('uuid')) {
            const uuid = uuidv4();
            localStorage.setItem('uuid', uuid);
        }
    }, []);

    const changeToEng = () => {
        i18n.changeLanguage('en');
    };

    const changeToKo = () => {
        i18n.changeLanguage('ko');
    };

    useEffect(() => {
        if(i18n.language === "ko") {
            setLan("한국어");
        } else {
            setLan("English");
        }
    }, [t]);

    const {form, auth, authError, user} = useSelector(state => ({
        form: state.authState.login,
        auth: state.authState.auth,
        authError: state.authState.authError,
    }));

    const onChange = e => {
        const {value , name} = e.target;
        dispatch(
            changeField({
                key: name,
                value
            })
        );
    };

    const onSubmit = e => {
        e.preventDefault();
        const {name, password} = form;
        dispatch(login(name, password, localStorage.getItem('uuid')));
    };

    const [loginStatusMsg, setLoginStatusMsg] = useState();

    useEffect(() => {
        if(authError !== null) {
            setLoginStatusMsg(t('welcome.loginError'));
        } else if(auth) {
            if(!auth.success) {
                setLoginStatusMsg(t('welcome.loginInfoIncorrect'));
            }
        }
    }, [auth, authError]);

    return (
        <body>
        <div className="login_wrap">
            <div className="login_box">
                <header className="login_header">
                    <div className={"top_wrap login_lan_wrap"} >
                        <img src="style/img/img_logo_w.png" alt="로고"/>
                        <button type="button" className={lanSelected ? "btn on btn_global" : "btn btn_global"}
                                onMouseOver={() => {
                                    setLanSelected(true);
                                }}
                                onMouseOut={() => {
                                    setLanSelected(false);
                                }}
                        >
                            {lan}
                            <ul className="global_sub">
                                <li className={lan === "한국어" ? "global_sub_item on" : "global_sub_item"}>
                                    <a title="한국어" onClick={() => changeToKo()}>한국어</a>
                                </li>
                                <li className={lan === "English" ? "global_sub_item on" : "global_sub_item"}>
                                    <a title="ENGLISH" onClick={() => changeToEng()}>ENGLISH</a>
                                </li>
                            </ul>
                        </button>
                    </div>
                    <h1>AC Simulator</h1>
                </header>
                    <form className="login_contents" onSubmit={onSubmit}>
                    <input pattern=".{1,30}" required type="text" className="form-control input_lg" placeholder={t('welcome.enterID')} title={t('welcome.enterID')} autoComplete="on" name="name" onChange={onChange}/>
                    <input  pattern=".{1,30}" type="password" className="form-control input_lg mt_10" name="password" autoComplete="off" placeholder={t('welcome.enterPW')}
                           title={t('welcome.enterPW')}  onChange={onChange}/>
                    <p className="login_status_msg">{loginStatusMsg}</p>
                    <button className="btn btn_lg btn_blue w_100 mt_10 login_submit_button" type="submit">{t('welcome.login')}</button>
                </form>
            </div>
        </div>
        </body>
    )
}

export default LoginPage;
