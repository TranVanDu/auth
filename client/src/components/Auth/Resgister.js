import React, { useState } from "react";
// import ClassNames from "classnames";
import { Formik } from "formik";
import * as Yup from "yup";
import { useHistory, Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";
import {
    loginFacebook,
    loginGoogle,
    resgisterUser,
} from "../../actions/AuthActions";
import { useDispatch } from "react-redux";
import "./index.css";
// import { toast } from "react-toastify";

export default function Register(props) {
    const history = useHistory();
    // const user = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const responseFacebook = async (response) => {
        if (response.userID) {
            const data = {
                userID: response.userID,
                accessToken: response.accessToken,
            };
            let result = await dispatch(loginFacebook(data));
            if (result.data.isAuth) {
                history.push("/");
            }
        }
    };

    const responseGoogle = async (response) => {
        if (response.tokenId) {
            const data = {
                tokenId: response.tokenId,
            };
            let result = await dispatch(loginGoogle(data));
            if (result.data.isAuth) {
                history.push("/");
            }
        }
    };
    return (
        <div
            className="container
                right-panel-active"
        >
            <div className="form-container sign-up-container">
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                        name: "",
                        confirmPassword: "",
                    }}
                    onSubmit={async (values, { resetForm }) => {
                        setIsLoading(true);
                        try {
                            const data = { ...values };
                            delete data.confirmPassword;
                            let result = await dispatch(resgisterUser(data));
                            if (result) {
                                setTimeout(() => {
                                    setIsLoading(false);
                                    resetForm({});
                                    history.push("/login");
                                }, 800);
                            }
                            // let result = dispatch(resgisterUser(data));
                            // result.catch((err) => console.log(err))
                        } catch (err) {
                            setIsLoading(false);
                            console.log(err.data.message);
                            // toast.error(err.data.message);
                        }
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().required("Username is required"),
                        email: Yup.string()
                            .email("Email is invalid")
                            .required("Email is required"),
                        password: Yup.string()
                            .required("Password is required")
                            .min(6, "Password must have min 6 character"),
                        confirmPassword: Yup.string()
                            .oneOf(
                                [Yup.ref("password"), null],
                                "Password must match"
                            )
                            .required("Confirm Password is require"),
                    })}
                >
                    {(props) => {
                        const {
                            values,
                            touched,
                            errors,
                            // dirty,
                            // isSubmitting,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            //handleReset,
                        } = props;
                        return (
                            <form onSubmit={handleSubmit}>
                                <h1>Create Account</h1>
                                <div className="social-container">
                                    <FacebookLogin
                                        appId={
                                            process.env
                                                .REACT_APP_FACEBOOK_APP_ID
                                        }
                                        autoLoad={false}
                                        fields="name,email,picture"
                                        scope="public_profile,user_friends"
                                        callback={responseFacebook}
                                        cssClass="social"
                                        textButton={
                                            <i className="fab fa-facebook-f"></i>
                                        }
                                    />
                                    <GoogleLogin
                                        clientId={
                                            process.env
                                                .REACT_APP_GOOGLE_CLIENT_ID
                                        }
                                        render={(renderProps) => (
                                            <button
                                                className="social"
                                                onClick={renderProps.onClick}
                                                disabled={renderProps.disabled}
                                            >
                                                <i
                                                    className="fab fa-google-plus-g"
                                                    title="google"
                                                ></i>
                                            </button>
                                        )}
                                        buttonText="Login"
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                        cookiePolicy={"single_host_origin"}
                                    />
                                </div>
                                <span className="divider">
                                    or use your email for registration
                                </span>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.name && touched.name
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                />
                                {errors.name && touched.name && (
                                    <div className="input-feedback">
                                        {errors.name}
                                    </div>
                                )}
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.email && touched.email
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                />
                                {errors.email && touched.email && (
                                    <div className="input-feedback">
                                        {errors.email}
                                    </div>
                                )}
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.password && touched.password
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                />
                                {errors.password && touched.password && (
                                    <div className="input-feedback">
                                        {errors.password}
                                    </div>
                                )}
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.confirmPassword &&
                                        touched.confirmPassword
                                            ? "text-input error"
                                            : "text-input"
                                    }
                                />
                                {errors.confirmPassword &&
                                    touched.confirmPassword && (
                                        <div className="input-feedback">
                                            {errors.confirmPassword}
                                        </div>
                                    )}

                                <button
                                    type="submit"
                                    style={{ margin: "10px" }}
                                >
                                    {isLoading && (
                                        <i className="fa fa-spinner fa-spin" />
                                    )}
                                    Sign Up
                                </button>
                                <Link to="/login">
                                    Already have an account?
                                </Link>
                            </form>
                        );
                    }}
                </Formik>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Hello, Friend!</h1>
                        <p>
                            Enter your personal details and start journey with
                            us
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
