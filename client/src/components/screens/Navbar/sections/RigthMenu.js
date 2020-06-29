/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Menu, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { withRouter, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../../../actions/AuthActions";

const { confirm } = Modal;

function RightMenu(props) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    // const history = useHistory();

    const logoutHandler = () => {
        return confirm({
            title: "Bạn có muốn đăng xuất",
            icon: <ExclamationCircleOutlined />,
            okButtonProps: {
                loading: isLoading,
            },
            onOk: () => {
                setIsLoading(true);
                dispatch(logOut()).then(() => {
                    setIsLoading(false);
                    setTimeout(() => {
                        window.location.reload();
                    }, 800);
                });
            },
            onCancel() {},
        });
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
