import React, { useState } from "react";
import RightMenu from "./sections/RigthMenu";
import { MenuFoldOutlined } from "@ant-design/icons";
import { Drawer, Button, Input } from "antd";
import { Link, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navbar.css";
const { Search } = Input;

const avatarDefault =
    "https://images.unsplash.com/photo-1440589473619-3cde28941638?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60";

function NavBar() {
    const [visible, setVisible] = useState(false);
    const user = useSelector((state) => state.user);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    return (
        <nav
            className="menu"
            style={{ position: "fixed", zIndex: 5, width: "100%" }}
        >
            <div className="menu__logo">
                <Link to={user.isAuth ? "/" : "/login"}>APP</Link>
            </div>
            <div className="menu__search">
                <Search
                    size="small"
                    placeholder="input search text"
                    onSearch={(value) => console.log(value)}
                />
            </div>
            <div className="menu__container">
                <div className="menu_rigth">
                    <RightMenu mode="horizontal" />
                </div>
                <Button
                    className="menu__mobile-button"
                    type="primary"
                    onClick={showDrawer}
                >
                    <MenuFoldOutlined />
                </Button>

                <Drawer
                    title={
                        <div style={{ display: "flex" }}>
                            <img
                                src={
                                    user.user.avatar
                                        ? user.user.avatar
                                        : avatarDefault
                                }
                                className="drawer__avatar"
                                alt="avatar"
                            />
                            <div
                                style={{
                                    fontSize: "12px",
                                    marginLeft: "10px",
                                }}
                            >
                                <div>{user.user.name}</div>
                                <div>{user.user.email}</div>
                            </div>
                        </div>
                    }
                    placement="right"
                    className="menu_drawer"
                    closable={false}
                    onClose={onClose}
                    visible={visible}
                >
                    <RightMenu mode="inline" />
                </Drawer>
            </div>
        </nav>
    );
}

export default withRouter(NavBar);
