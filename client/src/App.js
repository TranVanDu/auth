import React, { Suspense, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import NarBar from "./components/screens/Navbar/Navbar";
import Footer from "./components/screens/Footer/Footer.js";
import { Spin } from "antd";
import { Routes } from "./routes/index";
import { getCookie } from "./helpers/session";
import { getAuthUser } from "./actions/AuthActions";
import { useSelector, useDispatch } from "react-redux";
import { InstagramOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

const Routing = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    // const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();
    useEffect(() => {
        let token = getCookie("insta_token");
        if (token) {
            if (user.user && user.isAuth) {
                history.push("/");
            } else {
                dispatch(getAuthUser()).then((res) => {
                    if (!res) {
                        history.push("/login");
                    } else {
                        if (history.location.pathname !== "/") {
                            history.push("/");
                        }
                    }
                });
            }
        } else {
            if (history.location.pathname !== "/login") history.push("/login");
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Switch>
            {Routes.map((item, index) => (
                <Route
                    key={index}
                    exact={item.exact}
                    path={item.path}
                    render={(props) => <item.component {...props} />}
                />
            ))}
            {/* <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} /> */}
        </Switch>
    );
};

function App() {
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);
    return (
        <Router>
            {!isLoading ? (
                <Suspense fallback={<Spin size="large" />}>
                    <NarBar />
                    <div className="Content">
                        <Routing />
                    </div>
                    <Footer />
                    <ToastContainer />
                </Suspense>
            ) : (
                <div
                    style={{
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <InstagramOutlined style={{ fontSize: "90px" }} />
                </div>
            )}
        </Router>
    );
}

export default App;
