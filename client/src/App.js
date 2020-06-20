import React, { Suspense, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import NarBar from "./components/screens/Navbar/Navbar";
import Footer from "./components/screens/footer/footer";
import { Spin } from "antd";
import Home from "./components/screens/Home/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Resgister";
import { getCookie } from "./helpers/session";
import { getAuthUser } from "./actions/AuthActions";
import { useSelector, useDispatch } from "react-redux";

const Routing = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
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
            history.push("/login");
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
        </Switch>
    );
};

function App() {
    return (
        <Router>
            <Suspense fallback={<Spin size="large" />}>
                <NarBar />
                <div
                    style={{
                        paddingTop: "69px",
                        minHeight: "calc(100vh - 60px)",
                    }}
                >
                    <Routing />
                </div>
                <Footer />
                <ToastContainer />
            </Suspense>
        </Router>
    );
}

export default App;
