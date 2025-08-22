import SideMenu from "../containers/SideMenu";
import MasterPage from "./MasterPage";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";

const IndexPage = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        if(localStorage.getItem('user')) {

        }
    }, []);

    return (
        <body>
            <div className="wrapper">
                <SideMenu/>
                <MasterPage/>
            </div>
        </body>
    )
}

export default IndexPage;