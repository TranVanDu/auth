/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu } from "antd";
import { withRouter, Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../../../actions/AuthActions";

function RightMenu(props) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const history = useHistory();

    const logoutHandler = async () => {
        await dispatch(logOut());
        history.push("/login");
    };
    if (user.user && !user.isAuth) {
        return (
            <Menu mode={props.mode}>
                <Menu.Item key="login">
                    <Link to="/login">Signin</Link>
                </Menu.Item>
                <Menu.Item key="singup">
                    <Link to="/register">Signup</Link>
                </Menu.Item>
            </Menu>
        );
    } else {
        return (
            <Menu mode={props.mode}>
                <Menu.Item key="profile">
                    <Link to="/profile">Profile</Link>
                </Menu.Item>
                <Menu.Item key="chat">
                    <Link to="/chat">Chat</Link>
                </Menu.Item>
                <Menu.Item key="create-post">
                    <Link to="/create-post">Create Post</Link>
                </Menu.Item>
                <Menu.Item key="my-following">
                    <Link to="/my-following">MyFollowing</Link>
                </Menu.Item>
                <Menu.Item key="logout">
                    <a onClick={logoutHandler}>Logout</a>
                </Menu.Item>
            </Menu>
        );
    }
}

export default withRouter(RightMenu);
