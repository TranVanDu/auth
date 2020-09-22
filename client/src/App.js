import React, { Suspense, useEffect, useState, useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Spin } from 'antd';
import { Routes } from './routes/index';
import { getCookie } from './helpers/session';
import { getAuthUser } from './actions/AuthActions';
import { useSelector, useDispatch } from 'react-redux';
import { InstagramOutlined } from '@ant-design/icons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';
import { configSocket } from './socket';
import NarBar from './components/screens/Navbar/Navbar';
import FooterPage from './components/screens/Footer/FooterPage.js';

const Routing = () => {
    const _isMounted = useRef(true);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    // const [isLoading, setIsLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        let token = getCookie('insta_token');
        if (token) {
            if (user.user && user.isAuth) {
                configSocket();
                // history.push('/');
            } else {
                dispatch(getAuthUser()).then((res) => {
                    if (_isMounted.current) {
                        if (!res) {
                            history.push('/login');
                        } else {
                            if (history.location.pathname !== '/') {
                                history.push('/');
                            }
                        }
                    }
                });
            }
        } else {
            if (_isMounted.current) {
                /*eslint-disable eqeqeq*/
                if (
                    history.location.pathname == '/login' ||
                    /confirm-password/.test(history.location.pathname)
                ) {
                    history.push(`${history.location.pathname}`);
                } else {
                    history.push('/login');
                }
            }
        }
        return () => {
            _isMounted.current = false;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Switch>
            {_isMounted.current &&
                Routes.map((item, index) => (
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
                    <FooterPage />
                    <ToastContainer />
                </Suspense>
            ) : (
                <div
                    style={{
                        height: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <InstagramOutlined style={{ fontSize: '90px' }} />
                </div>
            )}
        </Router>
    );
}

export default App;
