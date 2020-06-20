import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "../components/screens/Home/Home";
import Login from "../components/Auth/Auth";
import { getAuthUser } from "../actions/AuthActions";
import { connect } from "react-redux";
import { getCookie } from "../helpers/session";

// class Routing extends Component {
//     componentDidMount() {}
//     render() {
//         const { location, match, user, history } = this.props;
//         console.log(location, history);
//         // const token = getCookie("insta_token");
//         // if (location.pathname === "/") {
//         //     if (!token) {
//         //         return <Redirect to="/login" />;
//         //     }
//         // }
//         // // if (location.pathname === '/') {
//         // //     return <Route path='/' component={Container}/>;
//         // //  }
//         // if (location.pathname === "/") {
//         //     return <Redirect to={"/home"} />;
//         // }

//         return (
//             <Switch>
//                 <Route path="/" component={Home} />
//                 <Route path="/login" component={Login} />
//                 <Route path="/register" component={Login} />
//             </Switch>
//         );
//     }
// }

// const mapStateToProps = (state) => {
//     return {
//         user: state.user,
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         getAuthUser: () => dispatch(getAuthUser()),
//     };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Routing);
